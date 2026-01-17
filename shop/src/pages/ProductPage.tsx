import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductDetail from "../components/ProductDetail";
import { fetchProductById } from "../services/products";
import type { Product } from "../types/product";
import "./ProductPage.css";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    setLoading(true);
    try {
      const response = await fetchProductById(productId);
      setProduct(response.data);
    } catch (error) {
      console.error("Failed to load product:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="product-page-loading">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page-error">
        <p>Product not found</p>
        <button onClick={() => navigate("/")} className="product-page-back-button">
          Back to products
        </button>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
