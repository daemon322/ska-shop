import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute right-0 z-10 p-3 text-white transition-all transform -translate-y-1/2 rounded-full shadow-xl cursor-pointer bg-gradient-to-br from-gray-700 to-gray-900 top-1/2 hover:scale-110 hover:from-gray-600 hover:to-gray-800"
      onClick={onClick}
    >
      <FaArrowRight />
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute left-0 z-10 p-3 text-white transition-all transform -translate-y-1/2 rounded-full shadow-xl cursor-pointer bg-gradient-to-br from-gray-700 to-gray-900 top-1/2 hover:scale-110 hover:from-gray-600 hover:to-gray-800"
      onClick={onClick}
    >
      <FaArrowLeft />
    </div>
  );
};

const RelatedProducts = ({
  relatedProducts,
  sliderSettings,
  handleProductClick,
}) => {
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || []
  );

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

  const settings = {
    ...sliderSettings,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="w-full pb-10 overflow-x-hidden">
      <h2 className="mt-10 text-4xl font-extrabold text-center text-gray-900 dark:text-white">
        Productos Relacionados
      </h2>
      <Slider {...settings} className="pt-8 pb-8">
        {relatedProducts.map((related) => {
          const isOfferValid =
            related.offerEndTime && new Date(related.offerEndTime) > new Date();

          return (
            <div key={related.id} className="px-4">
              <div className="relative transition-all duration-300 transform shadow-lg bg-gradient-to-t from-white to-blue-500 dark:from-gray-700 dark:to-yellow-500 rounded-xl hover:shadow-2xl hover:-translate-y-3">
                <div className="relative">
                  <img
                    src={related.image}
                    alt={related.name}
                    className="object-cover w-full h-56 transition-transform duration-300 rounded-lg shadow-xl cursor-pointer hover:scale-110"
                    onClick={() => handleProductClick(related.id)}
                  />
                  {isOfferValid && (
                    <span className="absolute px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full shadow-md top-2 left-2">
                      Oferta
                    </span>
                  )}
                  {isOfferValid && (
                    <p className="absolute right-0 px-2 py-1 text-xs text-white bg-black top-2 rounded-s-md">
                      {related.discount}%
                    </p>
                  )}
                  <button
                    className="absolute p-2 text-white bg-red-500 rounded-full shadow-md bottom-2 right-2 hover:bg-red-600"
                    onClick={() => handleAddToFavorites(related)}
                  >
                    <FaHeart />
                  </button>
                </div>
                <div className="flex flex-col justify-around h-48 p-4 text-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {related.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Categoría:{" "}
                    <span className="font-medium">{related.category}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Marca: <span className="font-medium">{related.marca}</span>
                  </p>
                  {isOfferValid ? (
                    <div className="">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Precio original:{" "}
                        <span className="text-gray-400 line-through">
                          S/ {related.originalPrice}
                        </span>
                      </p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        S/ {related.price}
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-300">
                      S/ {related.originalPrice}
                    </p>
                  )}
                  <p className="hidden mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Stock: {related.stock}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default RelatedProducts;
