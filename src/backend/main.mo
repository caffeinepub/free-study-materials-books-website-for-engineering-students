import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  public type Resource = {
    id : Nat;
    title : Text;
    content : ResourceContent;
  };

  public type ResourceContent = {
    #url : Text;
    #externalBlob : Storage.ExternalBlob;
  };

  public type Subject = {
    id : Text;
    name : Text;
    resources : [Resource];
  };

  public type Semester = {
    id : Text;
    name : Text;
    subjects : [Subject];
  };

  public type Department = {
    id : Text;
    name : Text;
    semesters : [Semester];
  };

  public type UserProfile = {
    name : Text;
  };

  var accessControlState : AccessControl.AccessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let departments = Map.empty<Text, Department>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextResourceId = 0;

  let defaultSemesters : [Semester] = Array.tabulate(
    8,
    func(i) {
      let semesterNum = i + 1;
      {
        id = "semester" # semesterNum.toText();
        name = "Semester " # semesterNum.toText();
        subjects = [];
      };
    },
  );

  public query func getAllDepartments() : async [Department] {
    departments.values().toArray();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  public shared ({ caller }) func addDepartment(id : Text, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add departments");
    };
    let department : Department = {
      id;
      name;
      semesters = defaultSemesters;
    };
    departments.add(id, department);
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

  public shared ({ caller }) func addResource(departmentId : Text, semesterId : Text, subjectId : Text, title : Text, content : ResourceContent) : async () {
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
                    content;
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

  public shared ({ caller }) func editResource(departmentId : Text, semesterId : Text, subjectId : Text, resourceId : Nat, title : Text, content : ResourceContent) : async () {
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
                        content;
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

  public shared ({ caller }) func removeDepartment(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove departments");
    };
    departments.remove(id);
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

  // Seed the admin principal on first initialization
  system func preupgrade() {
    let seedAdminPrincipal = Principal.fromText("019c5b4d-8259-74a9-955b-9afe01e4fab7");
    AccessControl.assignRole(accessControlState, seedAdminPrincipal, seedAdminPrincipal, #admin);
  };
};
