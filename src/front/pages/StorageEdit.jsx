import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStorage, editStorage } from "../utilsStorages.js";

//Edit

export const StorageEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    size: "",
    price: "",
    status: "Available",
    location_id: "",
  });

  const [loading, setLoading] = useState(true);

  // Load storage data

  useEffect(() => {
    getStorage(id)
      .then((data) => {
        console.log("datos recibidos del back", data);
        console.log( "datos revibidos del back", data.status, typeof data.status);
        setForm({
          size: data.size,
          price: data.price,
          status: data.status,
          location_id: data.location_id,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading storage...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSave = () => {
    editStorage(id, form)
      .then(() => navigate("/storages"))
      .catch(console.error);
  };

  return (
    <div className="container mt-4">
      <h1>Edit Storage</h1>

      <div className="mb-3">
        <label>Size</label>
        <input
          className="form-control"
          name="size"
          value={form.size}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label>Price</label>
        <input
          type="number"
          className="form-control"
          name="price"
          value={form.price}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label>Status</label>
        <select
          className="form-control"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Location ID</label>
        <input
          type="number"
          className="form-control"
          name="location_id"
          value={form.location_id}
          onChange={handleChange}
        />
      </div>

      <button className="btn btn-success" onClick={handleSave}>
        Save
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => navigate("/storages")}
      >
        Cancel
      </button>
    </div>
  );
};
