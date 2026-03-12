import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "../utilsClients.js";



export const ClientCreate = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
        is_active: true
});    

    const navigate = useNavigate();

    // Form handling
    const handleChange = (c) => {
        const { name, value, type, checked } = c.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    //Create or edit

    const handleSave = () => {
            createClient(form)
            .then(() => navigate("/clients"))
            .catch(console.error);
    };


    return (
        <div className="container mt-4">
            <h1>New Client</h1>

            <div className="mb-3">
                <label>Email</label>
                <input className="form-control"
                       name="email"
                       value={form.email}
                       onChange={handleChange}
                />
            </div>  

            <div className="mb-3">
                <label>Password</label>
                <input type="password"
                       className="form-control"
                       name="password"
                       value={form.password}
                       onChange={handleChange}
                />
            </div>

            <div className="form-check mb-3">
                <input type="checkbox"
                       className="form-check-input"
                       name="is_active"
                       checked={form.is_active}
                       onChange={handleChange}
                />
                <label className="form-check-label">Active</label>
            </div>

            <button className="btn btn-success"
                     onClick={handleSave}
             >
                Save
             </button>

            <button className="btn btn-secondary"
                    onClick={() => navigate("/clients")}
             >
                Cancel
             </button>
             
        </div>
    );
}; 
