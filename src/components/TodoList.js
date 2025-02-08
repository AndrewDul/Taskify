import React from "react";
import TodoItem from "./TodoItem";

const TodoList = ({ tasks, deleteTask, toggleComplete }) => {
  return (
    <ul>
      {tasks.map((task, index) => (
        <TodoItem
          key={index}
          task={task}
          index={index}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
