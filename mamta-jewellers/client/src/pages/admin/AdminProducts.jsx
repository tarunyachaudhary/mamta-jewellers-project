import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import styles from "./AdminLayout.module.css";

const emptyForm = {
  name: "", category: "Rings", material: "", price: "", description: "", image: "", stock: "", featured: false,
};

const CATEGORIES = ["Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Other"];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setShowModal(true);
  };


  const openEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      material: product.material,
      price: product.price,
      description: product.description,
      image: product.image,
      stock: product.stock,
      featured: product.featured,
    });
    setImageFile(null);
    setShowModal(true);
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete product.");
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.url;
    } catch (err) {
      alert("Image upload failed. Please try again.");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image;

      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      if (!imageUrl) {
        alert("Please select an image.");
        setSaving(false);
        return;
      }

      const payload = {
        ...form,
        image: imageUrl,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editingId) {
        const { data } = await api.put(`/products/${editingId}`, payload);
        setProducts((prev) => prev.map((p) => (p._id === editingId ? data : p)));
      } else {
        const { data } = await api.post("/products", payload);
        setProducts((prev) => [data, ...prev]);
      }
      setShowModal(false);
      setImageFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.topBar}>
        <div>
          <span className="eyebrow">Inventory</span>
          <h1>Manage Products</h1>
        </div>
        <div className={styles.tabs}>
          <Link to="/admin" className={styles.tab}>Dashboard</Link>
          <Link to="/admin/products" className={`${styles.tab} ${styles.tabActive}`}>Products</Link>
          <Link to="/admin/orders" className={styles.tab}>Orders</Link>
          <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
        </div>
      </div>

      {loading && <p className="page-loading">Loading products...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><img src={p.image} alt={p.name} className={styles.thumb} /></td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price.toLocaleString("en-IN")}</td>
                <td>{p.stock}</td>
                <td>
                  <div className={styles.rowActions}>
                    <button className={styles.editBtn} onClick={() => openEdit(p)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSave}>
              <div className="form-field">
                <label>Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className={styles.formRow}>
                <div className="form-field">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Material</label>
                  <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className="form-field">
                  <label>Price (₹)</label>
                  <input type="number" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>Stock</label>
                  <input type="number" min="0" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>
              <div className="form-field">
                <label>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                {(imageFile || form.image) && (
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : form.image}
                    alt="preview"
                    style={{ width: 80, height: 80, objectFit: "cover", marginTop: 8, borderRadius: 6 }}
                  />
                )}
              </div>
              <div className="form-field">
                <label>Description</label>
                <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  style={{ width: "auto" }}
                />
                <label htmlFor="featured" style={{ margin: 0 }}>Feature on homepage</label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                  {uploading ? "Uploading image..." : saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
