import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Account.module.css";

const statusColor = {
  Placed: "#c9a24b",
  Confirmed: "#3f6fb0",
  Shipped: "#8c1c3f",
  Delivered: "#2f7a4f",
  Cancelled: "#b3311f",
};

const CUSTOMER_TABS = [
  { key: "profile", label: "Profile" },
  { key: "address", label: "Manage Address" },
  { key: "orders", label: "Order History" },
];

const ADMIN_TABS = [
  { key: "profile", label: "Profile" },
];

const Account = () => {
  const { user, updateProfile } = useAuth();
  const isAdmin = user?.role === "admin";
  const TABS = isAdmin ? ADMIN_TABS : CUSTOMER_TABS;
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [addressForm, setAddressForm] = useState({
    line1: user?.address?.line1 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    phone: user?.address?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (isAdmin) {
      setOrdersLoading(false);
      return;
    }
    const load = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data);
      } catch (err) {
        // silently ignore, empty state will show
      } finally {
        setOrdersLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage("");
    try {
      await updateProfile({ name: profileForm.name, phone: profileForm.phone });
      setSaveMessage("Profile updated successfully.");
    } catch (err) {
      setSaveMessage("Could not update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    console.log("updateProfile is:", updateProfile);
    setSaving(true);
    setSaveMessage("");
    try {
      await updateProfile({ address: addressForm });
      setSaveMessage("Address updated successfully.");
    } catch (err) {
      setSaveMessage("Could not update address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <h1>My Account</h1>
      <p className={styles.greeting}>Welcome back, {user?.name}.</p>

      {searchParams.get("ordered") === "true" && (
        <p className="success-text">Your order has been placed successfully!</p>
      )}

      <div className={styles.dashboard}>
        <div className={styles.sidebar}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ""}`}
              onClick={() => {
                setActiveTab(tab.key);
                setSaveMessage("");
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className={styles.formCard}>
              <h3 className={styles.subheading}>Profile Details</h3>
              {saveMessage && <p className="success-text">{saveMessage}</p>}

              <div className="form-field">
                <label>Name</label>
                <input
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input value={user?.email || ""} disabled />
                <small className={styles.hint}>Email cannot be changed.</small>
              </div>
              <div className="form-field">
                <label>Phone Number</label>
                <input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <button className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {activeTab === "address" && (
            <form onSubmit={handleAddressSubmit} className={styles.formCard}>
              <h3 className={styles.subheading}>Manage Address</h3>
              {saveMessage && <p className="success-text">{saveMessage}</p>}

              <div className="form-field">
                <label>Address</label>
                <input
                  value={addressForm.line1}
                  onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                />
              </div>
              <div className={styles.row}>
                <div className="form-field">
                  <label>City</label>
                  <input
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>State</label>
                  <input
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className="form-field">
                  <label>Pincode</label>
                  <input
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Phone</label>
                  <input
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <button className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Address"}
              </button>
            </form>
          )}

          {activeTab === "orders" && (
            <div>
              <h3 className={styles.subheading}>Order History</h3>

              {ordersLoading && <p className="page-loading">Loading your orders...</p>}

              {!ordersLoading && orders.length === 0 && (
                <p className="page-empty">You haven't placed any orders yet.</p>
              )}

              {!ordersLoading && orders.length > 0 && (
                <div className={styles.orders}>
                  {orders.map((order) => (
                    <div key={order._id} className={styles.order}>
                      <div className={styles.orderHeader}>
                        <div>
                          <p className={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p className={styles.orderDate}>
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <span className={styles.status} style={{ background: statusColor[order.status] }}>
                          {order.status}
                        </span>
                      </div>
                      <div className={styles.itemsList}>
                        {order.items.map((item, idx) => (
                          <div key={idx} className={styles.itemRow}>
                            <span>{item.name} × {item.quantity}</span>
                            <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>
                      <div className={styles.orderTotal}>
                        <span>Total</span>
                        <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;