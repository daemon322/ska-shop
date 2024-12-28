import { useState, useEffect } from "react";
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaRegStar,
  FaClock,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "../components/Cart"; // Importa el componente Cart
import { useNavigate } from "react-router-dom";

const OtherProduct = ({ otherProducts, handleProductClick, onAddToCart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const productsPerPage = 20; // Number of products per page
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentProducts, setCurrentProducts] = useState([]);
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  useEffect(() => {
    // Filter products by search term (name, brand, or category) and price range
    const filteredProducts = otherProducts.filter((product) => {
      const matchesSearchTerm =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriceRange =
        (minPrice === "" || product.originalPrice >= parseFloat(minPrice)) &&
        (maxPrice === "" || product.originalPrice <= parseFloat(maxPrice));
      return matchesSearchTerm && matchesPriceRange;
    });

    // Get current products for the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    setCurrentProducts(
      filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    );
  }, [searchTerm, minPrice, maxPrice, currentPage, otherProducts]);

  useEffect(() => {
    // Reset to page 1 when search term or price range changes
    setCurrentPage(1);
  }, [searchTerm, minPrice, maxPrice]);
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
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
    const maxPagesToShow = 4; // Maximum number of page numbers to show
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

  const handleAddToCart = (product) => {
    const selectedSize = selectedOptions[product.id]?.size;
    const selectedColor = selectedOptions[product.id]?.color;

    if (selectedSize && selectedColor) {
      const price =
        product.offerEndTime && new Date(product.offerEndTime) > new Date()
          ? product.price
          : product.originalPrice;
      const item = {
        ...product,
        quantity: 1,
        selectedSize,
        selectedColor,
        price,
      };
      const existingItemIndex = cartItems.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.selectedSize === item.selectedSize &&
          cartItem.selectedColor === item.selectedColor
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += 1;
        setCartItems(updatedCart);
      } else {
        const updatedCart = [...cartItems, item];
        setCartItems(updatedCart);
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setIsCartModalOpen(true);
      toast.success("Producto añadido al carrito correctamente!");
    } else {
      toast.error("Por favor, seleccione una talla y un color.");
    }
  };

  const handleOptionChange = (productId, optionType, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [productId]: {
        ...prevOptions[productId],
        [optionType]: value,
      },
    }));
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    return Array.from({ length: totalStars }, (_, index) =>
      index < rating ? (
        <FaStar key={index} className="text-yellow-400" />
      ) : (
        <FaRegStar key={index} className="text-gray-300" />
      )
    );
  };

  const formatTime = (ms) => {
    if (ms <= 0) return "Oferta vencida";

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} día${days > 1 ? "s" : ""}${
        hours > 0 ? `, ${hours} hora${hours > 1 ? "s" : ""}` : ""
      }`;
    }

    if (hours > 0) {
      return `${hours} hora${hours > 1 ? "s" : ""}${
        minutes > 0 ? `, ${minutes} minuto${minutes > 1 ? "s" : ""}` : ""
      }`;
    }

    if (minutes > 0) {
      return `${minutes} minuto${minutes > 1 ? "s" : ""}`;
    }

    return `${seconds} segundo${seconds > 1 ? "s" : ""}`;
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

      <div className="flex flex-wrap justify-around w-full py-2">
        {otherProducts.map((product) => {
          const isOfferValid =
            product.offerEndTime && new Date(product.offerEndTime) > new Date();
          const stockPercentage =
            product.stock > 0
              ? (product.stock / product.initialStock) * 100
              : 0;
          const averageRating =
            product.reviews?.reduce((acc, review) => acc + review.rating, 0) /
              product.reviews?.length || 0;

          return (
            <div key={product.id} className="pb-4 ">
              <div className="relative flex flex-col transition-all duration-300 shadow-lg bg-gradient-to-t from-white to-gray-100 dark:from-black dark:to-gray-700 rounded-xl group hover:shadow-2xl h-[480px] w-[305px]">
                {isOfferValid && (
                  <div className="absolute right-0 z-10 flex items-center px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-tl-full bottom-[220px] animate-pulse">
                    <FaClock className="inline mr-1" />
                    {formatTime(new Date(product.offerEndTime) - new Date())}
                  </div>
                )}

                {isOfferValid && product.tag && (
                  <div className="absolute left-0 z-10 px-3 py-1 text-xs font-bold text-white bg-black rounded-r-full shadow-md cursor-default top-3 ">
                    <p className="relative italic font-bold text-center border-b border-yellow-500 right-1 ">
                      {product.tag}
                    </p>
                  </div>
                )}

                {isOfferValid && product.discount && (
                  <div className="absolute right-0 z-10 px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-l-full shadow-md cursor-default top-3 animate-bounce ">
                    {product.discount}% OFF
                  </div>
                )}

                <div
                  className="relative w-full h-48 mb-4"
                  onClick={() => handleProductClick(product.id)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full rounded-t-lg cursor-pointer group-hover:opacity-90 drop-shadow-lg dropimage"
                  />
                  <div className="absolute bottom-0 flex items-center justify-center w-full h-auto text-sm text-center text-white transition-opacity duration-300 bg-black opacity-0 cursor-not-allowed bg-opacity-70 group-hover:opacity-100">
                    <span className="px-4 uppercase">
                      {product.description ||
                        "Detalles del producto no disponibles."}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-between h-full px-4">
                  <h2 className="relative overflow-hidden text-lg font-bold text-gray-800 dark:text-gray-200 overflow-ellipsis whitespace-nowrap groupes">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.category}-{product.marca}
                  </p>
                  <div className="flex items-center ">
                    <div className="flex space-x-1">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {product.reviews?.length} reseñas
                    </span>
                  </div>

                  <div className="relative w-full h-2 bg-gray-200 rounded-full dark:bg-gray-600">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500  ${
                        stockPercentage > 60
                          ? "bg-green-500"
                          : stockPercentage > 30
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${stockPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    {isOfferValid ? (
                      <>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          S/ {product.price}
                        </p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through dark:text-gray-400">
                            S/ {product.originalPrice}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        S/ {product.originalPrice || product.price}
                      </p>
                    )}
                  </div>
                  <div>
                    {/* Color Selection */}
                    <div className="">
                      <label className="block text-sm font-medium text-white">
                        Color:
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            className={`w-4 h-4 rounded-full border-2 ${
                              selectedOptions[product.id]?.color === color
                                ? "border-black"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              handleOptionChange(product.id, "color", color)
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="h-[100px]">
                      <label className="block text-sm font-medium text-white">
                        Tamaño:
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            className={`px-3 py-1 border rounded ${
                              selectedOptions[product.id]?.size === size
                                ? "bg-black text-white"
                                : "bg-transparent text-white"
                            }`}
                            onClick={() =>
                              handleOptionChange(product.id, "size", size)
                            }
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-around">
                    <button
                      className={`flex px-3 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 items-center absolute top-[180px] right-0 ${
                        product.stock > 0
                          ? "hover:scale-105"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <FaShoppingCart className="" />
                    </button>
                    <button
                      className="absolute px-3 py-2 text-red-500 bg-gray-100 rounded-md hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-red-900 top-[180px] left-0"
                      onClick={() => handleAddToFavorites(product)}
                    >
                      <FaHeart
                        className={favorites ? "text-red-500" : "text-gray-400"}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Modal */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold">
                Producto añadido al carrito
              </h2>
              <button onClick={() => setIsCartModalOpen(false)}>
                <FaTimes className="text-xl" />
              </button>
            </div>
            <Cart
              cartItems={cartItems}
              onRemoveItem={(index) => {
                const updatedCart = cartItems.filter((_, i) => i !== index);
                setCartItems(updatedCart);
                localStorage.setItem("cartItems", JSON.stringify(updatedCart));
              }}
              onUpdateQuantity={(index, newQuantity) => {
                const updatedCart = [...cartItems];
                updatedCart[index].quantity = newQuantity;
                setCartItems(updatedCart);
                localStorage.setItem("cartItems", JSON.stringify(updatedCart));
              }}
            />
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={() => navigate("/cart")}
              >
                Ver carrito
              </button>
              <button
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                onClick={() => setIsCartModalOpen(false)}
              >
                Continuar comprando
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Pagination */}
      <div className="flex justify-center pb-4">
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
