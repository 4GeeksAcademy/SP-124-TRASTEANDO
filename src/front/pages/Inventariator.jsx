import { useEffect, useState, useRef } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const COLOR = "#5C73F2";

export const Inventariator = () => {
  const { store } = useGlobalReducer();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [placement, setPlacement] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingPlacement, setEditingPlacement] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestionMeta, setSuggestionMeta] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const loadCategories = async () => {
    const resp = await fetch(`${API_URL}/categories`);
    const data = await resp.json();
    setCategories(data);
  };

  const loadProducts = async () => {
    const token = store.tokenClient || localStorage.getItem("tokenClient");
    if (!token) return;
    const resp = await fetch(`${API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!resp.ok) return;
    const data = await resp.json();
    setProducts(data);
  };

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => {
    if (store.tokenClient || localStorage.getItem("tokenClient")) loadProducts();
  }, [store.tokenClient]);

  const uploadImage = async (file) => {
    if (!file) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "topydai");
      const resp = await fetch("https://api.cloudinary.com/v1_1/dofzpindm/image/upload", { method: "POST", body: formData });
      const data = await resp.json();
      return data.secure_url || null;
    } finally { setUploading(false); }
  };

  const suggestCategory = async (secureUrl, token) => {
    const resp = await fetch(`${API_URL}/products/suggest-category`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ image_url: secureUrl })
    });
    if (!resp.ok) return null;
    return await resp.json();
  };

  const resetForm = () => {
    setName(""); setDescription(""); setPlacement(""); setCategoryId("");
    setSuggestionMeta(null); setImageUrl(null); setImageFile(null); setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = store.tokenClient;
    if (!token) return alert("No autenticado");
    if (!name) return alert("Faltan campos");
    const resp = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, description, placement, category_id: parseInt(categoryId, 10), image_url: imageUrl }),
    });
    if (!resp.ok) { const error = await resp.json(); return alert(error.msg || "Error creando producto"); }
    await loadProducts();
    resetForm();
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    const token = store.tokenClient || localStorage.getItem("tokenClient");
    if (!token) return;
    setIsAnalyzing(true);
    try {
      const secureUrl = await uploadImage(file);
      if (!secureUrl) return;
      setImageUrl(secureUrl);
      const suggestion = await suggestCategory(secureUrl, token);
      if (!suggestion) return;
      setSuggestionMeta(suggestion);
      if (suggestion.suggested_category_id != null) setCategoryId(String(suggestion.suggested_category_id));
      setName(prev => prev?.trim() ? prev : (suggestion.suggested_title ?? ""));
      setDescription(prev => prev?.trim() ? prev : (suggestion.suggested_description ?? ""));
    } finally { setIsAnalyzing(false); }
  };

  const handleExportCSV = async () => {
    const token = store.tokenClient;
    if (!token) return;
    const resp = await fetch(`${API_URL}/products/export`, { headers: { Authorization: `Bearer ${token}` } });
    const blob = await resp.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "mis_productos.csv"; a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="vstack gap-4 p-4">

      {/* CABECERA */}
      <div className="d-flex justify-content-between align-items-center p-2">
        <h4 className="fw-bold mb-0">My Inventory</h4>
        <button
          className="btn btn-sm px-3"
          onClick={handleExportCSV}
          style={{ background: COLOR, color: "#fff", borderRadius: 10 }}
        >
          <i className="bi bi-download me-2"></i>Export CSV
        </button>
      </div>

      {/* FORMULARIO AÑADIR PRODUCTO */}
      <div className="rounded-4 p-4" style={{ background: "#fff", border: "1px solid #e8eaf6" }}>
        <h5 className="fw-bold mb-4">
          <i className="bi bi-plus-circle me-2" style={{ color: COLOR }}></i>
          Add Product
        </h5>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            {/* ZONA DE IMAGEN */}
            <div className="col-12">
              <label
                htmlFor="upload-product"
                className="d-flex flex-column align-items-center justify-content-center gap-2 rounded-3 border-2"
                style={{
                  border: `2px dashed ${COLOR}`,
                  borderRadius: 16,
                  padding: "24px",
                  cursor: (isAnalyzing || uploading) ? "not-allowed" : "pointer",
                  background: "#f8f9ff",
                  opacity: (isAnalyzing || uploading) ? 0.7 : 1
                }}
              >
                {(previewUrl || imageUrl) ? (
                  <img
                    src={imageUrl || previewUrl}
                    alt="preview"
                    style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12 }}
                  />
                ) : (
                  <>
                    <i className="bi bi-cloud-arrow-up fs-1" style={{ color: COLOR }}></i>
                    <span className="small text-muted">Click to upload an image</span>
                  </>
                )}

                {(uploading || isAnalyzing) && (
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <div className="spinner-border spinner-border-sm" style={{ color: COLOR }} role="status"></div>
                    <span className="small" style={{ color: COLOR }}>
                      {uploading ? "Subiendo imagen..." : "Analizando con IA..."}
                    </span>
                  </div>
                )}

                {suggestionMeta && !isAnalyzing && (
                  <span className="badge rounded-pill px-3 py-2 small" style={{ background: "#e8eaf6", color: COLOR }}>
                    <i className="bi bi-stars me-1"></i>
                    IA sugiere: {suggestionMeta.suggested_category_name} ({(suggestionMeta.confidence * 100).toFixed(0)}%)
                  </span>
                )}
              </label>
              <input
                id="upload-product"
                ref={fileInputRef}
                type="file"
                className="d-none"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={isAnalyzing || uploading}
              />
            </div>

            {/* NOMBRE */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Product name</label>
              <input
                className="form-control"
                placeholder="Ej: Lámpara de pie"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAnalyzing || uploading}
                style={{ borderRadius: 10 }}
              />
            </div>

            {/* CATEGORÍA */}
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Category</label>
              <select
                className="form-select"
                value={String(categoryId ?? "")}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isAnalyzing || uploading}
                style={{ borderRadius: 10 }}
              >
                <option value="">Choose category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="col-12">
              <label className="form-label fw-semibold small">Description</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Descripción del producto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isAnalyzing || uploading}
                style={{ borderRadius: 10 }}
              />
            </div>

            {/* UBICACIÓN */}
            <div className="col-12">
              <label className="form-label fw-semibold small">Storage spot</label>
              <input
                className="form-control"
                placeholder="Ej: Caja 3 · Estantería A · Balda 2"
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                disabled={isAnalyzing || uploading}
                style={{ borderRadius: 10 }}
              />
            </div>

            {/* BOTÓN */}
            <div className="col-12 text-end">
              <button
                type="submit"
                className="btn px-4"
                disabled={isAnalyzing || uploading}
                style={{ background: COLOR, color: "#fff", borderRadius: 10 }}
              >
                <i className="bi bi-plus-lg me-2"></i>Create Product
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="rounded-4 p-4" style={{ background: "#fff", border: "1px solid #e8eaf6" }}>
        <h5 className="fw-bold mb-4">
          <i className="bi bi-box-seam me-2" style={{ color: COLOR }}></i>
          My Products ({products.length})
        </h5>

        {products.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <p className="text-muted mt-2">You have no products yet. Add your first one!</p>
          </div>
        ) : (
          <div className="row g-3">
            {products.map((prod) => (
              <div className="col-md-6 col-xl-4" key={prod.id}>
                <div
                  className="card border-0 h-100"
                  style={{ borderRadius: 16, border: "1px solid #e8eaf6 !important", boxShadow: "0 2px 12px rgba(92,115,242,0.07)" }}
                >
                  {/* Imagen del producto */}
                  {prod.image_url ? (
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: "16px 16px 0 0" }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ height: 160, background: "#f4f6fb", borderRadius: "16px 16px 0 0" }}
                    >
                      <i className="bi bi-image text-muted fs-1"></i>
                    </div>
                  )}

                  <div className="card-body p-3">
                    {/* Nombre y categoría */}
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="fw-bold mb-0">{prod.name}</h6>
                      <span
                        className="badge rounded-pill small"
                        style={{ background: "#e8eaf6", color: COLOR, fontSize: 11 }}
                      >
                        {prod.category?.name}
                      </span>
                    </div>

                    {/* Descripción */}
                    <p className="text-muted small mb-2" style={{ lineHeight: 1.4 }}>{prod.description}</p>

                    {/* Ubicación */}
                    {editingId === prod.id ? (
                      <div className="d-flex gap-2 mt-2">
                        <input
                          className="form-control form-control-sm"
                          value={editingPlacement}
                          onChange={(e) => setEditingPlacement(e.target.value)}
                          style={{ borderRadius: 8 }}
                        />
                        <button
                          className="btn btn-sm"
                          style={{ background: COLOR, color: "#fff", borderRadius: 8 }}
                          onClick={async () => {
                            const token = store.tokenClient;
                            if (!token) return;
                            await fetch(`${API_URL}/products/${prod.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ placement: editingPlacement }),
                            });
                            setEditingId(null);
                            loadProducts();
                          }}
                        >
                          <i className="bi bi-check-lg"></i>
                        </button>
                      </div>
                    ) : (
                      prod.placement && (
                        <p className="small mb-0">
                          <i className="bi bi-geo-alt me-1" style={{ color: COLOR }}></i>
                          {prod.placement}
                        </p>
                      )
                    )}
                  </div>

                  {/* Botones acción */}
                  <div className="card-footer bg-transparent border-0 d-flex gap-2 px-3 pb-3">
                    <button
                      className="btn btn-sm flex-grow-1"
                      style={{ background: "#f4f6fb", color: COLOR, borderRadius: 8, fontWeight: 500 }}
                      onClick={() => { setEditingId(prod.id); setEditingPlacement(prod.placement || ""); }}
                    >
                      <i className="bi bi-pencil me-1"></i>Editar
                    </button>
                    <button
                      className="btn btn-sm flex-grow-1"
                      style={{ background: "#fff0f0", color: "#dc3545", borderRadius: 8, fontWeight: 500 }}
                      onClick={async () => {
                        if (!window.confirm("¿Eliminar producto?")) return;
                        const token = store.tokenClient;
                        if (!token) return;
                        await fetch(`${API_URL}/products/${prod.id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        loadProducts();
                      }}
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};