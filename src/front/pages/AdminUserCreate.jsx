import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createAdminUsers } from "./utilsAdministrator"

export const AdminUserCreate = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null) // Estado para capturar el error de duplicado

    const navigate = useNavigate()

    const handleCreate = async (e) => {
        // Prevenir comportamiento por defecto si fuera un form
        if (e) e.preventDefault();
        setError(null);

        if (!name || !email || !password) {
            setError("Por favor, rellena todos los campos.");
            return;
        }

        try {
            const newUser = await createAdminUsers(name, email, password);
            if (newUser) {
                navigate("/admin-users");
            }
        } catch (err) {
            setError("No se pudo crear el administrador. Es posible que el email ya esté en uso.");
            console.error(err);
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-6">
                    
                    {/* Botón Volver */}
                    <button className="btn btn-link text-muted text-decoration-none mb-3 p-0" onClick={() => navigate("/admin-users")}>
                        ← Volver a Administradores
                    </button>

                    <div className="card border-0 shadow-sm p-4">
                        <div className="card-body">
                            <h2 className="fw-bold text-dark mb-4">Nuevo Administrador</h2>

                            {/* Alerta de Error si el email está repetido */}
                            {error && (
                                <div className="alert alert-danger border-0 small py-2 mb-4" role="alert">
                                    <i className="fas fa-exclamation-circle me-2"></i>{error}
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="small fw-bold text-uppercase text-muted mb-1">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    className="form-control bg-light border-0" 
                                    placeholder="Ej. Juan Pérez"
                                    value={name} 
                                    onChange={(e) => { setName(e.target.value); if(error) setError(null); }} 
                                />
                            </div>

                            <div className="mb-3">
                                <label className="small fw-bold text-uppercase text-muted mb-1">Email de Acceso</label>
                                <input 
                                    type="email" 
                                    className="form-control bg-light border-0" 
                                    placeholder="admin@empresa.com"
                                    value={email} 
                                    onChange={(e) => { setEmail(e.target.value); if(error) setError(null); }} 
                                />
                            </div>

                            <div className="mb-4">
                                <label className="small fw-bold text-uppercase text-muted mb-1">Contraseña</label>
                                <input 
                                    type="password" 
                                    className="form-control bg-light border-0" 
                                    placeholder="••••••••"
                                    value={password} 
                                    onChange={(e) => { setPassword(e.target.value); if(error) setError(null); }} 
                                />
                            </div>

                            <div className="d-grid gap-2">
                                <button className="btn btn-primary fw-bold py-2" onClick={handleCreate}>
                                    Crear Administrador
                                </button>
                                <button className="btn btn-light text-muted py-2" onClick={() => navigate("/admin-users")}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}