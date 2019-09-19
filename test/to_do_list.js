var ToDoList = artifacts.require("ToDoList");

contract("ToDoList", function(accounts) {
  var to_do_list;
  var result;
  var ctr = 0;
  describe("updateList", async () => {
    it("creates list item correctly", async () => {
      to_do_list = await ToDoList.deployed();
      ctr++;
      result = await to_do_list.addItem("Item 1", { from: accounts[0] });
      result = await to_do_list.toDoList(ctr);
      assert.equal(result.title, "Item 1", `title should be 'title 1'`);
    });

    it("updates list item correctly", async () => {
      result = await to_do_list.updateItem(ctr, true, { from: accounts[0] });
      result = await to_do_list.toDoList(ctr);
      assert.equal(result.completed, true, `completed should be 'true'`);
    });

    it("deletes list item correctly", async () => {
      result = await to_do_list.deleteItem(ctr, { from: accounts[0] });
      result = await to_do_list.toDoList(ctr);
      assert.equal(result.deleted, true, `deleted should be 'true'`);
    });
  });
});
