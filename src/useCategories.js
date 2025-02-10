import { useState } from "react";

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  const addCategory = () => {
    const newCategory = {
      id: Date.now(),
      name: `Category ${categories.length + 1}`,
      tasks: [],
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategoryName = (id, newName) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name: newName } : cat))
    );
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const addTask = (categoryId, text) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              tasks: [
                ...cat.tasks,
                {
                  text,
                  completed: false,
                  timestamp: new Date().toLocaleString(),
                },
              ],
            }
          : cat
      )
    );
  };

  const deleteTask = (categoryId, taskIndex) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              tasks: cat.tasks.filter((_, i) => i !== taskIndex),
            }
          : cat
      )
    );
  };

  const toggleComplete = (categoryId, taskIndex) => {
    setCategories((prev) =>
      prev.map((cat) =>
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
