import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createLocations } from "./utilsLocations"
import { getAllCompanies } from "../utilsCompanies"

export const LocationCreate = () => {

    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [companyId, setCompanyId] = useState("")
    const [companies, setCompanies] = useState([])

    const navigate = useNavigate()

    const loadCompanies = async () => {
        const loadedCompanies = await getAllCompanies()
        setCompanies(loadedCompanies)
    }

    useEffect(() => {
        loadCompanies()
    }, [])

    const handleCreate = async () => {
        if (!address || !city || !latitude || !longitude || !companyId) return

        const newLocation = await createLocations(address, city, latitude, longitude, Number(companyId))

        if (newLocation) {
            navigate("/location")
        }
    }

    return (
        <div className="container py-4">
            <div className="col-lg-6 col-md-8 col-sm-12 mx-auto">

                <h2 className="mb-4">Create Location</h2>

                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">City</label>
                    <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Latitude</label>
                    <input type="text" className="form-control" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Longitude</label>
                    <input type="text" className="form-control" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Companies</label>
                    <select className="form-select" aria-label="Default select example" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>

                        <option value="">Select your Company</option>
                        {companies.map((company) => {
                            return (
                                <option key={company.id} value={company.id}>{company.name}</option>
                            )
                        })}
                    </select>
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={handleCreate}>
                        Create
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate("/location")}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}