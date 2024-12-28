import { useState, useEffect,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaShoppingCart,
  FaTag,
  FaHeart,
  FaShareAlt,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CommentsReviews from "../components/CommentsReviews";
import RelatedProducts from "../components/RelatedProducts";
import OtherProducts from "../components/OtherProduct";
import Cart from "../components/Cart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = ({ products }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productDetailsRef = useRef(null);
  const [currentProductId, setCurrentProductId] = useState(Number(id));
  const [showNotification, setShowNotification] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [viewedProducts, setViewedProducts] = useState(
    () => JSON.parse(localStorage.getItem("viewedProducts")) || []
  );
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: Infinity });
  const [sortOption, setSortOption] = useState("default");

  const product = products.find((p) => p.id === currentProductId);

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  const otherProducts = products.filter((p) => p.category !== product.category);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!viewedProducts.some((vp) => vp.id === product.id)) {
      setViewedProducts((prevViewed) => [...prevViewed, product]);
    }
  }, [product]);

  useEffect(() => {
    setMainImage(product.image);
  }, [product]);

  const handleProductClick = (productId) => {
    setCurrentProductId(productId);
    navigate(`/product/${productId}`);
    productDetailsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddToCart = () => {
    if (quantity > 0 && selectedSize && selectedColor) {
      const price = isOfferValid ? product.price : product.originalPrice;
      const item = { ...product, quantity, selectedSize, selectedColor, price };
      const existingItemIndex = cartItems.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.selectedSize === item.selectedSize &&
          cartItem.selectedColor === item.selectedColor
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += quantity;
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      } else {
        const updatedCart = [...cartItems, item];
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      }

      setIsCartModalOpen(true);
      toast.success("Producto añadido al carrito correctamente!");
    } else {
      toast.error("Por favor, seleccione una talla y un color.");
    }
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const triggerNotification = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(false), 3000);
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

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setComments((prevComments) => [
        ...prevComments,
        { text: newComment, rating, date: new Date().toLocaleString() },
      ]);
      setNewComment("");
      setRating(0);
      toast.success("Comentario añadido correctamente!");
    }
  };

  const filteredRelatedProducts = relatedProducts.filter(
    (p) => p.price >= priceFilter.min && p.price <= priceFilter.max
  );

  const sortedProducts = [...filteredRelatedProducts].sort((a, b) => {
    if (sortOption === "priceLowToHigh") return a.price - b.price;
    if (sortOption === "priceHighToLow") return b.price - a.price;
    if (sortOption === "rating") return b.rating - a.rating;
    return 0;
  });
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    appendDots: (dots) => (
      <div>
        <ul
          style={{
            margin: "0",
            padding: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {dots}
        </ul>
      </div>
    ),
  };
  const [mainImage, setMainImage] = useState(product.image);
  const [isZoomed, setIsZoomed] = useState(false);
  const isOfferValid =
    product.offerEndTime && new Date(product.offerEndTime) > new Date();

  return (
    <>
      <Header />
      <div ref={productDetailsRef} className="w-full pt-16 dark:bg-gray-900">
        <ToastContainer />
        {showNotification && (
          <div className="absolute top-0 left-0 z-40 w-full p-2 text-sm font-semibold text-white bg-green-500 rounded shadow-md">
            {showNotification}
          </div>
        )}
        <div className="flex flex-col items-start h-auto gap-2 p-6 rounded-lg shadow-lg bg-gradient-to-b from-gray-800 to-red-600 dark:from-gray-200 dark:to-gray-900">
          <div className="flex flex-wrap w-full ">
            <div className="flex flex-col w-full md:w-2/3 xl:flex-row h-full xl:h-[600px]">
              {" "}
              <div className="flex flex-row justify-center gap-4 smalldetails xl:flex-col">
                {" "}
                {product.image1 && (
                  <img
                    src={product.image1}
                    alt={product.name}
                    className="object-cover w-32 h-32 transition-transform duration-300 rounded-lg shadow-md cursor-pointer hover:scale-105"
                    onClick={() => setMainImage(product.image1)}
                  />
                )}{" "}
                {product.image2 && (
                  <img
                    src={product.image2}
                    alt={product.name}
                    className="object-cover w-32 h-32 transition-transform duration-300 rounded-lg shadow-md cursor-pointer hover:scale-105"
                    onClick={() => setMainImage(product.image2)}
                  />
                )}{" "}
                {product.image3 && (
                  <img
                    src={product.image3}
                    alt={product.name}
                    className="object-cover w-32 h-32 transition-transform duration-300 rounded-lg shadow-md cursor-pointer hover:scale-105"
                    onClick={() => setMainImage(product.image3)}
                  />
                )}{" "}
              </div>{" "}
              <div
                className={`relative w-full h-full ${
                  isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
              >
                {" "}
                <img
                  src={mainImage}
                  alt={product.name}
                  className={`object-cover w-full h-full transition-transform duration-300 rounded-lg shadow-md ${
                    isZoomed ? "scale-150" : "scale-100"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />{" "}
              </div>{" "}
            </div>
            <div className="flex flex-col w-full p-4  md:w-1/3 relative right-0 h-full md:absolute md:h-[750px] justify-between">
              <h1 className="text-4xl font-bold text-center text-gray-100 dark:text-gray-900">
                {product.name}
              </h1>
              <div className="flex justify-between w-full ">
                <p className="text-sm text-gray-300 dark:text-gray-700">
                  Categoría:{" "}
                  <span className="font-medium">{product.category}</span>
                </p>
                <p className="text-sm text-gray-300 dark:text-gray-700">
                  Marca: <span className="font-medium">{product.marca}</span>
                </p>
              </div>

              <p className="text-gray-200 dark:text-gray-800">
                {product.description}
              </p>
              {isOfferValid && (
                <>
                  {product.tag && (
                    <div className="">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded">
                        {product.tag}
                      </span>
                    </div>
                  )}
                </>
              )}
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
              {isOfferValid && (
                <>
                  <div className="">
                    <p className="flex items-center mt-1 text-sm text-red-500">
                      <FaTag className="mr-2" /> Descuento: {product.discount}%
                    </p>
                    {product.offerEndTime && (
                      <p className="text-sm text-gray-500">
                        Oferta válida hasta: {product.offerEndTime}
                      </p>
                    )}
                  </div>
                  <p className="hidden mt-2">
                    <FaStar className="inline mr-1" />
                    Stock inicial: {product.initialStock}
                  </p>{" "}
                  <p className="hidden text-sm text-gray-500">
                    <FaStar className="inline mr-1" />
                    Stock disponible: {product.stock}
                  </p>
                </>
              )}
              <div className="">
                <h4 className="text-lg font-semibold text-center text-gray-700">
                  Tallas disponibles:
                </h4>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {product.sizes?.map((size, index) => (
                    <button
                      key={index}
                      className={`inline-block px-3 py-1 text-sm text-black bg-black rounded font-bold border border-black ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "bg-transparent"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <h4 className="text-lg font-semibold text-center text-gray-700">
                  Colores disponibles:
                </h4>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  {product.colors?.map((color, index) => (
                    <button
                      key={index}
                      className={`inline-block px-3 text-sm font-medium rounded-sm shadow transition-transform duration-200 py-1 ${
                        selectedColor === color
                          ? "bg-gray-800 text-white scale-105"
                          : "transparent text-black hover:bg-gray-300"
                      }`}
                      style={{
                        backgroundColor:
                          selectedColor === color ? color : undefined,
                        color: "white" === color ? "black" : "",
                        border: `1px solid ${color}`,
                      }}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <label className="block text-white">
                  Cantidad:
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-16 p-1 ml-2 text-sm border rounded dark:bg-gray-800 dark:text-gray-200"
                  />
                </label>
              </div>
              <div className="flex flex-wrap mt-5">
                <div className="flex flex-wrap justify-center w-full gap-2 md:justify-between">
                  <button
                    className={`flex px-4 py-2 text-white rounded-md hover:scale-105 items-center ${
                      product.stock > 0
                        ? "hover:scale-105"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    style={{
                      backgroundColor: selectedColor
                        ? selectedColor
                        : "transparent",
                      color: "white" === selectedColor ? "green" : "",
                    }}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <FaShoppingCart className="mr-2" /> Agregar al carrito
                  </button>
                  <button
                    onClick={handleAddToFavorites}
                    className="px-4 py-2 text-white transition-transform duration-300 bg-red-600 rounded hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                  >
                    <FaHeart className="inline mr-2" /> Agregar a favoritos
                  </button>
                </div>
                <div className="flex justify-end w-full mt-4">
                  <button
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                    onClick={() => {
                      navigator.share({
                        title: product.name,
                        url: window.location.href,
                      });
                    }}
                  >
                    <FaShareAlt className="inline mr-2" /> Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>
          <CommentsReviews
            comments={comments}
            newComment={newComment}
            setNewComment={setNewComment}
            rating={rating}
            setRating={setRating}
            handleCommentSubmit={handleCommentSubmit}
          />
        </div>

        <RelatedProducts
          relatedProducts={sortedProducts}
          sliderSettings={sliderSettings}
          handleProductClick={handleProductClick}
        />

        <OtherProducts
          otherProducts={otherProducts}
          sliderSettings={sliderSettings}
          handleProductClick={handleProductClick}
        />
      </div>
      <Footer />

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
              onRemoveItem={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
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
    </>
  );
};

export default ProductDetails;
