import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const CompanyStoragesDetails = () => {

    const { id } = useParams()
    const [storage, setStorage] = useState(null)
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token =
            localStorage.getItem("token_company") ||
            localStorage.getItem("admin_token");

        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(import.meta.env.VITE_BACKEND_URL + `/private/company/storages/${id}`, {
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(data => {
                setStorage(data)
                setLoading(false)
            })

        fetch(`${import.meta.env.VITE_BACKEND_URL}/private/company/locations`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(response => response.json())
            .then(data => setLocations(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <h2>Loading storages details</h2>
    if (!storage) return <h2>No storage found</h2>

    const storageLocation = locations.find(loc => loc.id === storage.location_id)

    return (
        <div className="container-fluid py-5 px-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-lg border-0">

                        <div className="card-header header-primary text-info-emphasis text-center py-4">
                            <h3 className="mb-0 fw-bold" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
                                Storage Details
                            </h3>
                        </div>

                        <div className="card-body">

                            <div className="mb-3">
                                <p className="text-muted mb-1">ID:</p>
                                <p className="fw-semibold fs-5 mb-0">{storage.id}</p>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6 mb-4">
                                    <p className="text-muted mb-1">Size:</p>
                                    <p className="fw-semibold fs-5 mb-0">{storage.size}</p>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <p className="text-muted mb-1">Price:</p>
                                    <p className="fw-semibold fs-5 mb-0">{storage.price}€</p>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6 mb-3">
                                    <p className="text-muted mb-1">Status:</p>
                                    <p className="fw-semibold fs-5 mb-0">{storage.status ? "Available" : "Occupied"}</p>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <p className="text-muted mb-1">Location:</p>
                                    <p className="fw-semibold fs-5 mb-0">
                                        {storageLocation ? `${storageLocation.address} - ${storageLocation.city}` : storage.location_id}
                                    </p>
                                </div>
                            </div>

                            <div className="card-footer bg-white border-0 py-3 text-center">
                                <button className="btn btn-secondary-custom shadow" onClick={() => navigate(-1)}>
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};