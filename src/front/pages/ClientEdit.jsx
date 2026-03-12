import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClients, editClient } from "../utilsClients.js";

//Edit

export const ClientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    is_active: true,
    photo_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); 

  // Load client data

  useEffect(() => {
    getClients(id)
      .then((data) => {
        setForm({
          email: data.email,
          is_active: data.is_active,
          photo_url: data.photo_url || "", 
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  //4. Función para subir fotos a Cloudinary

  const handleUploadPhoto = async (f) => {
    const file = f.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "topydai"); // 5. Preset de Cloudinary

    setUploading(true);

    try {
      const result = await fetch("https://api.cloudinary.com/v1_1/dofzpindm/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await result.json();

      if (data.secure_url) {
        setForm({ ...form, photo_url: data.secure_url });
      } else {

      }
    } catch (error) {

    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading client...</p>;

  const handleChange = (c) => {
    const { name, value, type, checked } = c.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    editClient(id, form)
      .then(() => navigate("/client/private"))
      .catch(console.error);
  };

  return (
    <div className="container-fluid py-5 px-md-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
    <div className="row justify-content-center mb-5">
        <div className="col-lg-11 col-xl-10">
            
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                <button 
                    className="btn btn-light rounded-circle shadow-sm me-3 d-flex align-items-center justify-content-center" 
                    style={{ width: "40px", height: "40px", border: "1px solid #dee2e6" }}
                    onClick={() => navigate("/client/private")}
                >
                    <i className="bi bi-arrow-left"></i>
                </button>
                <h2 className="fw-bold m-0" style={{ color: "var(--text-dark, #111111)" }}>Editar Cliente</h2>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div style={{ height: "6px", backgroundColor: "var(--primary-color, #5c73f2)" }}></div>
                        <div className="card-body p-4 p-md-5">
                            
                            <div className="text-center mb-5">
                                <div className="position-relative d-inline-block">
                                    <img 
                                        src={form.photo_url || "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2205.jpg?semt=ais_rp_progressive&w=740&q=80"} 
                                        alt="Preview" 
                                        className="rounded-circle shadow-sm object-fit-cover border"
                                        style={{ width: "130px", height: "130px", border: "4px solid white" }}
                                    />
                                    {uploading && (
                                        <div className="position-absolute top-50 start-50 translate-middle">
                                            <div className="spinner-border text-primary" role="status"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <label className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold" style={{ cursor: 'pointer' }}>
                                        <i className="bi bi-camera me-2"></i> Cambiar Foto
                                        <input 
                                            type="file" 
                                            hidden 
                                            onChange={handleUploadPhoto} 
                                            disabled={uploading} 
                                        />
                                    </label>
                                    <p className="text-muted small mt-2">JPG o PNG. Máximo 2MB</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="small fw-bold text-uppercase text-muted mb-2 d-block">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg bg-light border-0 rounded-3"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>

                            <input type="hidden" name="photo_url" value={form.photo_url} />

                            <div className="form-check form-switch mb-5 p-3 rounded-3 border bg-white shadow-xs">
                                <div className="ms-2">
                                    <input 
                                        className="form-check-input ms-0" 
                                        type="checkbox" 
                                        name="is_active" 
                                        checked={form.is_active} 
                                        onChange={handleChange} 
                                        id="activeCheck" 
                                        style={{ scale: "1.2", cursor: "pointer" }}
                                    />
                                    <label className="form-check-label text-dark fw-bold ms-4" htmlFor="activeCheck" style={{ cursor: "pointer" }}>
                                        Cuenta de usuario activa
                                    </label>
                                </div>
                            </div>

                            <div className="d-grid gap-2">
                                <button 
                                    className="btn btn-lg rounded-pill text-white border-0 py-3 shadow-sm fw-bold" 
                                    style={{ backgroundColor: "var(--primary-color, #5c73f2)" }} 
                                    onClick={handleSave}
                                >
                                    Guardar Cambios
                                </button>
                                <button 
                                    className="btn btn-link text-muted py-2 text-decoration-none fw-semibold" 
                                    onClick={() => navigate("/client/private")}
                                >
                                    Cancelar y volver
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 bg-white shadow-sm rounded-4 p-4 mt-4 mt-lg-0">
                        <h5 className="fw-bold mb-3"><i className="bi bi-info-circle me-2 text-primary"></i> Consejos</h5>
                        <ul className="list-unstyled small text-muted">
                            <li className="mb-2">● Asegúrate de que el email sea válido para que el cliente reciba notificaciones.</li>
                            <li className="mb-2">● Si desactivas la cuenta, el cliente no podrá iniciar sesión.</li>
                            <li>● Las fotos de perfil ayudan a identificar rápidamente a los usuarios en el listado.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  );
};
