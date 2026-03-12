import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const CompanyPrivateEdit = () => {

    const [companyId, setCompanyId] = useState("")
    const [name, setName] = useState("")
    const [photo, setPhoto] = useState("")
    const [email, setEmail] = useState("")
    const [cif, setCif] = useState("")
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    const navigate = useNavigate()
    const token = localStorage.getItem("token_company")

    useEffect(() => {
        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "/private/company", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => {
                setCompanyId(data.id)
                setName(data.name || "")
                setPhoto(data.photo || "")
                setEmail(data.email || "")
                setCif(data.cif || "")
                setAddress(data.address || "")
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
            const result = await fetch("https://api.cloudinary.com/v1_1/dofzpindm/image/upload",
                {
                    method: "POST",
                    body: formData
                }
            )

            const data = await result.json()

            if (data.secure_url) {
                setPhoto(data.secure_url)
            } else {
                console.error("Error en Cloudinary:", data)
            }

        } catch (error) {
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    const handleUpdate = () => {
        const token = localStorage.getItem("token_company")

        fetch(import.meta.env.VITE_BACKEND_URL + `/private/company/${companyId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({ name, photo, email, cif, address })
        })
            .then(response => response.json())
            .then(() => {
                navigate("/companies/private")
            })
            .catch(err => {
                console.error(err)
                alert("Error updating company")
            })
    }

    if (loading) return <h2 className="text-center mt-5">Cargando...</h2>

    return (
        <div className="container-fluid py-5 px-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-lg border-0">

                        <div className="card-header text-white text-center py-4" style={{ backgroundColor: "#5C73F2" }}>
                            <h3 className="mb-0 fw-bold" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
                                Editar Company
                            </h3>
                        </div>

                        <div className="card-body">

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Company Name</label>
                                    <input
                                        type="text"
                                        className="form-control input-custom"
                                        value={name}
                                        onChange={e => setName(e.target.value)} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Email</label>
                                    <input
                                        type="email"
                                        className="form-control input-custom"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">CIF</label>
                                    <input
                                        type="text"
                                        className="form-control input-custom"
                                        value={cif}
                                        onChange={e => setCif(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Address</label>
                                    <input
                                        type="text"
                                        className="form-control input-custom"
                                        value={address}
                                        onChange={e => setAddress(e.target.value)} />
                                </div>
                            </div>

                            <div className="mt-3">
                                <label className="form-label fw-semibold">Photo</label>
                                <input type="file" className="form-control input-custom" onChange={handleUploadPhoto} />
                            </div>

                            {uploading && <p className="mt-2 text-center">Uploading image...</p>}

                            {photo && (
                                <div className="mt-3 text-center">
                                    <img src={photo}
                                        alt="Company"
                                        className="img-fluid rounded-3 shadow"
                                        style={{ width: "180px", height: "180px", objectFit: "cover" }}
                                    />
                                </div>
                            )}

                            <div className="card-footer bg-white border-0 py-3 mt-3">
                                <div className="px-4 pb-4 pt-2 d-flex gap-2">
                                    <button className="btn w-100 fw-bold py-2"
                                        style={{ backgroundColor: "#5C73F2", color: "#fff", borderRadius: 10 }}
                                        onClick={handleUpdate}>
                                        <i className="fa-solid fa-floppy-disk me-2"></i>Guardar
                                    </button>
                                    <button className="btn btn-outline-danger w-100 fw-bold py-2"
                                        style={{ borderRadius: 10 }}
                                        onClick={() => navigate("/companies/private")}>
                                        <i className="fa-solid fa-xmark me-2"></i>Cancelar
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