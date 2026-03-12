import { useEffect, useState } from "react";
import { getAllClients, createClient, editClient, deleteClient } from "../utilsClients.js";

export const Clients = () => {
    const [clients, setClients] = useState([]);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("list");

    const loadClients = () => {
        setLoading(true);
        getAllClients()
            .then(data => {
                setClients(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => { loadClients() }, []);

    const handleChange = (c) => {
        const { name, value, type, checked } = c.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSave = () => {
        const action = form.id
            ? editClient(form.id, { email: form.email, is_active: form.is_active })
            : createClient({ email: form.email, password: form.password, is_active: form.is_active });

        action
            .then(() => {
                setForm(null);
                setMode("list");
                loadClients();
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
        deleteClient(id).then(loadClients).catch(err => console.error(err));
    };

    if (loading) return (
        <div className="container py-5 text-center text-muted">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Cargando clientes...
        </div>
    );

    return (
        <div className="container-fluid py-5 px-md-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
    <div className="row justify-content-center mb-5">
        <div className="col-lg-11 col-xl-10">
    
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
                <div>
                    <h2 className="fw-bold m-0" style={{ color: "var(--text-dark, #111111)" }}>Gestión de Clientes</h2>
                    <p className="text-muted mb-0">Administra el acceso y estado de los usuarios</p>
                </div>
                {mode === "list" && (
                    <button 
                        className="btn rounded-pill px-4 mt-3 mt-md-0 shadow-sm text-white border-0"
                        style={{ backgroundColor: "var(--primary-color, #5c73f2)", fontWeight: "600" }}
                        onClick={() => {
                            setMode("create");
                            setForm({ email: "", password: "", is_active: true });
                        }}
                    >
                        <i className="bi bi-person-plus-fill me-2"></i> Nuevo Cliente
                    </button>
                )}
            </div>
            {mode === "list" && (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-body p-0">
                        <ul className="list-group list-group-flush">
                            {clients.length === 0 ? (
                                <li className="list-group-item text-center py-5">
                                    <i className="bi bi-people text-muted display-4 d-block mb-3"></i>
                                    <span className="text-muted">No se encontraron clientes registrados.</span>
                                </li>
                            ) : (
                                clients.map(client => (
                                    <li key={client.id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center p-4 transition-all">
                                        <div className="d-flex align-items-center mb-3 mb-md-0">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" 
                                                 style={{ width: "45px", height: "45px", backgroundColor: client.is_active ? "var(--secondary-color, #91bbf2)" : "#e9ecef", color: client.is_active ? "white" : "#6c757d" }}>
                                                <i className="bi bi-person"></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-0 fw-bold" style={{ color: "var(--text-dark)" }}>{client.email}</h6>
                                                <span className={`badge rounded-pill mt-1 ${client.is_active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                                    {client.is_active ? "● Activo" : "○ Inactivo"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2 w-100 w-md-auto">
                                            <button className="btn btn-light btn-sm border px-3 rounded-pill fw-semibold shadow-sm" onClick={() => { setForm(client); setMode("details"); }}>Detalles</button>
                                            <button className="btn btn-outline-primary btn-sm px-3 rounded-pill fw-semibold shadow-sm" style={{ borderColor: "var(--primary-color)", color: "var(--primary-color)" }} onClick={() => { setForm(client); setMode("edit"); }}>Editar</button>
                                            <button className="btn btn-sm px-3 rounded-pill fw-semibold shadow-sm text-white border-0" style={{ backgroundColor: "var(--accent-pink, #f24171)" }} onClick={() => handleDelete(client.id)}>Borrar</button>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            )}
            {(mode === "create" || mode === "edit") && (
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div style={{ height: "6px", backgroundColor: "var(--primary-color, #5c73f2)" }}></div>
                            <div className="card-body p-4 p-md-5">
                                <h3 className="fw-bold mb-4" style={{ color: "var(--text-dark)" }}>
                                    {mode === "edit" ? <i className="bi bi-pencil-square me-2"></i> : <i className="bi bi-person-plus me-2"></i>}
                                    {mode === "edit" ? "Editar Cliente" : "Crear Nuevo Cliente"}
                                </h3>
                                
                                <div className="mb-4">
                                    <label className="small fw-bold text-uppercase text-muted mb-2 d-block">Email de usuario</label>
                                    <input type="email" className="form-control form-control-lg bg-light border-0 rounded-3" name="email" value={form.email} onChange={handleChange} placeholder="nombre@cliente.com" />
                                </div>

                                <div className="mb-4">
                                    <label className="small fw-bold text-uppercase text-muted mb-2 d-block">
                                        {mode === "edit" ? "Cambiar Contraseña" : "Contraseña de acceso"}
                                    </label>
                                    <input 
                                        type="password" 
                                        className="form-control form-control-lg bg-light border-0 rounded-3" 
                                        name="password" 
                                        value={form.password || ""} 
                                        onChange={handleChange} 
                                        placeholder={mode === "edit" ? "Dejar vacío si no cambia" : "••••••••"} 
                                    />                        
                                </div>

                                <div className="form-check form-switch mb-5 p-3 rounded-3 border bg-white shadow-xs">
                                    <div className="ms-2">
                                        <input className="form-check-input ms-0" type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} id="activeCheck" style={{ cursor: "pointer", scale: "1.2" }} />
                                        <label className="form-check-label text-dark fw-bold ms-4" htmlFor="activeCheck" style={{ cursor: "pointer" }}>Estado de la cuenta: {form.is_active ? 'Activa' : 'Inactiva'}</label>
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <button className="btn btn-lg rounded-pill text-white border-0 py-3 shadow-sm fw-bold" style={{ backgroundColor: "var(--primary-color, #5c73f2)" }} onClick={handleSave}>
                                        {mode === "edit" ? "Guardar Cambios" : "Registrar Cliente"}
                                    </button>
                                    <button className="btn btn-link text-muted py-2 text-decoration-none fw-semibold" onClick={() => { setForm(null); setMode("list"); }}>
                                        Cancelar y volver
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {mode === "details" && form && (
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden text-center">
                            <div className="card-body p-5">
                                <div className="mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-sm" 
                                         style={{ width: "100px", height: "100px", backgroundColor: "var(--secondary-color, #91bbf2)", color: "white" }}>
                                        <i className="bi bi-person-vcard fs-1"></i>
                                    </div>
                                    <h3 className="fw-bold m-0" style={{ color: "var(--text-dark)" }}>{form.email}</h3>
                                    <p className="text-muted">ID: #{form.id}</p>
                                </div>
                                <div className="p-3 bg-light rounded-4 mb-4 d-flex justify-content-between align-items-center">
                                    <span className="text-muted small fw-bold text-uppercase">Estado de cuenta</span>
                                    <span className={`badge rounded-pill px-3 py-2 ${form.is_active ? "bg-success text-white" : "bg-danger text-white"}`}>
                                        {form.is_active ? "Activo" : "Inactivo"}
                                    </span>
                                </div>
                                <button className="btn btn-lg rounded-pill px-5 border-0 text-white shadow-sm fw-bold w-100" 
                                        style={{ backgroundColor: "var(--primary-color, #5c73f2)" }} 
                                        onClick={() => { setForm(null); setMode("list"); }}>
                                    Volver al listado
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
</div>
    );
};