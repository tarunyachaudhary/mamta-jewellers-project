import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className={styles.card}>
      <Link to={`/product/${product._id}`} className={styles.imageWrap}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.stock === 0 && <span className={styles.soldOut}>Sold Out</span>}
      </Link>
      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className={styles.price}>₹{product.price.toLocaleString("en-IN")}</p>
        <button
          className="btn btn-primary btn-block"
          disabled={product.stock === 0}
          onClick={() => addToCart(product, 1)}
        >
          {product.stock === 0 ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
