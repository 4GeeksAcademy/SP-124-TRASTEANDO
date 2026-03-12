import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStorage } from "../utilsStorages.js";

export const StorageCreate = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        size: "",
        price: "",
        status: true,
        location_id: ""
    });

    // Form handling
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(value)
        setForm({
            ...form,
            [name]: name=== "location_id" ? parseInt(value) : name=="status" ? value== true : value

        });
    };

    // Create storage
    const handleSave = () => {
        createStorage(form)
            .then(() => navigate("/storages"))
            .catch(console.error);
    };

    return (
        <div className="container mt-4">
            <h1>New Storage</h1>

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
                    <option value={""}>Select Status</option>
                    <option value={true}>Available</option>
                    <option value={false}>Occupied</option>
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

            <button className="btn btn-success me-2" onClick={handleSave}>
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
