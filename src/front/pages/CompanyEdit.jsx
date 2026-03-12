import { useEffect, useState } from "react";    
import { useNavigate, useParams } from "react-router-dom";
import { getCompany, editCompany } from "../utilsCompanies";

export const CompanyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    cif: "",
    email: "",
    address: "",
    photo_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Cargar datos de la empresa
  useEffect(() => {
    getCompany(id)
      .then((data) => {
        setForm({
          name: data.name || "",
          cif: data.cif || "",
          email: data.email || "",
          address: data.address || "",
          photo_url: data.photo_url || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleUploadPhoto = async (f) => {
    const file =f.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);
    formData.set("upload_preset", "topydai");

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
          console.error("Error en Cloudinaty:", data);
        }
      } catch (error) {
        console.error("Error subiendo foto:", error);
      } finally {
        setUploading(false);
      }
  };

  if (loading) return <p>Loading company...</p>;

  const handleChange = (c) => {
    const { name, value } = c.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSave = () => {
    editCompany(id, form)
      .then(() => navigate("/companies/private"))
      .catch(console.error);
  };

  return (
    <div className="container mt-4">
      <h1>Edit Company</h1>

      <div className="mb-3">
        <label>Name</label>
        <input
          className="form-control"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label>CIF</label>
        <input
          className="form-control"
          name="cif"
          value={form.cif}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input
          className="form-control"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label>Address</label>
        <input
          className="form-control"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
      </div>

      {/* Selección de archivos */}

      <div className="mb-3">
        <label className="form-label">Cambiar foto de Perfil</label>
        <input 
          type="file"
          className="form-control"
          onChange={handleUploadPhoto}
          disabled={uploading}
        />
        {uploading && (
          <span className="spinner-border spinner-border-sm text-primary ms-2"></span>
        )}
      </div>

      {/*URL de la foto enviada pro Cloudinary*/}

    <div className="mb-3">
        {/* <label>URL de la foto</label> */}
        <input className="form-control bg-light"
              //  type="hidden"
               name="photo_url"
               value={form.photo_url}
               onChange={handleChange}
               placeholder="La URL de la foto"
        />
    </div>
    {/*Preview*/}

    {form.photo_url&& (
      <div className="mb-3">
        <img src={form.photo_url}
             alt="Preview" 
             className="img-thumbnail" 
             style={{width: "150px"}} 
        />
      </div>
    )}

      <button className="btn btn-success" onClick={handleSave}>
        Save
      </button>

      <button
        className="btn btn-secondary ms-2"
        onClick={() => navigate("/companies/private")}
      >
        Cancel
      </button>
    </div>
  );
};