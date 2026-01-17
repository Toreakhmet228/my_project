import api from "./api";
import type { Product } from "../types/product";
import type { PaginatedResponse } from "../types/api";

export const fetchProducts = (params?: Record<string, any>) =>
  api.get<PaginatedResponse<Product>>("/products", { params });

export const fetchProductById = (id: number) =>
  api.get<Product>(`/products/${id}`);
