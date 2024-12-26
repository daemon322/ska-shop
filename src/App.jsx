import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import About from "./pages/About";
import ProductDetails from "./pages/ProductDetails";
import { products } from "./data/shoesproducts";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home products={products} />} />
          <Route
            path="/product/:id"
            element={<ProductDetails products={products} />}
          />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
