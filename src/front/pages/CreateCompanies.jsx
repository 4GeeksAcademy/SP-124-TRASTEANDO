import { useNavigate } from "react-router-dom"
import { createCompany } from "../utilsCompanies"
import { useState } from "react"

export const CreateCompanies = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ name: "", cif: "", address: "", email: "", password: "" })
    const [error, setError] = useState(null) // Estado para manejar el mensaje de error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (error) setError(null) // Limpiar error mientras el usuario escribe
    }


    const handleCreateCompany = async (e) => {
        e.preventDefault()
        try {
            const result = await createCompany(formData)
            
            // Si el backend devuelve un error de duplicado (usualmente status 400 o similar)
            if (result && result.msg) {
                setError(result.msg)
            } else {
                navigate("/companies/login")
            }
        } catch (err) {
            // Capturamos el error de la base de datos (UniqueViolation)
            setError("Error: El email o CIF ya están registrados.")
            console.error(err)
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-6">
                
                    <button className="btn btn-link text-muted text-decoration-none mb-3 p-0" onClick={() => navigate("/companies")}>
                        ← Volver al listado
                    </button>

                    <div className="card border-0 shadow-sm p-4">
                        <div className="card-body">
                            <h2 className="fw-bold text-dark mb-4">Nueva Empresa</h2>

                            {/* Alerta de Error */}
                            {error && (
                                <div className="alert alert-danger border-0 small py-2" role="alert">
                                    <i className="fas fa-exclamation-circle me-2"></i>{error}
                                </div>
                            )}

                            <form onSubmit={handleCreateCompany}>
                                <div className="mb-3">
                                    <label className="small fw-bold text-uppercase text-muted mb-1">Nombre de la Empresa</label>
                                    <input type="text" className="form-control bg-light border-0" placeholder="Ej. Tech Solutions" name="name" value={formData.name} onChange={handleChange} required />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="small fw-bold text-uppercase text-muted mb-1">CIF</label>
                                        <input type="text" className="form-control bg-light border-0" placeholder="A12345678" name="cif" value={formData.cif} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="small fw-bold text-uppercase text-muted mb-1">Email Corporativo</label>
                                        <input type="email" className="form-control bg-light border-0" placeholder="info@empresa.com" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="small fw-bold text-uppercase text-muted mb-1">Dirección Física</label>
                                    <input type="text" className="form-control bg-light border-0" placeholder="Calle Ejemplo 123" name="address" value={formData.address} onChange={handleChange} required />
                                </div>

                                <div className="mb-4">
                                    <label className="small fw-bold text-uppercase text-muted mb-1">Contraseña de Acceso</label>
                                    <input type="password" className="form-control bg-light border-0" placeholder="••••••••" name="password" value={formData.password} onChange={handleChange} required />
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary fw-bold py-2">Registrar Compañía</button>
                                    <button type="button" className="btn btn-light text-muted py-2" onClick={() => navigate("-1")}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}