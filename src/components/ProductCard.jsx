import {
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaRegStar,
  FaUser,
  FaTrash,
  FaClock,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const ProductCard = ({
  product,
  onAddToCart,
  onImageClick,
  onToggleFavorite,
  reviews: initialReviews,
}) => {
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState(initialReviews || []);
  const [newReview, setNewReview] = useState({
    author: "",
    rating: 0,
    comment: "",
  });
  const [showReviews, setShowReviews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offerTimeLeft, setOfferTimeLeft] = useState(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews-${product.id}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, [product.id]);

  useEffect(() => {
    if (product.offerEndTime) {
      const interval = setInterval(() => {
        const timeLeft = new Date(product.offerEndTime) - new Date();
        if (timeLeft <= 0) {
          clearInterval(interval);
          setOfferTimeLeft(null);
        } else {
          setOfferTimeLeft(timeLeft);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [product.offerEndTime]);

  useEffect(() => {
    localStorage.setItem(`reviews-${product.id}`, JSON.stringify(reviews));
  }, [reviews, product.id]);

  const handleAddClick = () => {
    if (quantity > 0) {
      // Calcula el precio basado en si hay una oferta válida
      const price =
        product.offerEndTime && new Date(product.offerEndTime) > new Date()
          ? product.price
          : product.originalPrice;

      // Crea un nuevo objeto de producto con un identificador único basado en id, color y talla
      const productToAdd = {
        ...product,
        quantity,
        price,
        selectedColor,
        selectedSize,
        // Añade un cartItemId único que combine el id del producto, color y talla
        cartItemId: `${product.id}-${selectedColor}-${selectedSize}`,
      };

      onAddToCart(productToAdd);
      toast.success("Producto añadido al carrito.");
    } else {
      toast.error("Debes seleccionar una cantidad válida.");
    }
  };

  const handleAddToFavorites = () => {
    if (!favorites.some((fav) => fav.id === product.id)) {
      setFavorites((prevFavorites) => [...prevFavorites, product]);
      localStorage.setItem(
        "favorites",
        JSON.stringify([...favorites, product])
      );
      toast.success(`${product.name} ha sido agregado a favoritos.`);
    } else {
      toast.info(`${product.name} ya está en favoritos.`);
    }
  };

  const handleReviewSubmit = () => {
    if (
      newReview.author.trim() &&
      newReview.rating > 0 &&
      newReview.comment.trim()
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setReviews((prev) => [
          ...prev,
          { ...newReview, date: new Date().toISOString() },
        ]);
        setNewReview({ author: "", rating: 0, comment: "" });
        setIsLoading(false);
        toast.success("Reseña enviada con éxito.");
      }, 500);
    } else {
      alert("Por favor, completa todos los campos de la reseña.");
    }
  };

  const handleReviewDelete = (index) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reseña?")) {
      setReviews((prev) => prev.filter((_, i) => i !== index));
      toast.success("Reseña eliminada.");
    }
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

  const averageRating =
    reviews?.reduce((acc, review) => acc + review.rating, 0) /
      reviews?.length || 0;
  const stockPercentage =
    product.stock > 0 ? (product.stock / product.initialStock) * 100 : 0;

  return (
    <>
      <motion.div
        className="relative flex flex-col transition-all duration-300 shadow-lg w-72 bg-gradient-to-br from-white to-gray-100 dark:from-purple-800 dark:to-red-700 rounded-xl group hover:shadow-2xl h-[480px]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: product * 0.1 }}
        viewport={{ once: true }}
      >
        {offerTimeLeft && (
          <div className="absolute right-0 z-10 flex items-center px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-tl-full bottom-[220px]">
            <FaClock className="inline mr-1" />
            {formatTime(offerTimeLeft)}
          </div>
        )}

        {offerTimeLeft && product.tag && (
          <div className="absolute left-0 z-10 px-3 py-1 text-xs font-bold text-white bg-black rounded-r-full shadow-md cursor-default top-3">
            <p className="relative italic font-bold text-center border-b border-yellow-500 right-1 ">
              {product.tag}
            </p>
          </div>
        )}

        {offerTimeLeft && product.discount && (
          <div className="absolute right-0 z-10 px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-l-full shadow-md cursor-default top-3">
            {product.discount}% OFF
          </div>
        )}

        {!showReviews ? (
          <>
            <div
              className="relative w-full h-48 mb-4"
              onClick={handleCardClick}
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
                  {reviews?.length} reseñas
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
                {offerTimeLeft ? (
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
                          selectedColor === color
                            ? "border-black"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
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
                          selectedSize === size
                            ? "bg-black text-white"
                            : "bg-transparent text-black"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-around ">
                <button
                  className={`flex px-3 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 items-center absolute top-[180px] right-0 ${
                    product.stock > 0
                      ? "hover:scale-105"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleAddClick}
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart className="" />
                </button>
                <button
                  className="absolute px-3 py-2 text-red-500 bg-gray-100 rounded-md hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-red-900 top-[180px] left-0"
                  onClick={handleAddToFavorites}
                >
                  <FaHeart
                    className={favorites ? "text-red-500" : "text-gray-400"}
                  />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="z-30 px-2 pt-4 overflow-y-scroll dark:bg-gray-700 dark:text-white rounded-xl h-[480px]">
              <h3 className="mb-2 text-lg font-bold text-gray-800 dark:text-gray-200">
                Añadir Reseña
              </h3>
              {isLoading ? (
                <div className="text-center text-gray-500 dark:text-gray-300">
                  Guardando reseña...
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={newReview.author}
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <select
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        rating: Number(e.target.value),
                      }))
                    }
                    className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                  >
                    <option value="0">Selecciona una calificación</option>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <option key={star} value={star}>
                        {`${star} estrella${star > 1 ? "s" : ""}`}
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Escribe tu comentario"
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={handleReviewSubmit}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Enviar Reseña
                  </button>
                </div>
              )}

              <h3 className="mt-6 mb-2 text-lg font-bold text-gray-800 dark:text-gray-200">
                Reseñas de usuarios
              </h3>
              {reviews?.map((review, index) => (
                <div
                  key={index}
                  className="flex flex-col p-3 mb-4 bg-gray-100 rounded-lg dark:bg-gray-600"
                >
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-gray-500 dark:text-gray-200" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-100">
                      {review.author}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">
                    {review.comment}
                  </p>
                  <button
                    onClick={() => handleReviewDelete(index)}
                    className="self-end mt-2 text-xs text-red-500 hover:underline"
                  >
                    <FaTrash className="inline mr-1" />
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        <button
          className="absolute z-40 px-3 py-1 text-sm text-blue-500 bg-gray-100 rounded right-3 dark:bg-gray-700 dark:text-blue-400 -bottom-4"
          onClick={() => setShowReviews(!showReviews)}
        >
          {showReviews ? "Volver" : "Ver Reseñas"}
        </button>
      </motion.div>
    </>
  );
};

export default ProductCard;
