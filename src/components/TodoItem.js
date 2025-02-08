import React from "react";

const TodoItem = ({ task, index, deleteTask, toggleComplete }) => {
  return (
    <li className={task.completed ? "completed" : ""}>
      <span onClick={() => toggleComplete(index)}>{task.text}</span>
      <button onClick={() => deleteTask(index)}>❌</button>
    </li>
  );
};

export default TodoItem;
