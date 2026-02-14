import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type OldResource = {
    id : Nat;
    title : Text;
    url : Text;
  };

  type OldSubject = {
    id : Text;
    name : Text;
    resources : [OldResource];
  };

  type OldSemester = {
    id : Text;
    name : Text;
    subjects : [OldSubject];
  };

  type OldDepartment = {
    id : Text;
    name : Text;
    semesters : [OldSemester];
  };

  type OldActor = {
    departments : Map.Map<Text, OldDepartment>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    nextResourceId : Nat;
    defaultSemesters : [OldSemester];
  };

  type NewResource = {
    id : Nat;
    title : Text;
    content : {
      #url : Text;
      #externalBlob : Storage.ExternalBlob;
    };
  };

  type NewSubject = {
    id : Text;
    name : Text;
    resources : [NewResource];
  };

  type NewSemester = {
    id : Text;
    name : Text;
    subjects : [NewSubject];
  };

  type NewDepartment = {
    id : Text;
    name : Text;
    semesters : [NewSemester];
  };

  type NewActor = {
    departments : Map.Map<Text, NewDepartment>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    nextResourceId : Nat;
    defaultSemesters : [NewSemester];
  };

  public func run(old : OldActor) : NewActor {
    let newDepartments = old.departments.map<Text, OldDepartment, NewDepartment>(
      func(_id, oldDepartment) {
        {
          oldDepartment with
          semesters = oldDepartment.semesters.map(
            func(oldSemester) {
              {
                oldSemester with
                subjects = oldSemester.subjects.map(
                  func(oldSubject) {
                    {
                      oldSubject with
                      resources = oldSubject.resources.map(
                        func(oldResource) {
                          {
                            oldResource with
                            content = #url(oldResource.url);
                          };
                        }
                      );
                    };
                  }
                );
              };
            }
          );
        };
      }
    );

    let newDefaultSemesters = old.defaultSemesters.map(
      func(oldSemester) {
        {
          oldSemester with
          subjects = oldSemester.subjects.map(
            func(oldSubject) {
              {
                oldSubject with
                resources = oldSubject.resources.map(
                  func(oldResource) {
                    {
                      oldResource with
                      content = #url(oldResource.url);
                    };
                  }
                );
              };
            }
          );
        };
      }
    );

    {
      old with
      departments = newDepartments;
      defaultSemesters = newDefaultSemesters;
    };
  };
};
