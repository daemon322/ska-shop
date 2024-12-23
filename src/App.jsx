import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
