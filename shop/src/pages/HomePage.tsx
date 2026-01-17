import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import ProductCart from "../components/ProductCart";
import { fetchProducts } from "../services/products";
import type { PaginatedResponse } from "../types/api";
import type { Product } from "../types/product";
import "./HomePage.css";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    min_price: "",
    max_price: "",
    sort: "price",
    order: "asc",
    limit: 12,
    offset: 0,
  });

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.category, filters.min_price, filters.max_price, filters.sort, filters.order, filters.limit, filters.offset]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        limit: filters.limit,
        offset: filters.offset,
        sort: filters.sort,
        order: filters.order,
      };

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.min_price) params.min_price = parseFloat(filters.min_price);
      if (filters.max_price) params.max_price = parseFloat(filters.max_price);

      const response = await fetchProducts(params);
      const data: PaginatedResponse<Product> = response.data;
      setProducts(data.results || []);
      setTotal(data.count || 0);
    } catch (err: any) {
      console.error("Failed to load products:", err);
      const errorMsg = err.response?.data?.detail || err.message || "Failed to load products";
      setError(`Ошибка: ${errorMsg}. Убедитесь, что бэкенд запущен на http://127.0.0.1:8000`);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, offset: 0 });
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters, offset: 0 });
  };

  const handlePageChange = (newOffset: number) => {
    setFilters({ ...filters, offset: newOffset });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="home-page" style={{ padding: "20px", backgroundColor: "#fff" }}>
      <div className="home-header">
        <h1 className="home-title" style={{ fontSize: "32px", marginBottom: "20px", color: "#000" }}>
          Products
        </h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {error && (
        <div className="error-message" style={{ 
          padding: "15px", 
          backgroundColor: "#fee", 
          border: "2px solid #f00", 
          borderRadius: "5px",
          marginBottom: "20px",
          color: "#c00"
        }}>
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>{error}</p>
          <button 
            onClick={loadProducts} 
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Попробовать снова
          </button>
        </div>
      )}

      <div className="home-content" style={{ display: "flex", gap: "20px" }}>
        <aside className="home-sidebar" style={{ width: "250px", flexShrink: 0 }}>
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <div className="home-main" style={{ flex: 1 }}>
          {loading ? (
            <div className="loading-state" style={{ textAlign: "center", padding: "50px", color: "#666" }}>
              <p style={{ fontSize: "18px" }}>Загрузка товаров...</p>
            </div>
          ) : error && products.length === 0 ? (
            <div className="error-state" style={{ textAlign: "center", padding: "50px" }}>
              <p style={{ color: "#c00", marginBottom: "20px", fontSize: "16px" }}>{error}</p>
              <button 
                onClick={loadProducts} 
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                Попробовать снова
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state" style={{ textAlign: "center", padding: "50px", color: "#666" }}>
              <p style={{ fontSize: "18px" }}>Товары не найдены</p>
            </div>
          ) : (
            <>
              <div className="products-grid" style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
                gap: "20px",
                marginBottom: "30px"
              }}>
                {products.map((product) => (
                  <ProductCart key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                total={total}
                limit={filters.limit}
                offset={filters.offset}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
