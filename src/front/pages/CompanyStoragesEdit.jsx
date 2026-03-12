import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


export const CompanyStoragesEdit = () => {

    const { storage_id } = useParams()
    const navigate = useNavigate()

    const [locations, setLocations] = useState([])
    const [size, setSize] = useState("")
    const [price, setPrice] = useState("")
    const [locationId, setLocationId] = useState("")
    const [status, setStatus] = useState("true")
    const [photo, setPhoto] = useState("")
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        const token =
            localStorage.getItem("token_company") ||
            localStorage.getItem("admin_token");

        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(import.meta.env.VITE_BACKEND_URL + `/private/company/storages/${storage_id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(response => response.json())
            .then(data => {
                setSize(data.size)
                setPrice(data.price)
                setLocationId(data.location_id)
                setStatus(data.status)
                setLoading(false)
                setPhoto(data.photo)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })

        fetch(`${import.meta.env.VITE_BACKEND_URL}/private/company/locations`, {
            headers: { Authorization: "Bearer " + token }
        })
            .then(res => res.json())
            .then(data => {
                setLocations(data)
                setLoading(false)
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

        fetch(import.meta.env.VITE_BACKEND_URL + `pi/private/company/storages/${storage_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                size,
                price,
                location_id: locationId,
                status,
                photo
            })
        })
            .then(response => response.json())
            .then(() => {
                navigate(-1)
            })
            .catch(err => {
                console.error(err)
                alert("Error updating storage")
            })
    }

    if (loading) return <h2>Loading storage...</h2>

    return (
        <div className="container-fluid py-5 px-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-lg border-0">

                        <div className="card-header header-primary text-info-emphasis text-center py-4">
                            <h3 className="mb-0 fw-bold" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
                                Edit Storage
                            </h3>
                        </div>

                        <div className="card-body">

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Size</label>
                                    <input type="text" className="form-control input-custom" value={size} onChange={e => setSize(e.target.value)} />

                                    <label className="form-label fw-semibold mt-3">Location</label>
                                    <select className="form-control input-custom" value={locationId} onChange={e => setLocationId(e.target.value)}>
                                        <option value="">Select location</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>
                                                {loc.address} - {loc.city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Price</label>
                                    <input type="number" className="form-control input-custom" value={price} onChange={e => setPrice(e.target.value)} />

                                    <label className="form-label fw-semibold mt-3">Status</label>
                                    <select className="form-control input-custom" value={status ? "true" : "false"} onChange={e => setStatus(e.target.value === "true")}>
                                        <option value="true">Available</option>
                                        <option value="false">Occupied</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="form-label fw-semibold">Photo</label>
                                    <input type="file" className="form-control input-custom" onChange={handleUploadPhoto} />
                                </div>

                                {uploading && <p className="mt-2">Uploading image...</p>}

                                {photo && (<div className="mt-3 text-center">
                                    <img src={photo} alt="Location" className="img-fluid rounded shadow" />
                                </div>
                                )}
                            </div>

                            <div className="card-footer bg-white border-0 py-3 mt-3">
                                <div className="d-flex flex-column align-items-center gap-3">
                                    <button className="btn btn-secondary-custom shadow" onClick={handleUpdate}>
                                        Save
                                    </button>
                                    <button className="btn btn-secondary-custom shadow" onClick={() => navigate(-1)}>
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