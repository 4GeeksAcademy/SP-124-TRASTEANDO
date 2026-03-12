import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getLocation } from "./utilsLocations"

export const LocationDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [location, setLocation] = useState({})

    useEffect(() => {
        const loadLocation = async () => {
            const data = await getLocation(id)
            setLocation(data)
        }
        loadLocation()
    }, [id])

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                            <h2 className="h4 mb-0">Company ID: {location.company_id}</h2>
                            <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/location")}>Back</button>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <strong>ID:</strong> <span className="text-muted">{location.id}</span>
                                </div>
                                <div className="col-md-6 d-flex flex-column align-items-start">
                                    <strong>Address:</strong> <span className="text-muted">{location.address}</span>
                                    <strong>City:</strong> <span className="text-muted">{location.city}</span>
                                    <strong>Latitude:</strong> <span className="text-muted">{location.latitude}</span>
                                    <strong>Longitude:</strong> <span className="text-muted">{location.longitude}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}