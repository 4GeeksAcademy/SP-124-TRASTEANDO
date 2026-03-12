import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


export const CompanyStoragesCreate = () => {

    const [locations, setLocations] = useState([])
    const [size, setSize] = useState("")
    const [price, setPrice] = useState("")
    const [locationId, setLocationId] = useState("")
    const [photo, setPhoto] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token =
            localStorage.getItem("token_company") ||
            localStorage.getItem("admin_token");

        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/private/company/locations`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(response => response.json())
            .then(data => {
                setLocations(data)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setError("Failed to load locations")
                setLoading(false)
            })
    }, [])

    const uploadImage = async () => {
        if (!photo) return null

        const formData = new FormData()
        formData.append("file", photo)
        formData.append("upload_preset", "topydai")

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dofzpindm/image/upload",
            {
                method: "POST",
                body: formData
            }
        )

        const data = await response.json()
        return data.secure_url
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem("token_company")
        if (!token) return

        if (!size || !price || !locationId) {
            setError("All fields are required")
            return
        }

        try {

            let imageUrl = null

            if (photo) {
                imageUrl = await uploadImage()
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/private/company/storages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        size,
                        price,
                        location_id: locationId,
                        photo: imageUrl
                    })
                }
            )

            if (!response.ok) {
                throw new Error("Failed to create storage")
            }

            navigate(-1)

        } catch (error) {
            console.error(error)
            setError("Failed to create storage")
        }
    }

    if (loading) return <h2>Loading locations...</h2>

    return (
        <div className="container-fluid py-5 px-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-lg border-0">

                        <div className="card-header header-primary text-info-emphasis text-center py-4">
                            <h3 className="mb-0 fw-bold" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
                                Create New Storage
                            </h3>
                        </div>

                        <div className="card-body">

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Size</label>
                                        <input type="text" className="form-control input-custom" value={size} onChange={(e) => setSize(e.target.value)} />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Price</label>
                                        <input type="number" className="form-control input-custom" value={price} onChange={(e) => setPrice(e.target.value)} />
                                    </div>

                                    <div>
                                        <label className="form-label fw-semibold">Location</label>
                                        <select
                                            className="form-control input-custom"
                                            value={locationId}
                                            onChange={(e) => setLocationId(e.target.value)}
                                        >
                                            <option value="">Select location</option>
                                            {locations.map(loc => (
                                                <option key={loc.id} value={loc.id}>
                                                    {loc.address} - {loc.city}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Photo</label>
                                        <input
                                            type="file"
                                            className="form-control input-custom"
                                            accept="image/*"
                                            onChange={(e) => setPhoto(e.target.files[0])}
                                        />
                                    </div>

                                    <div className="card-footer bg-white border-0 py-3 mt-3">
                                        <div className="d-flex flex-column align-items-center gap-3">
                                            <button type="submit" className="btn btn-secondary-custom shadow">
                                                Create Storage
                                            </button>
                                            <button type="button" className="btn btn-secondary-custom shadow" onClick={() => navigate(-1)}>
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}