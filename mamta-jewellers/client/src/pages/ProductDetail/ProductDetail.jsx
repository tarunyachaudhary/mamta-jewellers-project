import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios.js";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./ProductDetail.module.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError("This piece could not be found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p className="page-loading">Loading...</p>;
  if (error || !product) return <p className="page-empty">{error || "Product not found."}</p>;

  const handleAdd = () => {
    if (!user) {
      navigate(`/login?redirect=/product/${id}`);
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate(`/login?redirect=/product/${id}`);
      return;
    }
    addToCart(product, quantity);
    navigate("/cart");
  };

  return (
    <div className={`container ${styles.page}`}>
      <Link to="/collection" className={styles.back}>&larr; Back to collection</Link>

      <div className={styles.grid}>
        <div className={styles.imageWrap}>
          <img src={product.image} alt={product.name} />
        </div>

        <div className={styles.info}>
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p className={styles.price}>₹{product.price.toLocaleString("en-IN")}</p>
          <p className={styles.material}>{product.material}</p>
          <p className={styles.description}>{product.description}</p>

          <p className={styles.stock}>
            {product.stock > 0 ? `${product.stock} in stock` : "Currently out of stock"}
          </p>

          {product.stock > 0 && (
            <div className={styles.qtyRow}>
              <label htmlFor="qty">Quantity</label>
              <div className={styles.qtyControl}>
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button className="btn btn-outline" disabled={product.stock === 0} onClick={handleAdd}>
              {added ? "Added ✓" : "Add to Cart"}
            </button>
            <button className="btn btn-primary" disabled={product.stock === 0} onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;