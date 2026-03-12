import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getLocation, updateLocations } from "./utilsLocations"


export const LocationEdit = () => {

    const { id } = useParams()
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [companyId, setCompanyId] = useState("")    

    const navigate = useNavigate()

    useEffect(() => {
        const loadLocation = async () => {
            const data = await getLocation(id)
            if (data) {
                setAddress(data.address || "")
                setCity(data.city || "")
                setLatitude(data.latitude || "")
                setLongitude(data.longitude || "")
                setCompanyId(data.company_id || "")
            } else {
                alert("Location not found")
                navigate("/location")
            }
        }
        loadLocation()
    }, [id])

    const handleEdit = async () => {
    if (!address || !city || !latitude || !longitude || !companyId) return;

    try {
        await updateLocations(id, address, city, latitude, longitude, Number(companyId));
        navigate("/location");
    } catch (error) {
        alert("Error updating location: " + error.message);
    }
}

    return (
        <div className="container py-4">
            <div className="col-lg-6 col-md-8 col-sm-12 mx-auto">

                <h2 className="mb-4">Edit Location</h2>

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
                    <label className="form-label">Company ID</label>
                    <input type="text" className="form-control" value={companyId} onChange={(e) => setCompanyId(e.target.value)} />
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={handleEdit}>
                        Save
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate("/location")}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}