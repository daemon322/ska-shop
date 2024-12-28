import { useState, useEffect } from "react";
import { FaSearch, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OtherProduct = ({ otherProducts, handleProductClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20; // Number of products per page
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentProducts, setCurrentProducts] = useState([]);
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || []
  );

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

  const handleAddToFavorites = (product) => {
    if (!favorites.some((fav) => fav.id === product.id)) {
      const updatedFavorites = [...favorites, product];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      toast.success(`${product.name} ha sido agregado a favoritos.`);
    } else {
      toast.info(`${product.name} ya está en favoritos.`);
    }
  };

  return (
    <div className="">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 md:text-start">
        Otros productos que podrían interesarte
      </h2>
      <div className="flex flex-wrap items-center justify-around md:justify-between">
        {/* Search Bar */}
        <div className="relative flex px-4 pb-2 mt-4 ">
          <div className="w-[300px] flex justify-end md:justify-center">
            <input
              type="text"
              placeholder="Buscar productos.."
              className="pr-8 py-2 border rounded-lg w-[300px] pl-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="relative text-gray-400 right-7 top-3" />
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="flex justify-end pr-7 ">
          <div className="flex items-center">
            <label className="text-gray-800 dark:text-gray-200">
              Precio mín
            </label>
            <input
              type="number"
              className="w-16 px-2 py-1 border rounded-lg"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="flex items-center">
            <label className="text-gray-800 dark:text-gray-200">
              Precio máx
            </label>
            <input
              type="number"
              className="w-16 px-2 py-1 border rounded-lg"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentProducts.map((product) => {
          const isOfferValid =
            product.offerEndTime && new Date(product.offerEndTime) > new Date();

          return (
            <div
              key={product.id}
              className="relative p-4 transition-shadow duration-300 bg-white rounded-lg shadow-lg cursor-pointer dark:bg-gray-800 hover:shadow-xl"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-48 rounded-lg"
                />
                {isOfferValid && (
                  <span className="absolute px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full shadow-md top-2 left-2">
                    Oferta
                  </span>
                )}
                {isOfferValid && (
                  <p className="absolute right-0 px-2 py-1 text-xs text-white bg-black top-2 rounded-s-md">
                    {product.discount}%
                  </p>
                )}
                <button
                  className="absolute p-2 text-white bg-red-500 rounded-full shadow-md bottom-2 right-2 hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToFavorites(product);
                  }}
                >
                  <FaHeart />
                </button>
              </div>
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
                {isOfferValid ? (
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
                ) : (
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Precio: S/ {product.originalPrice}
                  </p>
                )}
              </div>
            </div>
          );
        })}
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
