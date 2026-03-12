import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "../utilsClients.js";


export const ClientSignup = () => {

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
            .then(() => navigate("/client/login"))
            .catch(console.error);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="card shadow-lg p-4" style={{ maxWidth: "450px", width: "100%", borderRadius: "15px" }}>

                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Create New Client</h2>
                    <p className="text-muted small">Register a new user in the system</p>
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3 text-start">
                        <label className="form-label fw-bold">Email</label>
                        <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} placeholder="name@example.com" required />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label fw-bold">Password</label>
                        <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} placeholder="********" required />
                    </div>
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-primary w-100 fw-bold py-2 mt-4" onClick={handleSave} style={{ borderRadius: "8px" }}>Create account</button>
                        <button type="button" className="btn btn-light w-100 fw-bold py-2 mt-4" onClick={() => navigate("/client/login")} style={{ borderRadius: "8px" }}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 
