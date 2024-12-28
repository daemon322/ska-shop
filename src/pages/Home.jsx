import { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { products } from "../data/shoesproducts";
import ImageSlider from "../components/ImageSlider";
import { MdSearch, MdZoomIn, MdZoomOut } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [saleDetails, setSaleDetails] = useState(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Número de productos por página

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    // Cuando la categoría cambia, volver a la primera página
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleAddToCart = (item) => {
    setCartItems((prevItems) => {
      // Busca si existe un item con el mismo cartItemId
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.cartItemId === item.cartItemId
      );

      if (existingItemIndex >= 0) {
        // Si existe, actualiza la cantidad
        return prevItems.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        // Si no existe, añade el nuevo item
        return [...prevItems, item];
      }
    });
    setIsCartModalOpen(true);
  };
  const handleUpdateQuantity = (index, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = newQuantity;
      return updatedItems;
    });
  };

  const handleCheckout = () => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSaleDetails({
      items: cartItems,
      total,
      date: new Date().toLocaleString(),
    });
    setCartItems([]);
    localStorage.removeItem("cartItems");
    setIsCartModalOpen(false);
    setIsSaleModalOpen(true); // Abrir modal del resumen de venta
  };
  const handleRemoveFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };
  const handlePrint = () => {
    if (saleDetails) {
      const printWindow = window.open("", "PRINT", "height=600,width=800");
      printWindow.document.write(
        "<html><head><title>Resumen de Venta</title></head><body>"
      );
      printWindow.document.write("<h1>Mini Market DREFAB</h1>");
      printWindow.document.write(
        `<div>${saleDetails.items
          .map(
            (item) =>
              `<p>${item.name} (${item.quantity}) - $${item.price.toFixed(
                2
              )} c/u</p>`
          )
          .join("")}</div>`
      );
      printWindow.document.write(
        `<p><strong>Total:</strong> $${saleDetails.total.toFixed(2)}</p>`
      );
      printWindow.document.write(
        `<p><strong>Fecha:</strong> ${saleDetails.date}</p>`
      );
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;

    const matchesSearchQuery =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearchQuery;
  });

  // Productos paginados
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <>
      <Header />
      <ToastContainer />
      <main className="flex flex-wrap pt-20 md:pt-20 bg-gray-950 max-md:flex-wrap">
        <section className="w-full">
          {/* Filtro de Categorías */}
          <CategoryFilter
            categories={[
              "Todos",
              "Running",
              "Casual",
              "Basketball",
              "Soccer",
              "Training",
            ]}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          {/* Buscador */}
          <div className="flex justify-center mb-6">
            <div className="relative w-96">
              <input
                type="text"
                className="w-full py-2 pl-12 pr-4 border border-gray-300 rounded-full shadow-md focus:outline-none "
                placeholder="Buscar por nombre o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MdSearch className="absolute text-lg text-gray-400 transform -translate-y-1/2 top-1/2 left-4 " />
            </div>
          </div>
          {/* Productos filtrados con paginación */}
          <div className="flex flex-wrap justify-around w-full gap-5 p-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onImageClick={() => handleImageClick(product.image)}
              />
            ))}
          </div>
          {/* Paginación */}
          <div className="flex justify-center pb-4 mt-4">
            <button
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 text-white bg-gray-200 rounded-md hover:bg-gray-400 disabled:bg-transparent enabled:text-black disabled:text-transparent"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Anterior
            </button>

            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => currentPage - 3 + i
            )
              .filter((page) => page >= 1 && page <= totalPages)
              .map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 mx-1 rounded-md ${
                    page === currentPage
                      ? "bg-black text-white"
                      : "bg-gray-200 hover:bg-gray-400 text-gray-700"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

            <button
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 text-black bg-gray-200 rounded-md hover:bg-gray-400 disabled:bg-transparent enabled:text-black disabled:text-transparent"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente
            </button>
          </div>
        </section>
      </main>
      <ImageSlider />
      {/* Modal del carrito */}
      {isCartModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target.classList.contains("z-50")) setIsCartModalOpen(false);
          }}
        >
          <div
            className="w-11/12 p-6 bg-white rounded-lg md:w-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="block w-full p-2 mb-4 text-white bg-red-600 rounded-md md:hidden"
              onClick={() => setIsCartModalOpen(false)}
            >
              Cerrar
            </button>
            <h2 className="mb-4 text-xl font-bold">Carrito de compras</h2>
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
      {/* Modal para visualizar la imagen */}
      {isImageModalOpen && (
        <div
          className="fixed top-0 left-0 z-50 flex justify-center w-full h-screen py-2 bg-black bg-opacity-50 md:h-full md:w-full"
          onClick={(e) => {
            if (e.target.classList.contains("z-50")) setIsImageModalOpen(false);
          }}
        >
          <div className="w-auto h-auto p-4 m-auto bg-black rounded-lg bg-opacity-80 md:h-full ">
            <div className="flex justify-end w-full">
              <button
                className="fixed z-50 pr-2 font-bold text-white hover:text-red-600 hover:font-extrabold"
                onClick={() => setIsImageModalOpen(false)}
              >
                &#x2715;
              </button>
            </div>
            <div className="flex justify-center text-3xl">
              <button
                onClick={() => setZoomLevel(zoomLevel + 0.1)}
                className="absolute z-50 ml-10 text-white zoin"
              >
                <MdZoomIn />
              </button>
              <button
                onClick={() => setZoomLevel(zoomLevel - 0.1)}
                className="absolute z-50 mr-10 text-white"
              >
                <MdZoomOut />
              </button>
            </div>
            <img
              src={selectedImage}
              alt="Producto"
              className="object-contain w-full h-full md:object-cover md:w-full dropimage"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.2s",
              }}
              onLoad={() => setZoomLevel(1)}
            />
          </div>
        </div>
      )}
      {/* Modal del resumen de venta */}
      {isSaleModalOpen && (
        <div
          className="fixed top-0 left-0 z-50 flex justify-center w-full h-full py-2 bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target.classList.contains("z-50")) setIsSaleModalOpen(false);
          }}
        >
          <div
            className="relative flex flex-col justify-between w-11/12 p-8 m-auto bg-white rounded-lg shadow-lg md:w-1/2 h-5/6 lg:h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-0 right-0 m-4 text-gray-500 hover:text-red-700"
              onClick={() => setIsSaleModalOpen(false)}
            >
              &#x2715;
            </button>
            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
              Resumen de la Venta
            </h2>
            <ul className="space-y-3 overflow-y-scroll h-96">
              {saleDetails.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between px-3 py-2 bg-gray-100 rounded-lg"
                >
                  <span>
                    {item.name} ({item.quantity})
                  </span>
                  <span className="font-semibold text-green-600">
                    ${item.price.toFixed(2)} c/u
                  </span>
                </li>
              ))}
            </ul>
            <div className="px-3 py-2 mb-4 bg-gray-200 rounded-lg">
              <p className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-green-700">
                  ${saleDetails.total.toFixed(2)}
                </span>
              </p>
            </div>
            <p className="mb-4 text-sm text-center text-gray-500">
              Fecha de la venta: {saleDetails.date}
            </p>
            <button
              className="w-full py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={handlePrint}
            >
              Imprimir Resumen
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Home;
