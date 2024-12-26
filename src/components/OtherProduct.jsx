import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const OtherProduct = ({ otherProducts, handleProductClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20; // Number of products per page
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentProducts, setCurrentProducts] = useState([]);

  useEffect(() => {
    // Filter products by search term (name, brand, or category) and price range
    const filteredProducts = otherProducts.filter((product) => {
      const matchesSearchTerm =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriceRange =
        (minPrice === "" || product.price >= parseFloat(minPrice)) &&
        (maxPrice === "" || product.price <= parseFloat(maxPrice));
      return matchesSearchTerm && matchesPriceRange;
    });

    // Get current products for the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    setCurrentProducts(
      filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    );
  }, [searchTerm, minPrice, maxPrice, currentPage, otherProducts]);

  // Calculate total pages
  const totalPages = Math.ceil(
    otherProducts.filter((product) => {
      const matchesSearchTerm =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriceRange =
        (minPrice === "" || product.price >= parseFloat(minPrice)) &&
        (maxPrice === "" || product.price <= parseFloat(maxPrice));
      return matchesSearchTerm && matchesPriceRange;
    }).length / productsPerPage
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate the range of page numbers to display
  const getPaginationRange = () => {
    const range = [];
    const maxPagesToShow = 5; // Maximum number of page numbers to show
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Otros productos que podrían interesarte
      </h2>

      {/* Search Bar */}
      <div className="relative mt-4 mb-6">
        <input
          type="text"
          placeholder="Buscar productos por nombre, marca o categoría..."
          className="w-full px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute text-gray-400 top-3 right-3" />
      </div>

      {/* Price Range Filter */}
      <div className="flex flex-col justify-between mb-6 space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex items-center">
          <label className="mr-2 text-gray-800 dark:text-gray-200">
            Precio mínimo:
          </label>
          <input
            type="number"
            className="w-24 px-2 py-1 border rounded-lg"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="flex items-center">
          <label className="mr-2 text-gray-800 dark:text-gray-200">
            Precio máximo:
          </label>
          <input
            type="number"
            className="w-24 px-2 py-1 border rounded-lg"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="p-4 transition-shadow duration-300 bg-white rounded-lg shadow-lg cursor-pointer dark:bg-gray-800 hover:shadow-xl"
            onClick={() => handleProductClick(product.id)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-48 rounded-lg"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Categoría:{" "}
                <span className="font-medium">{product.category}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Marca: <span className="font-medium">{product.marca}</span>
              </p>
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Precio original:{" "}
                  <span className="text-red-500 line-through">
                    S/ {product.originalPrice}
                  </span>
                </p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  Precio con descuento: S/ {product.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <nav>
          <ul className="flex items-center space-x-2">
            <li>
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                className="flex items-center p-2 text-gray-800 transition duration-300 bg-white rounded-lg hover:bg-black hover:text-white"
                disabled={currentPage === 1}
              >
                Prev
              </button>
            </li>
            {getPaginationRange().map((page) => (
              <li key={page}>
                <button
                  onClick={() => paginate(page)}
                  className={`px-4 py-2  rounded-lg ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "bg-white text-gray-800"
                  } hover:bg-gray-800 hover:text-white transition duration-300`}
                >
                  {page}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() =>
                  paginate(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
                className="flex items-center p-2 text-gray-800 transition duration-300 bg-white rounded-lg hover:bg-black hover:text-white"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default OtherProduct;
