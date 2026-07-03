import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios.js";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import styles from "./Collection.module.css";

const CATEGORIES = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Other"];

const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/products", {
          params: { category: activeCategory, search: search || undefined },
        });
        setProducts(data);
      } catch (err) {
        setError("Could not load the collection right now.");
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(load, 250); // small debounce for search typing
    return () => clearTimeout(timeout);
  }, [activeCategory, search]);

  const setCategory = (cat) => {
    if (cat === "All") setSearchParams({});
    else setSearchParams({ category: cat });
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <div>
          <span className="eyebrow">Full Collection</span>
          <h1>Explore Our Jewellery</h1>
        </div>
        <input
          className={styles.search}
          placeholder="Search jewellery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.filters}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="page-loading">Loading jewellery...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="page-empty">No pieces match this search yet. Try a different category.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
