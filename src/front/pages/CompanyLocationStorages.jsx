import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const CompanyLocationStorages = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [storages, setStorages] = useState([])
    const [loading, setLoading] = useState(true)
    const [location, setLocation] = useState("")

    useEffect(() => {
        const token =
            localStorage.getItem("token_company") ||
            localStorage.getItem("admin_token");

        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/location/${id}/storages`, {
            headers: {
                "Authorization": "Bearer " + token,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Error fetching storages")
                return res.json()
            })
            .then(async (storagesData) => {

                try {

                    const leasesRes = await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/private/company/leases-filtered`,
                        {
                            headers: {
                                "Authorization": "Bearer " + token,
                            },
                        }
                    )

                    console.log("LEASES STATUS:", leasesRes.status)

                    if (!leasesRes.ok) {
                        const text = await leasesRes.text()
                        console.log("LEASES RESPONSE:", text)
                        throw new Error("Leases fetch failed")
                    }

                    const leasesData = await leasesRes.json()

                    // Unimos current + future (los activos y reservados)
                    const allLeases = [
                        ...(leasesData.current || []),
                        ...(leasesData.future || [])
                    ]

                    const leasesByStorage = {}

                    allLeases.forEach(lease => {
                        if (!leasesByStorage[lease.storage_id]) {
                            leasesByStorage[lease.storage_id] = []
                        }
                        leasesByStorage[lease.storage_id].push(lease)
                    })

                    const storagesWithLeases = storagesData.map(storage => ({
                        ...storage,
                        leases: leasesByStorage[storage.id] || []
                    }))

                    setStorages(storagesWithLeases)

                } catch (error) {

                    console.warn("Leases could not be loaded. Showing storages only.")
                    setStorages(storagesData)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })

        fetch(`${import.meta.env.VITE_BACKEND_URL}/location/${id}`, {
            headers: { Authorization: "Bearer " + token }
        })
            .then(res => {
                if (!res.ok) throw new Error("Error fetching location")
                return res.json()
            })
            .then(data => setLocation(data))
            .catch(err => console.error(err))

    }, [id])

    const handleDelete = (storageId) => {
        const token = localStorage.getItem("token_company")
        if (!token) return

        if (!window.confirm("Are you sure you want to delete this storage?")) return

        fetch(`${import.meta.env.VITE_BACKEND_URL}/private/company/storages/${storageId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(response => {
                if (!response.ok) throw new Error("Delete failed")
                setStorages(prev =>
                    prev.filter(storage => storage.id !== storageId)
                )
            })
    }

    if (loading) return <h2>Loading storages...</h2>

    if (storages.length === 0) {
        return (
            <div className="container py-5 px-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-5">
                        <div className="card shadow-lg border-0">
                            <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
                                <h3 className="mb-0">No Storages Found</h3>
                            </div>
                            <div className="card-body py-4">
                                <div className="d-flex flex-column align-items-center gap-3">
                                    <button
                                        className="btn btn-secondary-custom shadow"
                                        onClick={() => navigate("/companies/private/storages/create")}
                                    >
                                        Create Storage
                                    </button>
                                    <button
                                        className="btn btn-secondary-custom shadow"
                                        onClick={() => navigate("/companies/private/locations")}
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid py-5 px-5">
            <div className="row mb-5">
                <div className="col-12 col-xl-12 mx-auto">
                    <div className="card shadow-lg border-0">

                        <div className="card-header header-primary text-info-emphasis text-center py-4">
                            <h4 className="mb-0 fw-bold" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
                                Storages in {location?.address}
                            </h4>
                        </div>

                        <div className="card-body bg-light">
                            <div className="row g-3">

                                {storages.map(storage => {

                                    const today = new Date()

                                    const hasActiveLease = storage.leases?.some(lease => {
                                        const start = new Date(lease.start_date)
                                        const end = new Date(lease.end_date)
                                        return today >= start && today <= end
                                    })

                                    const statusClass = hasActiveLease ? "text-danger" : "text-success"
                                    const occupancyLabel = hasActiveLease ? "Occupied" : "Available"

                                    return (
                                        <div key={storage.id} className="col-12 col-md-6 col-lg-3">
                                            <div className="card shadow-sm h-100">

                                                {storage.photo ? (
                                                    <img
                                                        src={storage.photo}
                                                        className="card-img-top"
                                                        alt="Storage"
                                                        style={{
                                                            aspectRatio: "16/9",
                                                            width: "100%",
                                                            objectFit: "cover"
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="d-flex align-items-center justify-content-center bg-light text-muted fw-bold"
                                                        style={{
                                                            aspectRatio: "16/9",
                                                            width: "100%"
                                                        }}
                                                    >
                                                        No image
                                                    </div>
                                                )}

                                                <div className="card-body">
                                                    <h5 className="fw-bold">
                                                        Size: {storage.size}
                                                    </h5>

                                                    <p className="mb-1">
                                                        <strong>Price:</strong> {storage.price}
                                                    </p>

                                                    <p className={`mb-2 fw-bold ${statusClass}`}>
                                                        <strong>Status:</strong> {occupancyLabel}
                                                    </p>

                                                    {storage.leases && storage.leases.length > 0 && (
                                                        <div className="mt-2">
                                                            <h6>Reservations:</h6>
                                                            <ul className="list-unstyled mb-0">
                                                                {storage.leases.map(l => (
                                                                    <li key={l.id}>
                                                                        {l.client_email} ({l.start_date} - {l.end_date})
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    <div className="d-flex justify-content-end gap-1 mt-2">
                                                        <button
                                                            className="btn btn-outline-secondary-custom shadow"
                                                            onClick={() => navigate(`/companies/private/storages/${storage.id}`)}
                                                        >
                                                            <i className="fa-regular fa-eye"></i>
                                                        </button>

                                                        <button
                                                            className="btn btn-outline-secondary-custom shadow"
                                                            onClick={() => navigate(`/companies/private/storages/edit/${storage.id}`)}
                                                        >
                                                            <i className="fa-solid fa-pencil"></i>
                                                        </button>

                                                        <button
                                                            className="btn btn-md btn-outline-danger"
                                                            onClick={() => handleDelete(storage.id)}
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })}

                                <div className="card-footer bg-white border-0 py-3">
                                    <div className="d-flex flex-column align-items-center gap-3">
                                        <button
                                            className="btn btn-secondary-custom shadow"
                                            onClick={() => navigate("/companies/private/storages/create")}
                                        >
                                            Create Storage
                                        </button>
                                        <button
                                            className="btn btn-secondary-custom shadow"
                                            onClick={() => navigate("/companies/private/locations")}
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}