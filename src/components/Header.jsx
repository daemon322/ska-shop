import { Link } from "react-router-dom";
import { FaHome, FaShoppingCart, FaInfoCircle, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed z-50 w-full p-4 text-white bg-black shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Market</h1>
        {/* Hamburger icon */}
        <button
          className="block p-2 lg:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          {" "}
          {isOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}{" "}
        </button>
        {/* Navigation links */}
        <nav
          className={`${
            isOpen ? "block" : "hidden"
          } absolute top-14 left-0 w-full bg-black lg:bg-transparent lg:relative lg:top-auto lg:left-auto lg:w-auto lg:flex gap-4`}
        >
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 transition-all duration-300 rounded-md hover:bg-white hover:text-black"
          >
            <FaHome /> <span>Inicio</span>
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-2 px-4 py-2 transition-all duration-300 rounded-md hover:bg-white hover:text-black"
          >
            <FaShoppingCart /> <span>Carrito</span>
          </Link>
          <Link
            to="/about"
            className="flex items-center gap-2 px-4 py-2 transition-all duration-300 rounded-md hover:bg-white hover:text-black"
          >
            <FaInfoCircle /> <span>About</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
