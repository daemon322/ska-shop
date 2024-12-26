import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaTrash } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleRemoveFromFavorites = (productId) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast.success("Producto eliminado de favoritos.");
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <Header />
      <div className="w-full h-screen p-6 pt-16 dark:bg-gray-900">
        <ToastContainer />
        <h1 className="text-4xl font-bold text-center text-gray-100 dark:text-gray-900">
          Mis Favoritos
        </h1>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-48 rounded-lg"
                  onClick={() => handleProductClick(product.id)}
                />
                <h2 className="mt-2 text-lg font-bold text-center text-gray-900 dark:text-gray-100">
                  {product.name}
                </h2>
                <p className="mt-1 text-sm text-center text-gray-700 dark:text-gray-300">
                  {product.category}
                </p>
                <p className="mt-1 text-sm text-center text-gray-700 dark:text-gray-300">
                  S/ {product.price}
                </p>
                <div className="flex justify-center mt-4">
                  <button
                    className="px-4 py-2 mr-2 text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => handleRemoveFromFavorites(product.id)}
                  >
                    <FaTrash className="inline mr-2" /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-center text-gray-500">
            No tienes productos en favoritos.
          </p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Favorites;