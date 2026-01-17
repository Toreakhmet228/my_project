import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { addToCart } from "../services/cart";
import { toast } from "react-toastify";
import "./ProductCart.css";

interface Props {
  product: Product;
}

export default function ProductCart({ product }: Props) {
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{product.price} ₸</p>
          <button
            onClick={handleAddToCart}
            className="product-add-button"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
