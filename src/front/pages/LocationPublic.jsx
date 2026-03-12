import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteLocations, getLocations } from "./utilsLocations"

export const LocationPublic = () => {

    const [allLocation, setAllLocation] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLocations = async () => {
            const data = await getLocations()
            setAllLocation(data || [])
        }
        fetchLocations()
    }, [])

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-mx-auto">

                    <div className="card shadow-lg border-0">

                        <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
                            <h3 className="mb-0">
                                Locations
                            </h3>
                        </div>

                        {allLocation.map((location) => (
                            <div key={location.id} className="card mb-2 shadow-sm">
                                <div className="card-body">

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <p className="text-muted mb-1">Company Name:</p>
                                            <p className="fw-semibold fs-5 mb-0">{location.company_name}</p>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <p className="text-muted mb-1">ID:</p>
                                            <p className="fw-semibold fs-5 mb-0">{location.id}</p>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <p className="text-muted mb-1">City:</p>
                                            <p className="fw-semibold fs-5 mb-0"> {location.city}</p>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <p className="text-muted mb-1">Address:</p>
                                            <p className="fw-semibold fs-5 mb-0">{location.address}</p>
                                        </div>
                                    </div>

                                    <div className="row">

                                        <div className="col-md-6 mb-3">
                                            <p className="text-muted mb-1">Longitude:</p>
                                            <p className="fw-semibold fs-5 mb-0">{location.longitude}</p>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <p className="text-muted mb-1">Latitude:</p>
                                            <p className="fw-semibold fs-5 mb-0">{location.latitude}</p>
                                        </div>
                                        <div className="d-flex justify-content-end gap-1 mt-2">
                                            <button className="btn btn-outline-secondary shadow"
                                                onClick={() => navigate(`/location-details/${location.id}`)}
                                            >
                                                <i className="fa-regular fa-eye"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {allLocation.length === 0 && <p>No locations found</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
