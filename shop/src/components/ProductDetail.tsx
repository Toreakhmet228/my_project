import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import { addToCart } from "../services/cart";
import { toast } from "react-toastify";
import "./ProductDetail.css";

interface Props {
  product: Product;
}

export default function ProductDetail({ product }: Props) {
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      toast.success("Product added to cart!");
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <div className="product-detail">
      <div className="product-detail-content">
        <div className="product-detail-image-section">
          <img
            src={product.image}
            alt={product.name}
            className="product-detail-image"
          />
        </div>
        <div className="product-detail-info">
          <button onClick={() => navigate("/")} className="product-detail-back">
            ← Back to products
          </button>
          <h1 className="product-detail-name">{product.name}</h1>
          {product.category && (
            <span className="product-detail-category">{product.category}</span>
          )}
          <p className="product-detail-price">{product.price} ₸</p>
          {product.description && (
            <div className="product-detail-description">
              <h2 className="product-detail-description-title">Description</h2>
              <p className="product-detail-description-text">{product.description}</p>
            </div>
          )}
          <button onClick={handleAddToCart} className="product-detail-add-button">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
