import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const ClientLocations = () => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLocations = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const token = store.tokenClient;
                const resp = await fetch(`${backendUrl}/location`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await resp.json();

                if (resp.ok) {
                    setLocations(data);
                }
            } catch (err) {
                console.error("Error loading locations", err);
            } finally {
                setLoading(false);
            }
        };
        loadLocations();
    }, [store.tokenClient]);

    if (loading) {
        return (
            <div className="text-center py-5 mt-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2">Loading our locations...</p>
            </div>
        );
    }

    return (
        <div className="container py-5 mt-3 mb-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold display-6 ">Our Locations</h2>
                <p className="text-muted lead">
                    Explore our high-security facilities and choose the one that best suits your needs.
                </p>
            </div>

            <div className="row row-cols-1 row-cols-md-3 g-4">
                {locations.map((loc, index) => (
                    <div key={loc.id || index} className="col">
                        <div className="location-card card h-100 ">
                            <div className="card-img-wrapper">
                                <img src={loc.photo || `https://images.unsplash.com/photo-1551313158-73d016a829ae?q=80&w=1137&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                                    alt={loc.city} />
                                <div className="location-tag position-absolute top-0 start-0 m-3 badge rounded-pill bg-dark py-2 px-3 shadow">
                                    <i className="fa fa-map-marker-alt me-1 text-primary"></i> {loc.city}
                                </div>
                            </div>

                            <div className="card-body p-4 d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-3">
                                        Available
                                    </span>
                                </div>

                                <div className="text-muted small mb-4 flex-grow-1">
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="bi bi-geo-alt me-2 text-primary"></i>
                                        <span>{loc.address || "Address not specified"}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-building me-2 text-primary"></i>
                                        <span>Managed by <span className="fw-bold text-dark">{loc.company_name}</span></span>
                                    </div>
                                </div>

                                <div className="mb-3 d-flex flex-wrap gap-2">
                                    <span className="badge bg-light text-dark border d-flex align-items-center py-2 px-3">
                                        <i className="fa fa-door-open me-2 text-primary"></i>
                                        {loc.occupied_storages} {loc.occupied_storages === 1 ? "Unit" : "Units"} Total
                                    </span>
                                    <span className="badge bg-light text-dark border d-flex align-items-center py-2 px-3">
                                        <i className="fa fa-shield-alt me-2 text-primary"></i>
                                        24/7 Secure
                                    </span>
                                </div>

                                <button
                                    className="btn btn-primary-custom w-100 rounded-pill fw-bold py-2 mt-3 shadow-sm hover-up"
                                    onClick={() => navigate(`/client/private/storage/${loc.id}`)}
                                >
                                    View Storage Units
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};