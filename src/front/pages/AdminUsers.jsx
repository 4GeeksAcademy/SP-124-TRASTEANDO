import { useEffect, useState } from "react"
import { deleteAdminUsers, getAdminUsers } from "./utilsAdministrator"
import { useNavigate } from "react-router-dom"
import { AdminUserEdit } from "./AdminUserEdit"

export const AdminUsers = () => {
    const [adminUsers, setAdminUsers] = useState([])
    const [editAdmin, setEditAdmin] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        showAdmins()
    }, [])

    const showAdmins = async () => {
        setLoading(true)
        const data = await getAdminUsers()
        setAdminUsers(data)
        setLoading(false)
    }

    const handleDelete = async (id) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este administrador?")
        if (!confirmed) return

        const success = await deleteAdminUsers(id)
        if (success) {
            setAdminUsers(adminUsers.filter(u => u.id !== id))
        }
    }

    if (loading && !editAdmin) return (
        <div className="container py-5 text-center text-muted">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Cargando administradores...
        </div>
    )

    return (
        <div className="container-fluid py-5 px-md-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <div className="row justify-content-center">
                <div className="col-lg-11 col-xl-10">

                    {editAdmin ? (
                        <AdminUserEdit
                            admin={editAdmin}
                            onUpdate={(updatedUser) => {
                                const newList = adminUsers.map(u =>
                                    u.id === updatedUser.id ? updatedUser : u
                                )
                                setAdminUsers(newList)
                                setEditAdmin(null)
                            }}
                            onBack={() => setEditAdmin(null)}
                        />
                    ) : (
                        <>
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
                                <div>
                                    <h2 className="fw-bold m-0" style={{ color: "var(--text-dark, #111111)" }}>Administradores</h2>
                                    <p className="text-muted mb-0">Gestión de usuarios con acceso al panel de control</p>
                                </div>
                                <button
                                    className="btn rounded-pill px-4 mt-3 mt-md-0 shadow-sm text-white border-0"
                                    style={{ backgroundColor: "var(--primary-color, #5c73f2)", fontWeight: "600" }}
                                    onClick={() => navigate("/admin-create")}
                                >
                                    <i className="bi bi-person-plus-fill me-2"></i> Nuevo Admin
                                </button>
                            </div>
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush">
                                        {adminUsers.length === 0 ? (
                                            <li className="list-group-item text-center py-5">
                                                <i className="bi bi-shield-lock text-muted display-4 d-block mb-3"></i>
                                                <span className="text-muted">No hay administradores registrados en el sistema.</span>
                                            </li>
                                        ) : (
                                            adminUsers.map((admin) => (
                                                <li key={admin.id} className="list-group-item p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center transition-all">
                                                    <div className="d-flex align-items-center mb-3 mb-md-0">
                                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
                                                            style={{ width: "50px", height: "50px", backgroundColor: "var(--secondary-color, #91bbf2)", color: "white" }}>
                                                            <i className="bi bi-person-badge-fill fs-4"></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="fw-bold mb-1" style={{ color: "var(--text-dark)", fontSize: '1.1rem' }}>
                                                                {admin.name}
                                                            </h6>
                                                            <div className="d-flex flex-wrap gap-3">
                                                                <small className="text-muted">
                                                                    <strong className="text-uppercase" style={{ fontSize: '0.65rem', color: "var(--primary-color)" }}>Email:</strong> {admin.email}
                                                                </small>
                                                                <small className="text-muted">
                                                                    <strong className="text-uppercase" style={{ fontSize: '0.65rem' }}>ID:</strong> #{admin.id}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex gap-2 w-100 w-md-auto justify-content-md-end">
                                                        <button
                                                            className="btn btn-light rounded-pill px-3 border shadow-sm fw-semibold"
                                                            onClick={() => navigate(`/admin-details/${admin.id}`)}
                                                        >
                                                            Detalles
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-primary rounded-pill px-3 fw-semibold shadow-sm"
                                                            style={{ borderColor: "var(--primary-color)", color: "var(--primary-color)" }}
                                                            onClick={() => setEditAdmin(admin)}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="btn rounded-pill px-3 fw-semibold shadow-sm text-white"
                                                            style={{ backgroundColor: "var(--accent-pink, #f24171)" }}
                                                            onClick={() => handleDelete(admin.id)}
                                                        >
                                                            Borrar
                                                        </button>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}