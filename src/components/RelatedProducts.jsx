import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute right-0 z-10 p-2 text-white -translate-y-1/2 bg-gray-800 rounded-full cursor-pointer top-1/2 hover:bg-gray-700"
      onClick={onClick}
    >
      <FaArrowRight />
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute left-0 z-10 p-2 text-white -translate-y-1/2 bg-gray-800 rounded-full cursor-pointer top-1/2 hover:bg-gray-700"
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
  const settings = {
    ...sliderSettings,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="w-full pb-10 overflow-x-hidden overflow-y-hidden">
      <h2 className="mt-10 text-3xl font-bold text-white">
        Productos relacionados
      </h2>
      <Slider {...settings} className="mt-6">
        {relatedProducts.map((related) => (
          <div key={related.id} className="px-2">
            <div className="p-4 transition-shadow duration-300 rounded-lg shadow-lg bg-gradient-to-br from-white to-gray-100 dark:from-cyan-600 dark:to-gray-900 hover:shadow-xl">
              <img
                src={related.image}
                alt={related.name}
                className="object-cover w-full h-40 transition-transform duration-300 rounded-lg cursor-pointer hover:scale-105"
                onClick={() => handleProductClick(related.id)}
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white">
                  {related.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Categoría:{" "}
                  <span className="font-medium">{related.category}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Marca: <span className="font-medium">{related.marca}</span>
                </p>
                <div className="mt-3">
                  <p className="text-sm text-gray-500">
                    Precio original:{" "}
                    <span className="text-gray-400 line-through">
                      S/ {related.originalPrice}
                    </span>
                  </p>
                  <p className="font-semibold text-green-600">
                    Precio con descuento: S/ {related.price}
                  </p>
                  {related.discount && (
                    <p className="text-xs text-red-500">
                      Descuento: {related.discount}%
                    </p>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Stock: {related.stock}
                </p>
                {related.tag && (
                  <span className="inline-block px-2 py-1 mt-3 text-xs font-medium text-blue-800 bg-blue-100 rounded">
                    {related.tag}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RelatedProducts;
