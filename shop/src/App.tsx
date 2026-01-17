import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import Cart from "./components/Cart";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="nav">
          <div className="nav-content">
            <div className="nav-inner">
              <Link to="/" className="nav-logo">
                Shop
              </Link>
              <div className="nav-links">
                <Link to="/" className="nav-link">
                  Products
                </Link>
                <Link to="/cart" className="nav-link">
                  Cart
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
