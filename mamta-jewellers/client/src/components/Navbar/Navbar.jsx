import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    clearCart();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.nav}`}>
        <Link to="/" className={styles.logo}>
          Mamta <span>Jewellers</span>
        </Link>

        <button className={styles.burger} onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>

        <nav className={`${styles.links} ${open ? styles.open : ""}`}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/collection" onClick={() => setOpen(false)}>Collection</Link>
          <Link to="/cart" onClick={() => setOpen(false)} className={styles.cartLink}>
            Cart{totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
          </Link>

          {user ? (
            <div className={styles.userMenu}>
              <Link to={user.role === "admin" ? "/admin" : "/account"} onClick={() => setOpen(false)}>
                {user.name.split(" ")[0]}
              </Link>
              <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="btn btn-primary">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
