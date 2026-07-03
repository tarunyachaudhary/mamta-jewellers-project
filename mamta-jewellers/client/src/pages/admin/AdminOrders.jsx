import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import styles from "./AdminLayout.module.css";

const STATUSES = ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (err) {
      setError("Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not update order status.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.topBar}>
        <div>
          <span className="eyebrow">Fulfillment</span>
          <h1>Manage Orders</h1>
        </div>
        <div className={styles.tabs}>
          <Link to="/admin" className={styles.tab}>Dashboard</Link>
          <Link to="/admin/products" className={styles.tab}>Products</Link>
          <Link to="/admin/orders" className={`${styles.tab} ${styles.tabActive}`}>Orders</Link>
        </div>
      </div>

      {loading && <p className="page-loading">Loading orders...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && orders.length === 0 && <p className="page-empty">No orders yet.</p>}

      {!loading && !error && orders.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Placed</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <>
                <tr key={o._id}>
                  <td>
                    <button
                      type="button"
                      className={styles.expandBtn}
                      onClick={() => toggleExpand(o._id)}
                      aria-label="Toggle shipping address"
                    >
                      {expandedId === o._id ? "▾" : "▸"}
                    </button>
                  </td>
                  <td>#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name}<br /><span style={{ color: "var(--color-ink-soft)", fontSize: "0.8rem" }}>{o.user?.email}</span></td>
                  <td>{o.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                  <td>₹{o.totalAmount.toLocaleString("en-IN")}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td>
                    <select
                      className={styles.statusSelect}
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
                {expandedId === o._id && (
                  <tr key={`${o._id}-address`}>
                    <td></td>
                    <td colSpan={6}>
                      <div className={styles.addressPanel}>
                        <strong>Shipping Address:</strong>
                        <p>{o.shippingAddress?.line1}</p>
                        <p>
                          {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pincode}
                        </p>
                        <p>Phone: {o.shippingAddress?.phone}</p>
                        <p>Payment: {o.paymentMethod}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;