import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const CompanyPrivate = () => {

    const [company, setCompany] = useState(null)
    const [photo, setPhoto] = useState("")
    const navigate = useNavigate()
    const { dispatch } = useGlobalReducer()

    function handleLogout() {
        localStorage.removeItem("token_company")
        dispatch({ type: 'set_auth_company', payload: false })
        navigate("/")
    }

    useEffect(() => {
        const token = localStorage.getItem("token_company")
        if (!token) { navigate("/companies/login"); return }

        fetch(import.meta.env.VITE_BACKEND_URL + "/private/company", {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }
        })
            .then(response => {
                if (response.status !== 200) navigate("/companies/login")
                return response.json()
            })
            .then(data => { setCompany(data); setPhoto(data.photo || "") })
    }, [])

    if (!company) return <h2 className="text-center mt-5">Cargando...</h2>

    return (
        <div>
            <div className="card border-0 shadow-sm" style={{ borderRadius: 20, overflow: "hidden", maxWidth: 580, margin: "0 auto" }}>

                {/* CABECERA */}
                <div className="p-4 text-center text-white position-relative" style={{ backgroundColor: "#5C73F2" }}>
                    <h4 className="mb-0 fw-bold">Bienvenido, {company.name}</h4>
                    <button
                        className="btn btn-light btn-sm position-absolute"
                        style={{ top: 16, right: 16, borderRadius: "50%", width: 34, height: 34, padding: 0 }}
                        onClick={() => navigate("/companies/private/edit")}
                    >
                        <i className="fa-solid fa-pencil"></i>
                    </button>
                </div>

                {/* FOTO */}
                <div className="text-center pt-4 pb-2">
                    {photo ? (
                        <img src={photo} alt="Company" className="rounded-3 shadow-sm"
                            style={{ width: 140, height: 140, objectFit: "cover", border: "4px solid #f0f2ff" }} />
                    ) : (
                        <div className="rounded-circle d-inline-flex align-items-center justify-content-center bg-light text-muted shadow-sm"
                            style={{ width: 140, height: 140, fontSize: 14 }}>
                            Sin imagen
                        </div>
                    )}
                </div>

                {/* INFO */}
                <div className="card-body px-4 pb-2">
                    {[
                        { icon: "fa-envelope", label: "Email", value: company.email },
                        { icon: "fa-id-card", label: "CIF", value: company.cif },
                        { icon: "fa-location-dot", label: "Dirección", value: company.address },
                    ].map(({ icon, label, value }) => (
                        <div key={label} className="d-flex align-items-center gap-3 p-3 mb-2 rounded-3" style={{ backgroundColor: "#f8f9ff" }}>
                            <div className="d-flex align-items-center justify-content-center rounded-circle text-white"
                                style={{ width: 38, height: 38, backgroundColor: "#5C73F2", flexShrink: 0 }}>
                                <i className={`fa-solid ${icon}`}></i>
                            </div>
                            <div>
                                <small className="text-muted d-block">{label}</small>
                                <span className="fw-semibold">{value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* BOTONES */}
                <div className="px-4 pb-4 pt-2 d-flex gap-2">
                    <button className="btn w-100 fw-bold py-2"
                        style={{ backgroundColor: "#5C73F2", color: "#fff", borderRadius: 10 }}
                        onClick={() => navigate("/companies/private/locations")}>
                        <i className="fa-solid fa-location-dot me-2"></i>Mis Ubicaciones
                    </button>
                    <button className="btn btn-outline-danger w-100 fw-bold py-2"
                        style={{ borderRadius: 10 }}
                        onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket me-2"></i>Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    )
}