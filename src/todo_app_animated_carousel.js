import React, { useRef, useEffect } from "react";
import useCategories from "./useCategories";

const TodoAppAnimatedCarousel = () => {
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
  const carouselRef = useRef(null);

  useEffect(() => {
    if (searchTerm && carouselRef.current) {
      const index = categories.findIndex((cat) =>
        cat.name.includes(searchTerm)
      );
      if (index !== -1) {
        carouselRef.current.style.transition = "transform 0.5s ease-in-out";
        carouselRef.current.style.transform = `rotateY(${index * -30}deg)`;
      }
    }
  }, [searchTerm, categories]);

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>🔍</button>
      </div>

      <div className="task-groups-container" ref={carouselRef}>
        <div className="task-groups">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`task-group ${
                category.name.includes(searchTerm) ? "highlight" : ""
              }`}
            >
              <input
                type="text"
                placeholder="Category Name"
                value={category.name}
                onChange={(e) =>
                  updateCategoryName(category.id, e.target.value)
                }
              />
              <ul>
                {category.tasks.map((task, index) => (
                  <li key={index}>
                    <span
                      onClick={() => toggleComplete(category.id, index)}
                      className={task.completed ? "completed" : ""}
                    >
                      {task.text}
                    </span>
                    <button onClick={() => deleteTask(category.id, index)}>
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="New Task"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value) {
                    addTask(category.id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          ))}
        </div>
        <button className="add-category" onClick={addCategory}>
          +
        </button>
      </div>
    </div>
  );
};

export default TodoAppAnimatedCarousel;
