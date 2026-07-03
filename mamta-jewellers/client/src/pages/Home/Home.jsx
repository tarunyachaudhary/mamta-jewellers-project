import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import styles from "./Home.module.css";

const categories = [
  { name: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600" },
  { name: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600" },
  { name: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600" },
  { name: "Bangles", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=600" },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/products", { params: { featured: true } });
        setFeatured(data.slice(0, 4));
      } catch (err) {
        setError("Could not load featured pieces right now.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className="eyebrow">Handcrafted in Varanasi since generations</span>
          <h1>Jewellery that carries a story worth telling.</h1>
          <p>Gold, diamond and bridal pieces made the traditional way, finished for the modern wardrobe.</p>
          <div className={styles.heroActions}>
            <Link to="/collection" className="btn btn-gold">Explore Collection</Link>
            <Link to="/collection?category=Necklaces" className="btn btn-outline">Bridal Edit</Link>
          </div>
        </div>
      </section>

      <section className={`container ${styles.categories}`}>
        <h2>Shop by Category</h2>
        <div className={styles.categoryGrid}>
          {categories.map((c) => (
            <Link key={c.name} to={`/collection?category=${c.name}`} className={styles.categoryCard}>
              <img src={c.image} alt={c.name} />
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={`container ${styles.featured}`}>
        <div className={styles.featuredHeader}>
          <h2>Featured Pieces</h2>
          <Link to="/collection" className={styles.viewAll}>View all &rarr;</Link>
        </div>

        {loading && <p className="page-loading">Loading featured jewellery...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <div className={styles.productGrid}>
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className={styles.about}>
        <div className="container">
          <span className="eyebrow">Our Promise</span>
          <h2>Certified purity. Honest pricing. No compromises.</h2>
          <p>Every piece at Mamta Jewellers is BIS hallmarked and comes with a certificate of authenticity, so every purchase is one you can trust for generations.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
