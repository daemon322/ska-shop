const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
    return (
      <div className="flex flex-wrap justify-center mb-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 mx-1 rounded ${
              selectedCategory === category
                ? "bg-black text-white"
                : "bg-transparent hover:bg-white text-white hover:text-black"
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    );
  };
  
  export default CategoryFilter;
  