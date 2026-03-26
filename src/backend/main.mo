import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

actor {
  type Submission = {
    id : Nat;
    firstName : Text;
    lastName : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  var nextId = 0;
  let submissions = List.empty<Submission>();

  public shared ({ caller }) func submitContact(firstName : Text, lastName : Text, email : Text, message : Text, timestamp : Int) : async () {
    let submission : Submission = {
      id = nextId;
      firstName;
      lastName;
      email;
      message;
      timestamp;
    };
    submissions.add(submission);
    nextId += 1;
  };

  public query ({ caller }) func getAllSubmissions() : async [Submission] {
    submissions.toArray();
  };

  public query ({ caller }) func getSubmissionById(id : Nat) : async Submission {
    switch (submissions.find(func(sub) { sub.id == id })) {
      case (null) { Runtime.trap("Submission does not exist") };
      case (?submission) { submission };
    };
  };

  public query ({ caller }) func getSubmissionsByEmail(email : Text) : async [Submission] {
    submissions.filter(func(sub) { sub.email == email }).toArray();
  };

  public query ({ caller }) func getLatestSubmissions(count : Nat) : async [Submission] {
    if (count == 0) { return Array.empty<Submission>() };
    let total = submissions.size();
    let actualCount = if (total < count) { total } else { count };
    if (actualCount == total) { return submissions.toArray() };
    let array = submissions.toArray();
    let reversed = array.reverse();
    reversed.sliceToArray(0, actualCount);
  };
};
