import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const CompanyLocationsCreate = () => {

    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [photo, setPhoto] = useState(null)
    const navigate = useNavigate()

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

    const handleCreate = async () => {
        const token = localStorage.getItem("token_company")
        if (!token) {
            navigate("/companies/login")
            return
        }

        try {
            let imageUrl = null

            if (photo) {
                imageUrl = await uploadImage()
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/private/company/locations`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token
                    },
                    body: JSON.stringify({
                        address,
                        city,
                        latitude,
                        longitude,
                        photo: imageUrl
                    })
                }
            )

            if (!response.ok) {
                throw new Error("Create failed")
            }

            navigate("/companies/private/locations")

        } catch (error) {
            console.error(error)
            alert("Error creating location")
        }
    }

    return (
        <div className="container-fluid py-5 px-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-lg border-0">

                        <div className="card-header header-primary text-info-emphasis text-center py-4">
                            <h3 className="mb-0 fw-bold" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
                                Create New Location
                            </h3>
                        </div>

                        <div className="card-body">

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Address</label>
                                    <input
                                        type="text"
                                        className="form-control input-custom"
                                        placeholder="Avenida de America 123"
                                        value={address}
                                        onChange={e => setAddress(e.target.value)} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">City</label>
                                    <input 
                                    type="text" 
                                    className="form-control input-custom"
                                     placeholder="Madrid" 
                                     value={city}
                                      onChange={e => setCity(e.target.value)} />
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Latitude</label>
                                    <input 
                                    type="text" 
                                    className="form-control input-custom" 
                                    placeholder="40.7128" 
                                    value={latitude} 
                                    onChange={e => setLatitude(e.target.value)} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Longitude</label>
                                    <input 
                                    type="text" 
                                    className="form-control input-custom"
                                     placeholder="-74.0060" 
                                     value={longitude} 
                                     onChange={e => setLongitude(e.target.value)} />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Photo</label>
                                <input
                                    type="file"
                                    className="form-control input-custom"
                                     onChange={e => setPhoto(e.target.files[0])}
                                />
                            </div>

                            <div className="card-footer bg-white border-0 py-3 mt-3">
                                <div className="d-flex flex-column align-items-center gap-3">
                                    <button className="btn btn-secondary-custom shadow" onClick={handleCreate}>
                                        Create Location
                                    </button>
                                    <button className="btn btn-secondary-custom shadow" onClick={() => navigate("/companies/private/locations")}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}