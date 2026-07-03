import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={`container ${styles.grid}`}>
      <div>
        <div className={styles.logo}>Mamta Jewellers</div>
        <p className={styles.tag}>Fine gold, diamond and bridal jewellery, handcrafted in Varanasi.</p>
      </div>

      <div>
        <h4>Shop</h4>
        <Link to="/collection">All Collection</Link>
        <Link to="/collection?category=Rings">Rings</Link>
        <Link to="/collection?category=Necklaces">Necklaces</Link>
      </div>

      <div>
        <h4>Account</h4>
        <Link to="/login">Customer Login</Link>
        <Link to="/register">Create Account</Link>
        <Link to="/admin/login">Admin Login</Link>
      </div>

      <div>
        <h4>Contact</h4>
        <p className={styles.contactRow}>
          <span className={styles.icon}>📞</span> 9984374060
        </p>
        <p className={styles.contactRow}>
          <span className={styles.icon}>✉️</span> mamtajewellers4060@gmail.com
        </p>
        <p className={styles.contactRow}>
          <span className={styles.icon}>📍</span> Varanasi, Uttar Pradesh
        </p>
      </div>
    </div>

    <div className={styles.bottom}>© {new Date().getFullYear()} Mamta Jewellers. All rights reserved.</div>
  </footer>
);

export default Footer;