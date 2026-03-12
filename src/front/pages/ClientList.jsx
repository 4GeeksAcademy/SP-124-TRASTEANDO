import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClients, deleteClient } from "../utilsClients.js";




export const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load Clients
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

    useEffect(() => {
        loadClients()
    }, []);

    //Delete

    const handleDelete = (id) => {
        if (!confirm("Are you sure to delete this client?"))
            return;

        deleteClient(id)
            .then(loadClients)
            .catch(err => console.error(err));
    };

    if (loading) return <p>Loading clients...</p>;


    return (
       <div className="container-fluid py-5 px-md-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
    
    {/* Cabecera de la sección */}
    <div className="row justify-content-center mb-4">
        <div className="col-lg-11 col-xl-10">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center pb-3 border-bottom">
                <div>
                    <h1 className="h2 fw-bold mb-1" style={{ color: "var(--text-dark, #111111)" }}>Gestión de Clientes</h1>
                    <p className="text-muted mb-0">Listado total de usuarios registrados en el sistema</p>
                </div>
                <button 
                    className="btn rounded-pill px-4 mt-3 mt-md-0 shadow-sm text-white border-0"
                    style={{ backgroundColor: "var(--primary-color, #5c73f2)", fontWeight: "600" }}
                    onClick={() => navigate("/clients/new")}
                >
                    <i className="bi bi-person-plus-fill me-2"></i> Nuevo Cliente
                </button>
            </div>
        </div>
    </div>

    <div className="row justify-content-center">
        <div className="col-lg-11 col-xl-10">
            {clients.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                    <i className="bi bi-people text-muted mb-3" style={{ fontSize: "3rem" }}></i>
                    <p className="fs-5 text-muted">No se han encontrado clientes en la base de datos</p>
                </div>
            ) : (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <ul className="list-group list-group-flush">
                        {clients.map(client => (
                            <li
                                key={client.id}
                                className="list-group-item px-4 py-3 d-flex justify-content-between align-items-center transition-all client-item"
                                style={{ borderLeft: client.is_active ? "5px solid var(--primary-color)" : "5px solid #dee2e6" }}
                            >
                                <div className="d-flex align-items-center">
                                    <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                                        style={{ 
                                            width: "45px", 
                                            height: "45px", 
                                            backgroundColor: client.is_active ? "var(--secondary-color, #91bbf2)" : "#f8f9fa",
                                            color: client.is_active ? "white" : "#6c757d"
                                        }}
                                    >
                                        <i className="bi bi-person fs-5"></i>
                                    </div>
                                    <div>
                                        <span className="d-block fw-bold text-dark mb-0">{client.email}</span>
                                        <span className={`badge rounded-pill ${client.is_active ? "bg-success-subtle text-success" : "bg-light text-muted"}`} style={{ fontSize: "0.75rem" }}>
                                            {client.is_active ? "● Activo" : "○ Inactivo"}
                                        </span>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-light rounded-pill px-3 btn-sm fw-semibold shadow-sm border"
                                        onClick={() => navigate(`/clients/${client.id}`)}
                                        title="Ver Detalles"
                                    >
                                        <i className="bi bi-eye me-1"></i> Ver
                                    </button>

                                    <button
                                        className="btn btn-light rounded-pill px-3 btn-sm fw-semibold shadow-sm border text-primary"
                                        onClick={() => navigate(`/clients/${client.id}/edit`)}
                                        title="Editar"
                                    >
                                        <i className="bi bi-pencil me-1"></i> Editar
                                    </button>

                                    <button
                                        className="btn btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
                                        style={{ width: "32px", height: "32px", borderColor: "var(--accent-pink, #f24171)", color: "var(--accent-pink, #f24171)" }}
                                        onClick={() => handleDelete(client.id)}
                                        title="Eliminar"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
</div>
                    );
                };