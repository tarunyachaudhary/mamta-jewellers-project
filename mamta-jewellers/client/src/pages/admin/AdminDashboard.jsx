import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./AdminLayout.module.css";

const emptyAdminForm = { name: "", email: "", password: "" };

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState(emptyAdminForm);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: products }, { data: orderData }] = await Promise.all([
          api.get("/products"),
          api.get("/orders"),
        ]);
        setProductCount(products.length);
        setOrders(orderData);
      } catch (err) {
        // handled by empty states
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pending = orders.filter((o) => o.status === "Placed").length;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const openAdminModal = () => {
    setAdminForm(emptyAdminForm);
    setAdminError("");
    setAdminSuccess("");
    setShowAdminModal(true);
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccess("");
    setCreatingAdmin(true);
    try {
      await api.post("/auth/create-admin", adminForm);
      setAdminSuccess(`Admin account created for ${adminForm.email}`);
      setAdminForm(emptyAdminForm);
    } catch (err) {
      setAdminError(err.response?.data?.message || "Could not create admin account.");
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.topBar}>
        <div>
          <span className="eyebrow">Store Overview</span>
          <h1>Welcome, {user?.name}</h1>
        </div>
        <div className={styles.tabs}>
          <Link to="/admin" className={`${styles.tab} ${styles.tabActive}`}>Dashboard</Link>
          <Link to="/admin/products" className={styles.tab}>Products</Link>
          <Link to="/admin/orders" className={styles.tab}>Orders</Link>
          <button className="btn btn-primary" onClick={openAdminModal}>+ Add Admin</button>
          <button className={styles.tab} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {!loading && (
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span>Total Products</span>
            <strong>{productCount}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Pending Orders</span>
            <strong>{pending}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Total Revenue</span>
            <strong>₹{revenue.toLocaleString("en-IN")}</strong>
          </div>
        </div>
      )}

      <h3 style={{ marginBottom: 16 }}>Recent Orders</h3>
      {loading && <p className="page-loading">Loading dashboard...</p>}
      {!loading && orders.length === 0 && <p className="page-empty">No orders placed yet.</p>}
      {!loading && orders.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 6).map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-8).toUpperCase()}</td>
                <td>{o.user?.name || "N/A"}</td>
                <td>₹{o.totalAmount.toLocaleString("en-IN")}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAdminModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAdminModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Add New Admin</h3>
            <form onSubmit={handleCreateAdmin}>
              {adminError && <p className="error-text">{adminError}</p>}
              {adminSuccess && <p className="success-text">{adminSuccess}</p>}

              <div className="form-field">
                <label>Name</label>
                <input
                  required
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAdminModal(false)}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary" disabled={creatingAdmin}>
                  {creatingAdmin ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;