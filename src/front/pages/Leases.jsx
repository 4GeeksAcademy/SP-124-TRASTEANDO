import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { deleteLease, getAllLeases } from "../utilsLeases";

export const Leases = () => {

    const navigate = useNavigate()
    const [leases, setLeases] = useState([])

    const handleDeleteLease = async (id) => {
        if (confirm('Delete?')) {
            await deleteLease(id)
            handleGetLeases()
        }
    }

    const handleGetLeases = async () => {
        const data = await getAllLeases()
        setLeases(data)
    }

    useEffect(() => {
        handleGetLeases()
    }, [])

    return (

        <>
            {/* see all leases */}
            <div className="text-center" >
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="card shadow-sm">
                                <div className="card-header bg-white py-3">
                                    <h2 className="h4 mb-0 text-secondary">Leases</h2>
                                </div>
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush">
                                        {leases.map((lease) => (
                                            <li className="list-group-item d-flex justify-content-between align-items-center py-3 px-4" key={lease.id} >
                                                <span className="fw-medium text-dark">{lease.start_date}</span>
                                                <div className="btn-group">
                                                    <button className="btn btn-sm btn-outline-warning rounded-pill me-2 px-3" onClick={() => navigate(`/leasesDetails/${lease.id}`)}>Details</button>
                                                    <button className="btn btn-sm btn-outline-warning rounded-pill me-2 px-3" onClick={() => navigate(`/leasesEdit/${lease.id}`)}>Edit</button>
                                                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleDeleteLease(lease.id)}> Delete </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {leases.length === 0 && (
                                    <div className="card-body text-center text-muted">
                                        No hay arrendamientos registrados.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" className="btn btn-success ms-3 mt-4" onClick={() => navigate("/leasesCreate")} >Create a lease</button>
            </div>
        </>

    )
}