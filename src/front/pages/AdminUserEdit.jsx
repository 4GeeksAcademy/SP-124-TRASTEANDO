import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { updateAdminUsers } from "./utilsAdministrator"

export const AdminUserEdit = ({ admin, onUpdate, onBack }) => {
    const [name, setName] = useState(admin.name)
    const [email, setEmail] = useState(admin.email)
    const [password, setPassword] = useState("") // La dejamos vacía por defecto al editar
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleEdit = async () => {
        setError(null)
        
        // El nombre y email siguen siendo obligatorios
        if (!name || !email) {
            setError("El nombre y el email son obligatorios.")
            return
        }

        try {
            // Pasamos los datos. Si password está vacío, el backend debería ignorarlo o mantener el anterior
            const updatedUser = await updateAdminUsers(admin.id, name, email, password)

            if (updatedUser) {
                onUpdate(updatedUser)
                navigate("/admin-users")
            }
        } catch (err) {
            // Capturamos si el email nuevo ya lo tiene otro admin
            setError("Error al actualizar: El email ya está en uso por otro administrador.")
            console.error(err)
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-6">
                    
                    {/* Botón Volver */}
                    <button className="btn btn-link text-muted text-decoration-none mb-3 p-0" onClick={onBack}>
                        ← Cancelar y volver
                    </button>

                    <div className="card border-0 shadow-sm p-4">
                        <div className="card-body">
                            <h2 className="fw-bold text-dark mb-4">Editar Administrador</h2>

                            {/* Alerta de Error */}
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
                                    value={name} 
                                    onChange={(e) => { setName(e.target.value); if(error) setError(null); }} 
                                />
                            </div>

                            <div className="mb-3">
                                <label className="small fw-bold text-uppercase text-muted mb-1">Email de Acceso</label>
                                <input 
                                    type="email" 
                                    className="form-control bg-light border-0" 
                                    value={email} 
                                    onChange={(e) => { setEmail(e.target.value); if(error) setError(null); }} 
                                />
                            </div>

                            <div className="mb-4">
                                <label className="small fw-bold text-uppercase text-muted mb-1">Nueva Contraseña</label>
                                <input 
                                    type="password" 
                                    className="form-control bg-light border-0" 
                                    placeholder="Dejar en blanco para mantener la actual"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                                <small className="text-muted d-block mt-1">Solo rellena este campo si deseas cambiar la clave.</small>
                            </div>

                            <div className="d-grid gap-2">
                                <button className="btn btn-primary fw-bold py-2" onClick={handleEdit}>
                                    Guardar Cambios
                                </button>
                                <button className="btn btn-light text-muted py-2" onClick={onBack}>
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