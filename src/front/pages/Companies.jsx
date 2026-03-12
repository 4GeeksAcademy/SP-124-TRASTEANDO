import { getCompany, getAllCompanies, deleteCompany, editCompany } from "../utilsCompanies"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUserRole } from "../store"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Companies = () => {
    const { store } = useGlobalReducer();
    const role = getUserRole(store);
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({ name: "", cif: "", address: "", email: "", password: "" });
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleGetCompanies = async () => {
        const data = await getAllCompanies();
        setCompanies(data);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        await editCompany(editingId, formData);
        handleGetCompanies();
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        setFormData({ name: "", cif: "", address: "", email: "", password: "" }); // Reset
    };

    const handleDeleteCompany = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta compañía?')) {
            await deleteCompany(id);
            handleGetCompanies();
        }
    };

    const handleEditCompany = async (id) => {
        const company = await getCompany(id);
        setFormData({ ...company, password: '' });
        setEditingId(id);
        new bootstrap.Modal(document.getElementById('editModal')).show();
    };

    useEffect(() => { handleGetCompanies() }, []);

    return (
        <div className="container-fluid py-5 px-md-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
    <div className="row justify-content-center">
        <div className="col-lg-11 col-xl-10">
            
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
                <div>
                    <h2 className="fw-bold m-0" style={{ color: "var(--text-dark, #111111)" }}>Directorio de Empresas</h2>
                    <p className="text-muted mb-0">Gestiona y visualiza las entidades registradas</p>
                </div>
                {role === "admin" && (
                    <button 
                        className="btn rounded-pill px-4 mt-3 mt-md-0 shadow-sm text-white border-0" 
                        style={{ backgroundColor: "var(--primary-color, #5c73f2)", fontWeight: "600" }}
                        onClick={() => navigate("/CreateCompanies")}
                    >
                        <i className="bi bi-plus-lg me-2"></i> Nueva Empresa
                    </button>
                )}
            </div>

            {/* Companies List Card */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-0">
                    <ul className="list-group list-group-flush">
                        {companies.length > 0 ? (
                            companies.map((company) => (
                                <li key={company.id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center p-4 transition-all">
                                    <div className="d-flex align-items-center mb-3 mb-md-0">
                                        <div className="rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm" 
                                             style={{ width: "50px", height: "50px", backgroundColor: "var(--secondary-color, #91bbf2)", color: "white" }}>
                                            <i className="bi bi-building fs-4"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold fs-5" style={{ color: "var(--text-dark)" }}>{company.name}</h6>
                                            <small className="text-muted"><i className="bi bi-envelope me-1"></i>{company.email}</small>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 w-100 w-md-auto justify-content-md-end">
                                        <button 
                                            className="btn btn-light rounded-pill px-3 border shadow-sm fw-semibold" 
                                            onClick={() => navigate(`/companies/${company.id}`)}
                                        >
                                            Ver más
                                        </button>
                                        
                                        {role === "admin" && (
                                            <>
                                                <button 
                                                    className="btn btn-outline-primary rounded-pill px-3 fw-semibold shadow-sm" 
                                                    style={{ borderColor: "var(--primary-color)", color: "var(--primary-color)" }}
                                                    onClick={() => handleEditCompany(company.id)}
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    className="btn rounded-pill px-3 fw-semibold shadow-sm text-white" 
                                                    style={{ backgroundColor: "var(--accent-pink, #f24171)" }}
                                                    onClick={() => handleDeleteCompany(company.id)}
                                                >
                                                    Borrar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item text-center py-5">
                                <i className="bi bi-search text-muted display-4 d-block mb-3"></i>
                                <span className="text-muted">No hay compañías registradas en el sistema.</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    </div>

    {/* Modal de Edición Estilizado */}
    <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 pb-0 pt-4 px-4">
                    <h5 className="fw-bold fs-4" style={{ color: "var(--primary-color)" }}>
                        <i className="bi bi-pencil-square me-2"></i>Editar Empresa
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                
                <form onSubmit={handleEditSubmit}>
                    <div className="modal-body p-4">
                        <div className="mb-4">
                            <label className="small fw-bold text-uppercase text-muted mb-2">Nombre Comercial</label>
                            <input type="text" className="form-control form-control-lg bg-light border-0 rounded-3" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <label className="small fw-bold text-uppercase text-muted mb-2">CIF / Identificación</label>
                                <input type="text" className="form-control form-control-lg bg-light border-0 rounded-3" name="cif" value={formData.cif} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-4">
                                <label className="small fw-bold text-uppercase text-muted mb-2">Email de Contacto</label>
                                <input type="email" className="form-control form-control-lg bg-light border-0 rounded-3" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="small fw-bold text-uppercase text-muted mb-2">Dirección Fiscal</label>
                            <input type="text" className="form-control form-control-lg bg-light border-0 rounded-3" name="address" value={formData.address} onChange={handleChange} required />
                        </div>
                        
                        <div className="mb-2">
                            <label className="small fw-bold text-uppercase text-muted mb-2">Nueva Contraseña</label>
                            <input type="password" className="form-control form-control-lg bg-light border-0 rounded-3" name="password" value={formData.password} onChange={handleChange} placeholder="Dejar en blanco si no desea cambiarla" />
                        </div>
                    </div>
                    
                    <div className="modal-footer border-0 pb-4 px-4">
                        <button type="button" className="btn btn-link text-muted fw-semibold text-decoration-none" data-bs-dismiss="modal">Cancelar</button>
                        <button 
                            type="submit" 
                            className="btn btn-lg px-5 rounded-pill shadow-sm text-white" 
                            style={{ backgroundColor: "var(--primary-color, #5c73f2)", fontWeight: "600" }}
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
    );
};