import { useEffect, useState } from "react";
import type { CartResponse, CartItem } from "../types/cart";
import { getCart, updateCartItem, deleteCartItem } from "../services/cart";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState<CartResponse>({
    items: [],
    total: 0,
  });

  useEffect(() => {
    getCart().then((res) => setCart(res.data));
  }, []);

  const changeQty = async (item: CartItem, qty: number) => {
    if (qty <= 0) return;
    
    const prev = cart.items;

    setCart({
      ...cart,
      items: cart.items.map((i) =>
        i.id === item.id ? { ...i, quantity: qty } : i
      ),
    });

    try {
      await updateCartItem(item.id, qty);
      const res = await getCart();
      setCart(res.data);
    } catch {
      setCart({ ...cart, items: prev });
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await deleteCartItem(itemId);
      const res = await getCart();
      setCart(res.data);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>
      {cart.items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  <p className="cart-item-price">{item.product.price} ₸</p>
                </div>
                <div className="cart-item-qty">
                  <label className="cart-qty-label">Qty:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      changeQty(item, Number(e.target.value))
                    }
                    className="cart-qty-input"
                  />
                </div>
                <div className="cart-item-total">
                  <p className="cart-item-total-price">
                    {(item.product.price * item.quantity).toFixed(2)} ₸
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="cart-remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <div className="cart-total">
              <span className="cart-total-label">Total:</span>
              <span className="cart-total-price">{cart.total.toFixed(2)} ₸</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
