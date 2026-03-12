import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { verifyAdminToken, logoutAdmin } from "./utilsAdministrator";

export const AdminPrivate = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) {
            navigate("/admin/login");
            return;
        }

        verifyAdminToken(token, dispatch).then(res => {
            if (!res.success) {
                navigate("/admin/login");
            } else {
                setLoading(false);
            }
        }).catch(err => {
            console.error(err);
            localStorage.removeItem("admin_token");
            navigate("/admin/login");
        });
    }, []);

    const handleLogout = () => {
        logoutAdmin(dispatch);
        navigate("/admin/login");
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const admin = store.admin_info || {};

    return (
        <div className="container-fluid py-5 px-md-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <div className="row justify-content-center mb-5">
                <div className="col-lg-11 col-xl-10">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end pb-4 border-bottom" style={{ borderColor: "#dee2e6" }}>
                        <div>
                            <h1 className="display-6 fw-bold mb-1" style={{ color: "var(--text-dark, #111111)" }}>Mi Perfil</h1>
                            <p className="text-muted mb-0">Configuración de cuenta de administrador</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn rounded-pill px-4 mt-3 mt-md-0 shadow-sm transition-all text-white border-0"
                            style={{ backgroundColor: "var(--accent-pink, #f24171)", fontWeight: "600" }}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-11 col-xl-10">
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
                        <div className="card-body p-4 p-md-5">
                            <div className="d-flex align-items-center mb-5">
                                <div className="flex-shrink-0">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${admin.name || 'Admin'}&background=5c73f2&color=fff&size=128`}
                                        className="rounded-circle shadow-sm border border-3 border-white"
                                        style={{ width: "100px" }}
                                        alt="Avatar"
                                    />
                                </div>
                                <div className="ms-4">
                                    <h4 className="fw-bold mb-0" style={{ color: "var(--text-dark, #111111)" }}>{admin.name || "Administrador"}</h4>
                                    <span className="badge bg-opacity-10 rounded-pill px-3 py-2 mt-2"
                                        style={{ backgroundColor: "var(--secondary-color, #91bbf2)", color: "var(--primary-color, #5c73f2)", border: "1px solid var(--secondary-color)" }}>
                                        <i className="bi bi-shield-check me-1"></i> Administrador Activo
                                    </span>
                                </div>
                            </div>

                            <h6 className="text-uppercase fw-bold mb-4" style={{ letterSpacing: "1px", fontSize: "0.8rem", color: "var(--primary-color, #5c73f2)" }}>
                                Detalles de la cuenta
                            </h6>

                            <div className="row g-4 mb-5">
                                <div className="col-sm-6">
                                    <label className="text-muted small d-block mb-2 fw-semibold">Identificador</label>
                                    <div className="p-3 bg-light rounded-3 font-monospace fw-bold" style={{ color: "var(--text-dark)" }}>
                                        #{admin.id}
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="text-muted small d-block mb-2 fw-semibold">Rol del Sistema</label>
                                    <div className="p-3 bg-light rounded-3 fw-bold" style={{ color: "var(--text-dark)" }}>
                                        <i className="bi bi-person-badge me-2" style={{ color: "var(--primary-color)" }}></i>Sistema Admin
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label className="text-muted small d-block mb-2 fw-semibold">Email Registrado</label>
                                    <div className="p-3 bg-light rounded-3 fw-medium">
                                        <i className="bi bi-envelope me-2" style={{ color: "var(--primary-color)" }}></i>{admin.email}
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="text-muted small d-block mb-2 fw-semibold">Último Acceso</label>
                                    <div className="p-3 bg-light rounded-3 small text-muted">
                                        Hoy, 2026-03-01
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid">
                                <button className="btn btn-lg py-3 rounded-3 fw-bold shadow-sm transition-all text-white border-0"
                                    style={{ backgroundColor: "var(--primary-color, #5c73f2)" }}>
                                    <i className="bi bi-pencil-square me-2"></i> Editar Datos de Perfil
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="accordion border-0 shadow-sm rounded-4 overflow-hidden mb-5" id="accordionExample">
                        <div className="accordion-item border-0">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button collapsed bg-white text-dark fw-bold py-3 shadow-none"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseData"
                                >
                                    <i className="bi bi-braces me-2" style={{ color: "var(--primary-color)" }}></i> Metadatos de Sesión (JSON)
                                </button>
                            </h2>
                            <div id="collapseData" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body p-0" style={{ background: "#111111" }}>
                                    <pre className="mb-0 p-4" style={{ fontSize: "0.85rem", maxHeight: "300px", overflowY: "auto", color: "var(--secondary-color)" }}>
                                        {JSON.stringify(admin, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};