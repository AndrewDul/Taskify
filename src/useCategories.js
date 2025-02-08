import { useState } from "react";

const useCategories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "", tasks: [] },
  ]);

  const addCategory = () => {
    setCategories([...categories, { id: Date.now(), name: "", tasks: [] }]);
  };

  const updateCategoryName = (id, newName) => {
    setCategories(
      categories.map((cat) => (cat.id === id ? { ...cat, name: newName } : cat))
    );
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const addTask = (categoryId, task) => {
    if (!task.trim()) return;
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, tasks: [...cat.tasks, { text: task, completed: false }] }
          : cat
      )
    );
  };

  const deleteTask = (categoryId, taskIndex) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, tasks: cat.tasks.filter((_, i) => i !== taskIndex) }
          : cat
      )
    );
  };

  const toggleComplete = (categoryId, taskIndex) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              tasks: cat.tasks.map((task, i) =>
                i === taskIndex ? { ...task, completed: !task.completed } : task
              ),
            }
          : cat
      )
    );
  };

  return {
    categories,
    addCategory,
    updateCategoryName,
    deleteCategory,
    addTask,
    deleteTask,
    toggleComplete,
  };
};

export default useCategories;
