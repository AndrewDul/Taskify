import React, { useRef, useState } from "react";
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
  const carouselRef = useRef(null);

  const handleAddCategory = () => {
    addCategory();
    setTimeout(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollTo({
          left: carouselRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }, 0);
  };

  const handleSearch = () => {
    const foundCategory = categories.find((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (foundCategory) {
      setSearchError("");
      const categoryElement = document.getElementById(
        `category-${foundCategory.id}`
      );
      if (categoryElement && carouselRef.current) {
        const containerRect = carouselRef.current.getBoundingClientRect();
        const categoryRect = categoryElement.getBoundingClientRect();
        const scrollLeft =
          categoryRect.left -
          containerRect.left -
          containerRect.width / 2 +
          categoryRect.width / 2;

        carouselRef.current.scrollTo({
          left: carouselRef.current.scrollLeft + scrollLeft,
          behavior: "smooth",
        });
      }
    } else {
      setSearchError("Category not found.");
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="top-bar">
        <button onClick={scrollLeft}>◄</button>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>
        <button onClick={scrollRight}>►</button>
      </div>
      {searchError && <div className="search-error">{searchError}</div>}
      <div className="task-groups" ref={carouselRef}>
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            id={`category-${category.id}`}
            className="task-group"
          >
            <input
              type="text"
              placeholder="Category Name"
              value={category.name}
              onChange={(e) => updateCategoryName(category.id, e.target.value)}
            />
            <button onClick={() => deleteCategory(category.id)}>🗑️</button>
            <div className="tasks-container">
              {category.tasks.map((task, index) => (
                <div key={index} className="task-item">
                  <textarea
                    readOnly
                    value={task.text}
                    className={task.completed ? "completed" : ""}
                    onClick={() => toggleComplete(category.id, index)}
                  />
                  <button onClick={() => deleteTask(category.id, index)}>
                    ❌
                  </button>
                </div>
              ))}
            </div>
            <div className="task-input">
              <textarea
                placeholder="New Task"
                rows={5}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const textarea = e.target.previousElementSibling;
                  if (textarea && textarea.value.trim()) {
                    addTask(category.id, textarea.value); // Przekazujemy wartość pola tekstowego
                    textarea.value = "";
                  }
                }}
              >
                ⬅️
              </button>
            </div>
          </div>
        ))}
        <button className="add-category" onClick={handleAddCategory}>
          +
        </button>
      </div>
    </div>
  );
};

export default App;
