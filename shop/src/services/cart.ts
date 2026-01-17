import api from "./api";
import type { CartResponse } from "../types/cart";

export const getCart = () =>
  api.get<CartResponse>("/cart");

export const addToCart = (product_id: number, quantity = 1) =>
  api.post("/cart", { product_id, quantity });

export const updateCartItem = (item_id: number, quantity: number) =>
  api.put(`/cart/${item_id}`, { quantity });

export const deleteCartItem = (item_id: number) =>
  api.delete(`/cart/${item_id}`);
