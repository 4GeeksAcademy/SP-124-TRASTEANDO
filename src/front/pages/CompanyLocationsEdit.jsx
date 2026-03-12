import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


export const CompanyLocationsEdit = () => {

    const { location_id } = useParams()
    const navigate = useNavigate()

    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [loading, setLoading] = useState(true)
    const [photo, setPhoto] = useState("")
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        const token =
            localStorage.getItem("token_company") ||
            localStorage.getItem("admin_token");

        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(import.meta.env.VITE_BACKEND_URL + `/private/company/locations/${location_id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(resp => resp.json())
            .then(data => {
                setAddress(data.address)
                setCity(data.city)
                setLatitude(data.latitude)
                setLongitude(data.longitude)
                setLoading(false)
                setPhoto(data.photo)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "topydai")

        setUploading(true)

        try {
            const result = await fetch(
                "https://api.cloudinary.com/v1_1/dofzpindm/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            )

            const data = await result.json()

            if (data.secure_url) {
                setPhoto(data.secure_url)
            } else {
                console.error("Error en Cloudinary:", data)
            }

        } catch (error) {
            console.error("Error subiendo foto:", error)
        } finally {
            setUploading(false)
        }
    }

    const handleUpdate = () => {
        const token = localStorage.getItem("token_company")

        fetch(import.meta.env.VITE_BACKEND_URL + `/private/company/locations/${location_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                address,
                city,
                latitude,
                longitude,
                photo
            })
        })
            .then(response => response.json())
            .then(() => {
                navigate("/companies/private/locations")
            })
            .catch(err => {
                console.error(err)
                alert("Error updating location")
            })
    }

    if (loading) return <h2>Loading location...</h2>

    return (
        <div className="container-fluid py-5 px-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-lg border-0">

                        <div className="card-header header-primary text-info-emphasis text-center py-4">
                            <h3 className="mb-0 fw-bold" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
                                Edit Location
                            </h3>
                        </div>

                        <div className="card-body">

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Address</label>
                                    <input type="text" className="form-control input-custom" value={address} onChange={e => setAddress(e.target.value)} />
                                    <label className="form-label fw-semibold mt-3">Latitude</label>
                                    <input type="text" className="form-control input-custom" value={latitude} onChange={e => setLatitude(e.target.value)} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">City</label>
                                    <input type="text" className="form-control input-custom" value={city} onChange={e => setCity(e.target.value)} />
                                    <label className="form-label fw-semibold mt-3">Longitude</label>
                                    <input type="text" className="form-control input-custom" value={longitude} onChange={e => setLongitude(e.target.value)} />
                                </div>

                                <div>
                                    <label className="form-label fw-semibold">Photo</label>
                                    <input type="file" className="form-control input-custom" onChange={handleUploadPhoto} />
                                </div>

                                {uploading && <p className="mt-2">Uploading image...</p>}

                                {photo && (<div className="mt-3 text-center">
                                    <img src={photo} alt="Location" className="img-fluid rounded-3 shadow" style={{ width: "180px", height: "180px", objectFit: "cover" }} />
                                </div>
                                )}
                            </div>

                            <div className="card-footer bg-white border-0 py-3 mt-3">
                                <div className="d-flex flex-column align-items-center gap-3">
                                    <button className="btn btn-secondary-custom shadow" onClick={handleUpdate}>
                                        Save
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