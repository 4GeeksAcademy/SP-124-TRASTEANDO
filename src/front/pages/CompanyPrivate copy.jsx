import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const CompanyPrivate = () => {

    const [company, setCompany] = useState(null)
    const [photo, setPhoto] = useState("")

    const navigate = useNavigate()
    const { dispatch } = useGlobalReducer()

    function handleLogout() {
        localStorage.removeItem("token_company")

        dispatch({
            type: 'set_auth_company',
            payload: false
        })
        navigate("/")
    }

    useEffect(() => {
        const token = localStorage.getItem("token_company")

        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "/private/company", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    navigate("/companies/login")
                }
                return response.json()
            })
            .then(data => {
                setCompany(data)
                setPhoto(data.photo || "")
            })

    }, [])

    if (!company) {
        return <h2 className="text-center mt-5">Cargando...</h2>
    }

    return (
        <div className="container-fluid py-5 px-5">
            <div className="row justify-content-center mb-5">
                <div className="col-12 col-md-8 col-lg-4">
                    <div className="card shadow-lg border-0">

                        <div className="card-header header-primary text-info-emphasis text-center py-4 position-relative">
                            <h3 className="mb-0 fw-bold" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
                                Welcome {company.name}
                            </h3>

                            <button
                                className="btn btn-edit-header shadow position-absolute top-50 end-0 translate-middle-y me-3"
                                onClick={() => navigate("/companies/private/edit")}
                            >
                                <i className="fa-solid fa-pencil"></i>
                            </button>

                        </div>

                        <div className="card-body text-center">

                            {photo ? (
                                <img
                                    src={photo}
                                    alt="Company"
                                    className="mb-5 shadow-sm company-photo"
                                />
                            ) : (
                                <div
                                    className="rounded-circle mb-4 shadow-sm d-flex align-items-center justify-content-center bg-light text-muted"
                                    style={{ width: "150px", height: "150px" }}
                                >
                                    No image
                                </div>
                            )}

                            <div className="text-start px-3">
                                <div className="info-block">
                                    <div className="info-icon-wrapper">
                                        <i className="fa-solid fa-envelope info-icon"></i>
                                    </div>
                                    <div>
                                        <strong>Email:</strong><br />
                                        <span className="text-muted">{company.email}</span>
                                    </div>
                                </div>


                                <div className="info-block">
                                    <div className="info-icon-wrapper">
                                        <i className="fa-solid fa-id-card info-icon"></i>
                                    </div>
                                    <div>
                                        <strong>CIF:</strong><br />
                                        <span className="text-muted">{company.cif}</span>
                                    </div>
                                </div>

                                <div className="info-block">
                                    <div className="info-icon-wrapper">
                                        <i className="fa-solid fa-location-dot info-icon"></i>
                                    </div>
                                    <div>
                                        <strong>Address:</strong><br />
                                        <span className="text-muted">{company.address}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer bg-white border-0 py-3">
                                <div className="d-flex flex-column align-items-center gap-3">
                                    <button className="btn btn-secondary-custom shadow"
                                        onClick={() => navigate("/companies/private/locations")}>
                                        My Locations
                                    </button>
                                    <button className="btn btn-secondary-custom shadow"
                                        onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}