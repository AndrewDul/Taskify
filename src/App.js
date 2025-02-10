import React, { useRef, useState, useEffect, useCallback } from "react";
import useCategories from "./useCategories";

const App = () => {
  const {
    categories,
    addCategory,
    updateCategoryName,
    deleteCategory,
    addTask,
    deleteTask,
    toggleComplete,
  } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const [taskError, setTaskError] = useState("");
  const carouselRef = useRef(null);

  const handleAddCategory = useCallback(() => {
    addCategory();
    setTimeout(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollTo({
          left: carouselRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }, 100);
  }, [addCategory]);

  const checkCategoryExists = useCallback(() => {
    const searchLower = searchTerm.toLowerCase();
    return categories.some((cat) =>
      cat.name.toLowerCase().includes(searchLower)
    );
  }, [categories, searchTerm]);

  useEffect(() => {
    setSearchError(checkCategoryExists() ? "" : "Category not found");
  }, [checkCategoryExists]);

  const scroll = useCallback((direction) => {
    if (!carouselRef.current) return;

    const scrollAmount = direction === "left" ? -300 : 300;
    const newScrollPos = carouselRef.current.scrollLeft + scrollAmount;
    const maxScroll =
      carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

    carouselRef.current.scrollTo({
      left: Math.max(0, Math.min(newScrollPos, maxScroll)),
      behavior: "smooth",
    });
  }, []);

  const handleTaskAdd = useCallback(
    (e, categoryId) => {
      const textarea = e.target.previousElementSibling;
      const taskText = textarea?.value.trim();

      if (taskText) {
        addTask(categoryId, taskText);
        textarea.value = "";
      }
    },
    [addTask]
  );

  const handleTaskDelete = useCallback(
    (categoryId, taskIndex, isCompleted) => {
      if (!isCompleted) {
        setTaskError("Finish the task first!");
        setTimeout(() => setTaskError(""), 2000);
        return;
      }

      if (window.confirm("Are you sure you want to delete this task?")) {
        deleteTask(categoryId, taskIndex);
      }
    },
    [deleteTask]
  );

  return (
    <div className="container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Search categories"
        />
        {searchError && <div className="error-message">{searchError}</div>}
      </div>

      <div className="nav-buttons">
        <button
          onClick={() => scroll("left")}
          className="nav-btn"
          aria-label="Scroll left"
        >
          ←
        </button>
        <button
          onClick={() => scroll("right")}
          className="nav-btn"
          aria-label="Scroll right"
        >
          →
        </button>
      </div>

      <div className="categories-container" ref={carouselRef}>
        {categories
          .filter((cat) =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-header">
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) =>
                    updateCategoryName(category.id, e.target.value)
                  }
                  placeholder="Category name"
                  className="category-name"
                  maxLength={25}
                  aria-label="Category name"
                />
                <button
                  onClick={() => {
                    if (
                      window.confirm("Delete this category and all its tasks?")
                    ) {
                      deleteCategory(category.id);
                    }
                  }}
                  className="delete-category-btn"
                  aria-label="Delete category"
                >
                  ×
                </button>
              </div>

              <div className="tasks-list">
                {category.tasks.map((task, index) => (
                  <div
                    key={`${category.id}-${index}`}
                    className={`task-item ${task.completed ? "completed" : ""}`}
                    onClick={() => toggleComplete(category.id, index)}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      task.completed ? "Completed task" : "Uncompleted task"
                    }
                  >
                    <div className="task-content">
                      <span className="task-text">{task.text}</span>
                      <span className="task-date">
                        {new Date(task.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskDelete(category.id, index, task.completed);
                      }}
                      className="delete-task-btn"
                      aria-label="Delete task"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="new-task-container">
                <textarea
                  placeholder="New task (Shift + Enter for new line)"
                  className="task-input"
                  maxLength={200}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleTaskAdd(e, category.id);
                    }
                  }}
                  aria-label="New task input"
                />
                <button
                  onClick={(e) => handleTaskAdd(e, category.id)}
                  className="add-task-btn"
                  aria-label="Add task"
                >
                  ➤
                </button>
              </div>
            </div>
          ))}

        <button
          onClick={handleAddCategory}
          className="add-category-btn"
          aria-label="Add new category"
        >
          +
        </button>
      </div>

      {taskError && (
        <div className="error-message floating-error">{taskError}</div>
      )}
    </div>
  );
};

export default App;
