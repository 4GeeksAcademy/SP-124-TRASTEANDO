import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { deleteClientLease } from "../utilsLeases";
import { getStorageOverview } from "../utilsStorages";
import { useNavigate } from "react-router-dom";

export const ClientPrivateLeases = () => {
    const { store } = useGlobalReducer();
    const [myLeases, setMyLeases] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchLeases = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const resp = await fetch(`${backendUrl}/client/my-leases`, {
                headers: {
                    Authorization: `Bearer ${store.tokenClient}`,
                    "Content-Type": "application/json"
                }
            });

            if (resp.ok) {
                const leasesData = await resp.json();
                const fullLeases = await Promise.all(
                    leasesData.map(async (lease) => {
                        try {
                            const storageDetail = await getStorageOverview(lease.storage_id);                            
                            return { ...lease, storage: storageDetail };
                        } catch (err) {
                            console.error(`Error cargando detalle para storage ${lease.storage_id}`, err);
                            return lease;
                        }
                    })
                );

                setMyLeases(fullLeases);
            }
        } catch (error) {
            console.error("Error al obtener mis contratos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelLease = async (leaseId) => {
        if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

        try {
            await deleteClientLease(leaseId, store.tokenClient);
            alert("Reservation cancelled successfully");
            fetchLeases();
        } catch (error) {
            console.error(error);
            alert("Error cancelling the reservation");
        }
    };

    useEffect(() => {
        if (store.tokenClient) fetchLeases();
    }, [store.tokenClient]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 py-5" style={{ background: "#ffffff" }}>
                <div className="spinner-border" style={{ color: "#5c73f2" }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <span className="ms-3 fw-bold" style={{ color: "#111111" }}>
                    Loading your rentals...
                </span>
            </div>
        );
    }
    console.log(myLeases);

    return (
        <div className="container-fluid min-vh-100 py-5" style={{ background: "#ffffff" }}>
            <div className="container">
                <div className="mb-5 text-center">
                    <h2 className="fw-bold display-6" style={{ color: "#111111", letterSpacing: "-0.5px" }}>
                        My Rented Storages
                    </h2>
                    <p className="text-muted" style={{ lineHeight: "1.6" }}>
                        Manage your active contracts and review your rental history.
                    </p>
                </div>

                <div className="row g-4">
                    {myLeases.length > 0 ? (
                        myLeases.map((lease) => (
                            <div key={lease.id} className="col-md-6 col-lg-4">
                                <div className="card shadow-sm border-0 h-100 bg-white" style={{ borderRadius: "20px", overflow: "hidden" }}>
                                    <div style={{ height: "180px", position: "relative" }}>
                                        <img
                                            src={lease.storage.photo || "https://cdn.pixabay.com/photo/2017/02/22/15/55/storage-warehouse-2089775_1280.jpg"}
                                            alt="Storage"
                                            className="w-100 h-100"
                                            style={{ objectFit: "cover" }}
                                        />
                                        <div className="position-absolute top-0 end-0 m-3">
                                            <span className="badge bg-white text-dark shadow-sm rounded-pill px-3 py-2 fw-bold">
                                                {lease.storage.size} m²
                                            </span>
                                        </div>
                                    </div>

                                    <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                                        <span className="badge rounded-pill px-3 py-2" style={{ background: "#91bbf2", color: "#111111" }}>
                                            Contract #{lease.id}
                                        </span>
                                       
                                    </div>

                                    <div className="card-body p-4">
                                        <div className="mb-3">
                                            <h5 className="fw-bold mb-1" style={{ color: "#111111" }}>{lease.storage.company_name}</h5>
                                            <p className="text-muted small mb-0">
                                                <i className="fa fa-map-marker-alt me-2" style={{ color: "#5c73f2" }}></i>
                                                {lease.storage.city}
                                            </p>
                                        </div>
                                        <div className="row text-center bg-light rounded-4 py-3 g-0 mb-4" style={{ borderRadius: "15px" }}>
                                            <div className="col-6 border-end">
                                                <small className="text-muted d-block">Start Date</small>
                                                <span className="fw-bold" style={{ color: "#111111" }}>{lease.start_date}</span>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted d-block">End Date</small>
                                                <span className="fw-bold" style={{ color: "#111111" }}>{lease.end_date}</span>
                                            </div>
                                        </div>

                                        {/* Precio y Acción */}
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <div>
                                                <small className="text-muted d-block">Monthly Price</small>
                                                <span className="fw-bold h5 mb-0" style={{ color: "#5c73f2" }}>{lease.storage.price}€</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger rounded-pill fw-bold px-4"
                                                style={{ borderColor: "#f24171", color: "#f24171" }}
                                                onClick={() => handleCancelLease(lease.id)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5 border rounded-5 bg-light" style={{ borderStyle: "dashed", borderColor: "#91bbf2", borderRadius: "25px" }}>
                            <div className="mb-4" style={{ color: "#f24171", fontSize: "4rem" }}>
                                <i className="fa fa-box-open"></i>
                            </div>
                            <h4 className="fw-bold" style={{ color: "#111111" }}>No storages rented yet.</h4>
                            <p className="text-muted mb-4" style={{ lineHeight: "1.6" }}>Explore our map to find the perfect space for you.</p>
                            <button className="btn rounded-pill px-5 py-3 fw-bold shadow-sm" style={{ background: "#5c73f2", color: "#ffffff", border: "none" }} onClick={() => navigate("/search/map")}>
                                Find Storage Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};