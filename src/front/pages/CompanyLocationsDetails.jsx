import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const CompanyLocationsDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [location, setLocation] = useState(null)
    const [loading, setLoading] = useState(true)

    const getAvailableToken = () => {
        return localStorage.getItem("token_company") || localStorage.getItem("admin_token");
    }

    useEffect(() => {
        const token = getAvailableToken();

        if (!token) return

        fetch(import.meta.env.VITE_BACKEND_URL + `/private/company/locations/${id}`, {
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
        })

            .then(response => response.json())
            .then(data => {
                setLocation(data)
                setLoading(false)
            })
    }, [id])

    if (loading) return <h2>Loading location...</h2>
    if (!location) return <h2>Location not found</h2>

    return (
        <div className="container-fluid py-5 px-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-4">
                    <div className="card shadow-lg border-0">

                        <div className="card-header header-primary text-info-emphasis text-center py-4">
                            <h3 className="mb-0 fw-bold" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
                                Location Details
                            </h3>
                        </div>

                        <div className="card-body">
                            
                            <div className="mb-3">
                                <p className="text-muted mb-1">ID:</p>
                                <p className="fw-semibold fs-5 mb-0">{location.id}</p>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6 mb-4">
                                    <p className="text-muted mb-1">Address:</p>
                                    <p className="fw-semibold fs-5 mb-0">{location.address}</p>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <p className="text-muted mb-1">City:</p>
                                    <p className="fw-semibold fs-5 mb-0">{location.city}</p>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6 mb-3">
                                    <p className="text-muted mb-1">Latitude:</p>
                                    <p className="fw-semibold fs-5 mb-0">{location.latitude}</p>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <p className="text-muted mb-1">Longitude:</p>
                                    <p className="fw-semibold fs-5 mb-0">{location.longitude}</p>
                                </div>
                            </div>

                            <div className="card-footer bg-white border-0 py-3 text-center">
                                <button className="btn btn-secondary-custom shadow" onClick={() => navigate("/companies/private/locations")}>
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}