import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getLease } from "../utilsLeases" 

export const LeasesDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [lease, setLease] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLease = async () => {
            try {
                const data = await getLease(id)
                setLease(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchLease()
    }, [id])

    if (loading) return <div className="container mt-5">Cargando...</div>

    if (!lease) return <div className="container mt-5">Arrendamiento no encontrada</div>

    return (

        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow-sm">
                            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                                <h2 className="h4 mb-0">{lease.id}</h2>
                                <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/leases")}>Back to List </button>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <strong>Start date:</strong> <span className="text-muted">{lease.start_date}</span>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>End date:</strong> <span className="text-muted">{lease.end_date}</span>
                                    </div>
                                    <div className="col-12">
                                        <strong>Status:</strong> <span className="text-muted">{lease.status ? "Active" : "Not Active"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )

}