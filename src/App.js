import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import ToDoList from "./components/ToDoList/ToDoList";
import "font-awesome/css/font-awesome.min.css";

function App() {
  return (
    <div className="App">
      <ToDoList />
    </div>
  );
}

export default App;
