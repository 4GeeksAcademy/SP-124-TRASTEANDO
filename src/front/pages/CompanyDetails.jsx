import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getCompany } from "../utilsCompanies"

export const CompanyDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [company, setCompany] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await getCompany(id)
                setCompany(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchCompany()
    }, [id])

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        )
    }

    if (!company) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-warning shadow-sm rounded-4">
                    <i className="bi bi-exclamation-triangle me-2"></i> Empresa no encontrada
                </div>
                <button className="btn btn-primary rounded-pill mt-3" onClick={() => navigate("/companies")}>
                    Volver a la lista
                </button>
            </div>
        )
    }

    return (
        <div className="container mt-5 pb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    
                    {/* Botón de volver arriba para que no estorbe */}
                    <button 
                        className="btn btn-link text-decoration-none text-muted mb-3 p-0" 
                        onClick={() => navigate("/companies")}
                    >
                        <i className="bi bi-arrow-left me-2"></i> Volver al listado
                    </button>

                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        {/* Header con gradiente */}
                        <div className="card-header bg-dark bg-gradient text-white py-4 px-4 border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3 shadow" style={{ width: "60px", height: "60px" }}>
                                        <i className="bi bi-building fs-2 text-white"></i>
                                    </div>
                                    <div>
                                        <h2 className="h3 mb-0 fw-bold">{company.name}</h2>
                                        <span className="badge bg-primary-subtle text-primary rounded-pill fw-normal">Empresa Registrada</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-4 p-md-5 bg-white">
                            <div className="row g-4">
                                {/* CIF */}
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center p-3 border rounded-3 bg-light">
                                        <div className="flex-shrink-0">
                                            <i className="bi bi-file-earmark-text text-primary fs-4"></i>
                                        </div>
                                        <div className="ms-3 overflow-hidden">
                                            <p className="text-muted small mb-0 uppercase tracking-wider fw-bold text-uppercase">CIF / Identificación</p>
                                            <p className="mb-0 fs-5 text-dark fw-semibold text-truncate">{company.cif}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center p-3 border rounded-3 bg-light">
                                        <div className="flex-shrink-0">
                                            <i className="bi bi-envelope text-primary fs-4"></i>
                                        </div>
                                        <div className="ms-3 overflow-hidden">
                                            <p className="text-muted small mb-0 fw-bold text-uppercase">Email de contacto</p>
                                            <p className="mb-0 fs-5 text-dark fw-semibold text-truncate">{company.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div className="col-12">
                                    <div className="d-flex align-items-start p-3 border rounded-3 bg-light">
                                        <div className="flex-shrink-0 mt-1">
                                            <i className="bi bi-geo-alt text-primary fs-4"></i>
                                        </div>
                                        <div className="ms-3 w-100">
                                            <p className="text-muted small mb-0 fw-bold text-uppercase">Dirección Fiscal</p>
                                            <p className="mb-0 fs-5 text-dark fw-semibold">{company.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sección Extra Decorativa (opcional) */}
                            <div className="mt-5 pt-4 border-top">
                                <div className="d-flex justify-content-end gap-2">
                                    <button className="btn btn-outline-secondary px-4 rounded-pill shadow-sm" onClick={() => navigate("/companies")}>
                                        Cerrar
                                    </button>
                                    <button className="btn btn-primary px-4 rounded-pill shadow-sm" onClick={() => window.print()}>
                                        <i className="bi bi-printer me-2"></i> Imprimir Ficha
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-muted mt-4 small">
                        Identificador de registro: <span className="font-monospace">{id}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}