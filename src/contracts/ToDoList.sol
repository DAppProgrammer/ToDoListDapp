pragma solidity ^0.5.0;

contract ToDoList {
  struct ToDoItem {
    uint id;
    string title;
    bool completed;
    bool deleted;
  }
  mapping(uint => ToDoItem) public toDoList;
  uint public ctr;

  event Add (uint ctr);
  function addItem(string memory _title) public returns(bool) {
    ctr += 1;
    toDoList[ctr] = ToDoItem(ctr, _title, false, false);
    emit Add(ctr);
    return true;
  }

  event Update (uint ctr);
  function updateItem(uint _ctr, bool _completed) public returns(bool) {
    toDoList[_ctr].completed = _completed;
    emit Update(ctr);
    return true;
  }
  
  event Delete (uint ctr);
  function deleteItem(uint _ctr) public returns(bool) {
    toDoList[_ctr].deleted = true;
    emit Delete(ctr);
    return true;
  }

}
