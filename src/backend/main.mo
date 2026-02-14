import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Resource = {
    id : Nat;
    title : Text;
    url : Text;
  };

  type Subject = {
    id : Text;
    name : Text;
    resources : [Resource];
  };

  type Semester = {
    id : Text;
    name : Text;
    subjects : [Subject];
  };

  type Department = {
    id : Text;
    name : Text;
    semesters : [Semester];
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let departments = Map.empty<Text, Department>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextResourceId = 0;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public read access - no authentication required for students
  public query func getAllDepartments() : async [Department] {
    departments.values().toArray();
  };

  // Admin-only: Add operations
  public shared ({ caller }) func addDepartment(id : Text, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add departments");
    };
    let department : Department = {
      id;
      name;
      semesters = [];
    };
    departments.add(id, department);
  };

  public shared ({ caller }) func addSemester(departmentId : Text, id : Text, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add semesters");
    };
    let department = switch (departments.get(departmentId)) {
      case (?d) { d };
      case (null) { Runtime.trap("Department does not exist") };
    };
    let semester : Semester = {
      id;
      name;
      subjects = [];
    };
    let updatedDepartment : Department = {
      department with
      semesters = department.semesters.concat([semester]);
    };
    departments.add(departmentId, updatedDepartment);
  };

  public shared ({ caller }) func addSubject(departmentId : Text, semesterId : Text, id : Text, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add subjects");
    };
    let department = switch (departments.get(departmentId)) {
      case (?d) { d };
      case (null) { Runtime.trap("Department does not exist") };
    };

    let updatedSemesters = Array.tabulate(
      department.semesters.size(),
      func(i) {
        let semester = department.semesters[i];
        if (semester.id == semesterId) {
          {
            semester with
            subjects = semester.subjects.concat([{
              id;
              name;
              resources = [];
            }]);
          };
        } else {
          semester;
        };
      }
    );

    let updatedDepartment : Department = {
      department with
      semesters = updatedSemesters;
    };
    departments.add(departmentId, updatedDepartment);
  };

  public shared ({ caller }) func addResource(departmentId : Text, semesterId : Text, subjectId : Text, title : Text, url : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add resources");
    };
    let department = switch (departments.get(departmentId)) {
      case (?d) { d };
      case (null) { Runtime.trap("Department does not exist") };
    };

    let updatedSemesters = Array.tabulate(
      department.semesters.size(),
      func(i) {
        let semester = department.semesters[i];
        if (semester.id == semesterId) {
          let updatedSubjects = Array.tabulate(
            semester.subjects.size(),
            func(j) {
              let subject = semester.subjects[j];
              if (subject.id == subjectId) {
                {
                  subject with
                  resources = subject.resources.concat([{
                    id = nextResourceId;
                    title;
                    url;
                  }]);
                };
              } else {
                subject;
              };
            }
          );
          {
            semester with
            subjects = updatedSubjects;
          };
        } else {
          semester;
        };
      }
    );

    let updatedDepartment : Department = {
      department with
      semesters = updatedSemesters;
    };
    departments.add(departmentId, updatedDepartment);
    nextResourceId += 1;
  };

  // Admin-only: Edit operations
  public shared ({ caller }) func editDepartment(id : Text, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit departments");
    };
    let department = switch (departments.get(id)) {
      case (?d) { d };
      case (null) { Runtime.trap("Department does not exist") };
    };
    let updatedDepartment : Department = {
      department with
      name = name;
    };
    departments.add(id, updatedDepartment);
  };

  public shared ({ caller }) func editSemester(departmentId : Text, semesterId : Text, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit semesters");
    };
    let department = switch (departments.get(departmentId)) {
      case (?d) { d };
      case (null) { Runtime.trap("Department does not exist") };
    };

    let updatedSemesters = Array.tabulate(
      department.semesters.size(),
      func(i) {
        let semester = department.semesters[i];
        if (semester.id == semesterId) {
          {
            semester with
            name = name;
          };
        } else {
          semester;
        };
      }
    );

    let updatedDepartment : Department = {
      department with
      semesters = updatedSemesters;
    };
    departments.add(departmentId, updatedDepartment);
  };

  public shared ({ caller }) func editSubject(departmentId : Text, semesterId : Text, subjectId : Text, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit subjects");
    };
    let department = switch (departments.get(departmentId)) {
      case (?d) { d };
      case (null) { Runtime.trap("Department does not exist") };
    };

    let updatedSemesters = Array.tabulate(
      department.semesters.size(),
      func(i) {
        let semester = department.semesters[i];
        if (semester.id == semesterId) {
          let updatedSubjects = Array.tabulate(
            semester.subjects.size(),
            func(j) {
              let subject = semester.subjects[j];
              if (subject.id == subjectId) {
                {
                  subject with
                  name = name;
                };
              } else {
                subject;
              };
            }
          );
          {
            semester with
            subjects = updatedSubjects;
          };
        } else {
          semester;
        };
      }
    );

    let updatedDepartment : Department = {
      department with
      semesters = updatedSemesters;
    };
    departments.add(departmentId, updatedDepartment);
  };

  public shared ({ caller }) func editResource(departmentId : Text, semesterId : Text, subjectId : Text, resourceId : Nat, title : Text, url : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit resources");
    };
    let department = switch (departments.get(departmentId)) {
      case (?d) { d };
      case (null) { Runtime.trap("Department does not exist") };
    };

    let updatedSemesters = Array.tabulate(
      department.semesters.size(),
      func(i) {
        let semester = department.semesters[i];
        if (semester.id == semesterId) {
          let updatedSubjects = Array.tabulate(
            semester.subjects.size(),
            func(j) {
              let subject = semester.subjects[j];
              if (subject.id == subjectId) {
                let updatedResources = Array.tabulate(
                  subject.resources.size(),
                  func(k) {
                    let resource = subject.resources[k];
                    if (resource.id == resourceId) {
                      {
                        id = resourceId;
                        title;
                        url;
                      };
                    } else {
                      resource;
                    };
                  }
                );
                {
                  subject with
                  resources = updatedResources;
                };
              } else {
                subject;
              };
            }
          );
          {
            semester with
            subjects = updatedSubjects;
          };
        } else {
          semester;
        };
      }
    );

    let updatedDepartment : Department = {
      department with
      semesters = updatedSemesters;
    };
    departments.add(departmentId, updatedDepartment);
  };

  // Admin-only: Remove operations
  public shared ({ caller }) func removeDepartment(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove departments");
    };
    departments.remove(id);
  };

  public shared ({ caller }) func removeSemester(departmentId : Text, semesterId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove semesters");
    };
    let department = switch (departments.get(departmentId)) {
      case (?d) { d };
      case (null) { Runtime.trap("Department does not exist") };
    };

    let updatedSemesters = department.semesters.filter(
      func(semester : Semester) : Bool {
        semester.id != semesterId;
      }
    );

    let updatedDepartment : Department = {
      department with
      semesters = updatedSemesters;
    };
    departments.add(departmentId, updatedDepartment);
  };

  public shared ({ caller }) func removeSubject(departmentId : Text, semesterId : Text, subjectId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove subjects");
    };
    let department = switch (departments.get(departmentId)) {
      case (?d) { d };
      case (null) { Runtime.trap("Department does not exist") };
    };

    let updatedSemesters = Array.tabulate(
      department.semesters.size(),
      func(i) {
        let semester = department.semesters[i];
        if (semester.id == semesterId) {
          let updatedSubjects = semester.subjects.filter(
            func(subject : Subject) : Bool {
              subject.id != subjectId;
            }
          );
          {
            semester with
            subjects = updatedSubjects;
          };
        } else {
          semester;
        };
      }
    );

    let updatedDepartment : Department = {
      department with
      semesters = updatedSemesters;
    };
    departments.add(departmentId, updatedDepartment);
  };

  public shared ({ caller }) func removeResource(departmentId : Text, semesterId : Text, subjectId : Text, resourceId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove resources");
    };
    let department = switch (departments.get(departmentId)) {
      case (?d) { d };
      case (null) { Runtime.trap("Department does not exist") };
    };

    let updatedSemesters = Array.tabulate(
      department.semesters.size(),
      func(i) {
        let semester = department.semesters[i];
        if (semester.id == semesterId) {
          let updatedSubjects = Array.tabulate(
            semester.subjects.size(),
            func(j) {
              let subject = semester.subjects[j];
              if (subject.id == subjectId) {
                let updatedResources = subject.resources.filter(
                  func(resource : Resource) : Bool {
                    resource.id != resourceId;
                  }
                );
                {
                  subject with
                  resources = updatedResources;
                };
              } else {
                subject;
              };
            }
          );
          {
            semester with
            subjects = updatedSubjects;
          };
        } else {
          semester;
        };
      }
    );

    let updatedDepartment : Department = {
      department with
      semesters = updatedSemesters;
    };
    departments.add(departmentId, updatedDepartment);
  };
};
