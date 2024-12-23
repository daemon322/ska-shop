import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [saleDetails, setSaleDetails] = useState(null);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCart);
  }, []);

  const handleRemoveItem = (index) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((_, i) => i !== index);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems)); // Actualizar localStorage
      return updatedItems;
    });
  };
  const handleUpdateQuantity = (index, newQuantity) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = newQuantity;
    setCartItems(newCartItems);
  };
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

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
    setIsSaleModalOpen(true);
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
              `<p>${item.name} (${item.quantity}) - $${(
                item.price * item.quantity
              ).toFixed(2)}</p>`
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

  return (
    <>
      <Header />
      <main className="flex-grow h-screen px-4 pt-20">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Carrito de Compras
        </h1>
        <Cart
          cartItems={cartItems}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={handleCheckout}
        />
      </main>
      <Footer />
      {isSaleModalOpen && saleDetails && (
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
    </>
  );
};

export default CartPage;
