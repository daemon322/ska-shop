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
  
  const ProductCard = ({
    product,
    onAddToCart,
    onImageClick,
    onToggleFavorite,
    reviews: initialReviews,
  }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState(initialReviews || []);
    const [newReview, setNewReview] = useState({
      author: "",
      rating: 0,
      comment: "",
    });
    const [showReviews, setShowReviews] = useState(false); // Nuevo estado
    const [isLoading, setIsLoading] = useState(false); // Para manejar estado de carga
    const [offerTimeLeft, setOfferTimeLeft] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
  
    // Cargar datos persistidos
    useEffect(() => {
      const savedFavorite = localStorage.getItem(`favorite-${product.id}`);
      const savedReviews = localStorage.getItem(`reviews-${product.id}`);
  
      if (savedFavorite) {
        setIsFavorite(JSON.parse(savedFavorite));
      }
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      }
    }, [product.id]);
  
    // Temporizador para ofertas
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
  
    // Guardar datos en localStorage
    useEffect(() => {
      localStorage.setItem(`favorite-${product.id}`, JSON.stringify(isFavorite));
      localStorage.setItem(`reviews-${product.id}`, JSON.stringify(reviews));
    }, [isFavorite, reviews, product.id]);
  
    const handleAddClick = () => {
      if (quantity > 0) {
        onAddToCart({ ...product, quantity });
        triggerNotification("Producto añadido al carrito.");
      }
    };
  
    const handleFavoriteClick = () => {
      setIsFavorite(!isFavorite);
      if (onToggleFavorite) onToggleFavorite(product);
      triggerNotification(
        isFavorite
          ? "Producto eliminado de favoritos."
          : "Producto añadido a favoritos."
      );
    };
  
    const triggerNotification = (message) => {
      setShowNotification(message);
      setTimeout(() => setShowNotification(false), 3000);
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
          triggerNotification("Reseña enviada con éxito.");
        }, 500);
      } else {
        alert("Por favor, completa todos los campos de la reseña.");
      }
    };
  
    const handleReviewDelete = (index) => {
      if (window.confirm("¿Estás seguro de que deseas eliminar esta reseña?")) {
        setReviews((prev) => prev.filter((_, i) => i !== index));
        triggerNotification("Reseña eliminada.");
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
    
    const remainingTime = 200000;
    console.log(formatTime(remainingTime));
  
    const averageRating =
      reviews?.reduce((acc, review) => acc + review.rating, 0) /
        reviews?.length || 0;
    const stockPercentage =
      product.stock > 0 ? (product.stock / product.initialStock) * 100 : 0;
  
    return (
      <div className="relative flex flex-col transition-all duration-300 shadow-lg w-72 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl group hover:shadow-2xl CardProdcut">
        {/* Etiquetas dinámicas */}
        {showNotification && (
          <div className="absolute top-0 left-0 z-40 w-full p-2 text-sm font-semibold text-white bg-green-500 rounded shadow-md">
            {showNotification}
          </div>
        )}
  
        {/* Temporizador de oferta */}
        {offerTimeLeft && (
          <div className="absolute right-0 z-10 flex items-center px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-tl-full bottom-60">
            <FaClock className="inline mr-1" />
            {formatTime(offerTimeLeft)}
          </div>
        )}
  
        {/* Etiqueta de producto */}
        {offerTimeLeft && product.tag && (
          <div className="absolute left-0 z-10 px-3 py-1 text-xs font-bold text-white bg-black rounded-r-full shadow-md cursor-default top-3">
            <p className="relative italic font-bold text-center border-b border-yellow-500 right-1 ">
            {product.tag}  
            </p>
          </div>
        )}
  
        {/* Descuento */}
        {offerTimeLeft && product.discount && (
          <div className="absolute right-0 z-10 px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-l-full shadow-md cursor-default top-3">
            {product.discount}% OFF
          </div>
        )}
  
        {/* Contenido principal o reseñas */}
        {!showReviews ? (
          <>
            {/* Imagen del producto */}
            <div className="relative w-full h-48 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full rounded-t-lg cursor-pointer group-hover:opacity-90 drop-shadow-lg dropimage"
                onClick={() => onImageClick(product)}
              />
              <div className="absolute bottom-0 flex items-center justify-center w-full h-12 text-sm text-center text-white transition-opacity duration-300 bg-black opacity-0 cursor-not-allowed bg-opacity-70 group-hover:opacity-100">
                <span className="px-4 uppercase">
                  {product.description || "Detalles del producto no disponibles."}
                </span>
              </div>
            </div>
            <div className="px-4">
              {/* Detalles del producto */}
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {product.name}
              </h2>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                {product.category}
              </p>
              <div className="flex items-center mb-2">
                <div className="flex space-x-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {reviews?.length} reseñas
                </span>
              </div>
  
              {/* Stock visualizado */}
              <div className="relative w-full h-2 mb-4 bg-gray-200 rounded-full dark:bg-gray-600">
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
              <span className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {product.stock > 0
                  ? `${product.stock} restantes`
                  : "Sin stock (pronto disponible)"}
              </span>
  
              {/* Precio */}
              <div className="flex items-center justify-between mb-4">
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
  
              {/* Botones */}
              <div className="flex items-center justify-around space-x-2">
                <button
                  className={`flex px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 items-center ${
                    product.stock > 0
                      ? "hover:scale-105"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleAddClick}
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart className="mr-2" /> Añadir
                </button>
                <button
                  className="px-3 py-2 text-red-500 bg-gray-100 rounded-md hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-red-900"
                  onClick={handleFavoriteClick}
                >
                  <FaHeart
                    className={isFavorite ? "text-red-500" : "text-gray-400"}
                  />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Reseñas */}
            <div className="px-2 pt-4 overflow-y-scroll CardReseña z-30 dark:bg-gray-700 dark:text-white rounded-xl">
              {/* Añadir reseña */}
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
  
              {/* Mostrar reseñas */}
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
          className="absolute z-40 px-3 py-1 text-sm text-blue-500 bg-gray-100 rounded bottom-1 right-3 dark:bg-gray-700 dark:text-blue-400"
          onClick={() => setShowReviews(!showReviews)}
        >
          {showReviews ? "Volver" : "Ver Reseñas"}
        </button>
      </div>
    );
  };
  
  export default ProductCard;
  