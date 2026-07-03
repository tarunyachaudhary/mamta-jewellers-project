import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Checkout.module.css";

const hasSavedAddress = (address) =>
  address && (address.line1 || address.city || address.state || address.pincode);

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const savedAddress = user?.address;
  const [useNewAddress, setUseNewAddress] = useState(!hasSavedAddress(savedAddress));

  const [form, setForm] = useState({
    line1: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getShippingAddress = () => (useNewAddress ? form : savedAddress);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      await api.post("/orders", {
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: getShippingAddress(),
      });
      clearCart();
      navigate("/account?ordered=true");
    } catch (err) {
      setError(err.response?.data?.message || "Could not place the order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <p className="page-empty">Your cart is empty. Add something before checking out.</p>;
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1>Checkout</h1>

      <div className={styles.layout}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>Shipping Details</h3>
          {error && <p className="error-text">{error}</p>}

          {!useNewAddress && hasSavedAddress(savedAddress) ? (
            <div className={styles.savedAddressCard}>
              <p className={styles.savedAddressLabel}>Deliver to:</p>
              <p className={styles.savedAddressLine}>{savedAddress.line1}</p>
              <p className={styles.savedAddressLine}>
                {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
              </p>
              <p className={styles.savedAddressLine}>Phone: {savedAddress.phone}</p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setUseNewAddress(true)}
              >
                + Use a new address
              </button>
            </div>
          ) : (
            <>
              {hasSavedAddress(savedAddress) && (
                <button
                  type="button"
                  className={styles.backToSaved}
                  onClick={() => setUseNewAddress(false)}
                >
                  &larr; Use saved address instead
                </button>
              )}

              <div className="form-field">
                <label htmlFor="line1">Address</label>
                <input id="line1" name="line1" required value={form.line1} onChange={handleChange} />
              </div>
              <div className={styles.row}>
                <div className="form-field">
                  <label htmlFor="city">City</label>
                  <input id="city" name="city" required value={form.city} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label htmlFor="state">State</label>
                  <input id="state" name="state" required value={form.state} onChange={handleChange} />
                </div>
              </div>
              <div className={styles.row}>
                <div className="form-field">
                  <label htmlFor="pincode">Pincode</label>
                  <input id="pincode" name="pincode" required value={form.pincode} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" required value={form.phone} onChange={handleChange} />
                </div>
              </div>
            </>
          )}

          <button className="btn btn-primary btn-block" disabled={placing}>
            {placing ? "Placing Order..." : `Place Order · ₹${totalPrice.toLocaleString("en-IN")}`}
          </button>
        </form>

        <div className={styles.summary}>
          <h3>Order Items</h3>
          {items.map((item) => (
            <div key={item.product} className={styles.summaryItem}>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;