const Cart = ({ cartItems, onRemoveItem, onCheckout, onUpdateQuantity }) => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  
    return (
      <div>
        {cartItems.length > 0 ? (
          <>
            <ul className="p-2 overflow-y-scroll max-h-96 max-md:h-full">
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 mb-2 border-b border-gray-200"
                >
                  <div className="flex flex-wrap items-center justify-around w-full gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-contain w-12 h-16 rounded-md"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-center">{item.name}</p>
                      <div className="flex items-center">
                        <button
                          className="px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                          onClick={() =>
                            onUpdateQuantity(index, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <p className="mx-2 text-sm">Cantidad: {item.quantity}</p>
                        <button
                          className="px-2 py-1 text-white bg-green-500 rounded-md hover:bg-green-600"
                          onClick={() =>
                            onUpdateQuantity(index, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-center">
                        Precio: S/
                        {(item.price * item.quantity).toLocaleString("es-PE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                      onClick={() => onRemoveItem(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <p className="text-lg font-bold">
                Total: S/
                {total.toLocaleString("es-PE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <button
                className="flex justify-center w-full px-4 py-2 m-auto mt-4 text-white bg-green-500 rounded-md hover:bg-green-600 sm:w-72"
                onClick={onCheckout}
              >
                Realizar venta
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">
            No hay productos en el carrito.
          </p>
        )}
      </div>
    );
  };
  
  export default Cart;
  