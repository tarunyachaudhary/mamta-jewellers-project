import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import styles from "./Cart.module.css";

const WHATSAPP_NUMBER = "918757509484"; // country code 91 + number, no + or spaces

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  const buildWhatsappMessage = () => {
    const lines = [
      "Hello Mamta Jewellers! I'd like to enquire about the following item(s):",
      "",
      ...items.map(
        (item, idx) =>
          `${idx + 1}. ${item.name} — Qty: ${item.quantity} — ₹${(item.price * item.quantity).toLocaleString("en-IN")}`
      ),
      "",
      `Total: ₹${totalPrice.toLocaleString("en-IN")}`,
      "",
      "Could you please share more details and availability? Thank you!",
    ];
    return lines.join("\n");
  };
  const handleWhatsappEnquiry = () => {
    const message = encodeURIComponent(buildWhatsappMessage());
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="container page-empty">
        <div>
          <p>Your cart is empty.</p>
          <Link to="/collection" className="btn btn-primary" style={{ marginTop: 16 }}>
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1>Your Cart</h1>

      <div className={styles.layout}>
        <div className={styles.items}>
          {items.map((item) => (
            <div key={item.product} className={styles.item}>
              <img src={item.image} alt={item.name} />
              <div className={styles.itemInfo}>
                <h3>{item.name}</h3>
                <p className={styles.price}>₹{item.price.toLocaleString("en-IN")}</p>
              </div>
              <div className={styles.qtyControl}>
                <button onClick={() => updateQuantity(item.product, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product, item.quantity + 1)}>+</button>
              </div>
              <p className={styles.lineTotal}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
              <button className={styles.remove} onClick={() => removeFromCart(item.product)} aria-label="Remove item">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h3>Order Summary</h3>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <button className={styles.whatsappBtn} onClick={handleWhatsappEnquiry}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ marginRight: 8 }}>
              <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4 8.94 8.94 0 0 0 3.6 16.54L2 22l5.6-1.47a8.9 8.9 0 0 0 4.45 1.18h.01A8.95 8.95 0 0 0 20.9 12.9a8.85 8.85 0 0 0-3.3-6.58zM12.06 20.1h-.01a7.4 7.4 0 0 1-3.78-1.04l-.27-.16-2.8.74.75-2.73-.18-.28a7.42 7.42 0 1 1 6.29 3.47zm4.08-5.56c-.22-.11-1.31-.65-1.51-.72s-.35-.11-.5.11-.58.72-.71.87-.26.17-.48.06a6.06 6.06 0 0 1-1.78-1.1 6.7 6.7 0 0 1-1.23-1.53c-.13-.22 0-.34.1-.45s.22-.26.33-.39a1.5 1.5 0 0 0 .22-.37.4.4 0 0 0 0-.39c-.06-.11-.5-1.21-.69-1.66s-.37-.38-.5-.38-.28 0-.43 0a.83.83 0 0 0-.6.28 2.53 2.53 0 0 0-.79 1.88 4.4 4.4 0 0 0 .92 2.32 10.06 10.06 0 0 0 3.84 3.4 4.4 4.4 0 0 0 2.7.56 2.3 2.3 0 0 0 1.51-1.07 1.87 1.87 0 0 0 .13-1.07c-.06-.1-.2-.16-.43-.27z" />
            </svg>
            Enquire on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;