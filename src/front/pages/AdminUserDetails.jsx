import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getAdminUser } from "./utilsAdministrator"

export const AdminUserDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [admin, setAdmin] = useState({})

    useEffect(() => {
        const loadAdmin = async () => {
            const data = await getAdminUser(id)
            setAdmin(data)
        }
        loadAdmin()
    }, [id])

    return (
        <div className="container-fluid py-5 px-md-5" style={{ backgroundColor: "#f8f9fa", minHeight: "85vh" }}>
            <div className="row justify-content-center mb-5"> {/* mb-5 asegura separación con el footer */}
                <div className="col-lg-11 col-xl-10">

                    {/* Header / Navegación superior */}
                    <div className="d-flex align-items-center mb-4">
                        <button
                            className="btn btn-light rounded-circle shadow-sm me-3 d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px", border: "1px solid #dee2e6" }}
                            onClick={() => navigate("/admin-users")}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <h3 className="fw-bold m-0" style={{ color: "var(--text-dark, #111111)" }}>Detalles del Administrador</h3>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        {/* Banner superior con color primario */}
                        <div style={{ height: "10px", backgroundColor: "var(--primary-color, #5c73f2)" }}></div>

                        <div className="card-body p-4 p-md-5">
                            <div className="row align-items-center">
                                <div className="col-md-auto mb-4 mb-md-0 text-center text-md-start">
                                    <div
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            backgroundColor: "var(--secondary-color, #91bbf2)",
                                            color: "white",
                                            fontSize: "2.5rem"
                                        }}
                                    >
                                        {admin.name ? admin.name.charAt(0).toUpperCase() : <i className="bi bi-person"></i>}
                                    </div>
                                </div>

                                <div className="col-md ps-md-4">
                                    <h2 className="display-6 fw-bold mb-1" style={{ color: "var(--text-dark)" }}>{admin.name}</h2>
                                    <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "rgba(92, 115, 242, 0.1)", color: "var(--primary-color)", border: "1px solid var(--secondary-color)" }}>
                                        <i className="bi bi-shield-check me-1"></i> Staff de Administración
                                    </span>
                                </div>
                            </div>

                            <hr className="my-5" style={{ opacity: "0.1" }} />

                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="p-4 rounded-4 bg-light border-0">
                                        <label className="text-muted small d-block fw-bold text-uppercase mb-2" style={{ letterSpacing: "0.5px" }}>
                                            <i className="bi bi-hash me-1"></i> Identificador del Sistema
                                        </label>
                                        <span className="fs-5 fw-bold font-monospace" style={{ color: "var(--text-dark)" }}>
                                            {admin.id}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-4 rounded-4 bg-light border-0">
                                        <label className="text-muted small d-block fw-bold text-uppercase mb-2" style={{ letterSpacing: "0.5px" }}>
                                            <i className="bi bi-envelope me-1"></i> Correo Electrónico
                                        </label>
                                        <span className="fs-5 fw-bold" style={{ color: "var(--text-dark)" }}>
                                            {admin.email}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-top">
                                <button
                                    className="btn btn-outline-dark rounded-pill px-4 fw-bold"
                                    onClick={() => navigate("/admin-users")}
                                >
                                    <i className="bi bi-chevron-left me-2"></i> Volver al listado
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}