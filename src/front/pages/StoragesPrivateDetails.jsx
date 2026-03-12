import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect, useState } from "react";
import { getStorageOverview } from "../utilsStorages";

export const StoragesPrivateDetails = () => {
    const { storageId } = useParams();
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [storage, setStorage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAvailable, setIsAvailable] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await getStorageOverview(storageId);
                setStorage(data);
                setIsAvailable(data.status === "available" && !data.occupied);
            } catch (error) {
                console.error("Error al cargar los detalles del trastero.", error);
            } finally {
                setLoading(false);
            }
        };
        if (storageId) fetchDetail();
    }, [storageId]);

    if (loading) return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <div className="spinner-border" style={{ color: "#5c73f2" }} role="status"></div>
            <p className="mt-3 fw-bold text-muted">Loading the perfect space...</p>
        </div>
    );

    if (!storage) return (
        <div className="container py-5 text-center min-vh-100 d-flex align-items-center justify-content-center">
            <h3>Couldn't find the storage you are looking for.</h3>
        </div>
    );

    const mainImage = storage.photo || "https://cdn.pixabay.com/photo/2017/02/22/15/55/storage-warehouse-2089775_1280.jpg";

    return (
        <div className="container py-4 pb-5" style={{ color: "#222222", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            <div className="mb-4">
                <button className="btn btn-link text-decoration-none p-0 mb-3 fw-bold" style={{ color: "#222222" }} onClick={() => navigate(-1)}>
                    <i className="bi bi-chevron-left me-1"></i> Back to search
                </button>
                <h1 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>
                    Private storage in {storage.city}
                </h1>
                <div className="d-flex align-items-center text-muted fw-semibold">
                    <span className="me-2">
                        <i className="bi bi-star-fill me-1" style={{ color: "#222222" }}></i>
                        New
                    </span>
                    <span className="mx-2 text-decoration-underline">
                        {storage.city}, Spain
                    </span>
                </div>
            </div>

            <div className="row g-2 mb-5" style={{ height: "400px", borderRadius: "15px", overflow: "hidden" }}>
                <div className="col-md-6 h-100">
                    <img src={mainImage} alt="Main storage image" className="w-100 h-100 object-fit-cover" />
                </div>
                <div className="col-md-6 h-100 d-none d-md-block">
                    <div className="row g-2 h-100">
                        <div className="col-6 h-50">
                            <img src="https://extrastorageinc.com/wp-content/uploads/2023/11/DALL%C2%B7E-2023-11-30-06.26.37-A-wide-angle-view-of-a-self-storage-unit-with-a-light-colored-interior-and-a-vibrant-red-rolling-door-designed-for-storing-seasonal-decorations-with.png"
                                alt="Detail 1" className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div className="col-6 h-50">
                            <img src="https://media.istockphoto.com/id/1803821352/photo/customer-opening-lock-of-unit.jpg?s=612x612&w=0&k=20&c=yY9vyEU0vMxh0RlKYNd4NK53OJ3jjYv6dgdWsBX5zZY="
                                alt="Detail 2" className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div className="col-6 h-50">
                            <img src="https://images.squarespace-cdn.com/content/v1/68adcb2d961c9a6c2b3a2ee5/5abb9731-7c39-45ad-9f0a-454f8c40c3c3/shutterstock_2390631077.jpg"
                                alt="Detail 3" className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div className="col-6 h-50">
                            <img src="https://media.istockphoto.com/id/1803815278/photo/cart-with-cardboard-boxes.jpg?s=612x612&w=0&k=20&c=zuQB9UgTQ7LuTDpvhfitfyhVJeJJP9YNMoMZbVIeDZY="
                                alt="Detail 4" className="w-100 h-100 object-fit-cover" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-between">
                <div className="col-lg-7 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom">
                        <div>
                            <h2 className="fw-bold fs-4 mb-1">Storage space managed by {storage.company_name}</h2>
                            <p className="text-muted mb-0"> {storage.size}m² total area • Private space • ID: #{storage.id} </p>
                        </div>
                    </div>

                    <div className="mb-4 pb-4 border-bottom">
                        <div className="d-flex mb-4">
                            <i className="bi bi-door-open fs-3 me-4" style={{ color: "#222222" }}></i>
                            <div>
                                <h5 className="fw-bold mb-1 fs-6">Self check-in</h5>
                                <p className="text-muted small mb-0">Access the storage unit easily with a security code.</p>
                            </div>
                        </div>
                        <div className="d-flex mb-4">
                            <i className="bi bi-shield-check fs-3 me-4" style={{ color: "#222222" }}></i>
                            <div>
                                <h5 className="fw-bold mb-1 fs-6">Guaranteed security</h5>
                                <p className="text-muted small mb-0">
                                    24/7 surveillance to keep your belongings always safe.
                                </p>
                            </div>
                        </div>
                        <div className="d-flex">
                            <i className="bi bi-geo-alt fs-3 me-4" style={{ color: "#222222" }}></i>
                            <div>
                                <h5 className="fw-bold mb-1 fs-6">Excellent location</h5>
                                <p className="text-muted small mb-0">
                                    Central area and easy vehicle access in {storage.city}.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 pb-4 border-bottom">
                        <h4 className="fw-bold mb-3 fs-5">About this space</h4>
                        <p className="text-muted" style={{ lineHeight: "1.6" }}>
                            This storage unit offers the perfect space to declutter your home or office.
                            Professionally managed by <strong>{storage.company_name}</strong>, the space is delivered completely clean, secured, and ready to use.
                            Whether you need to store boxes, furniture, or sports equipment, this <strong>{storage.size}m²</strong> space adapts to your needs.
                        </p>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="position-sticky" style={{ top: "20px" }}>
                        <div className="card border-0 shadow-lg p-4" style={{ borderRadius: "16px" }}>
                            <div className="d-flex justify-content-between align-items-end mb-4">
                                <div>
                                    <span className="fs-3 fw-bold">{storage.price}€</span>
                                    <span className="text-muted ms-1">/ month</span>
                                </div>
                                <div>
                                    {isAvailable ? (
                                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill">
                                            <i className="bi bi-check-circle-fill me-1"></i> Available
                                        </span>
                                    ) : (
                                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded-pill">
                                            <i className="bi bi-x-circle-fill me-1"></i> Occupied
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="border rounded-3 mb-3">
                                <div className="d-flex border-bottom">
                                    <div className="p-2 w-50 border-end">
                                        <small className="d-block fw-bold text-uppercase" style={{ fontSize: "0.65rem" }}>
                                            Planned start
                                        </small>
                                        <small className="text-muted">Immediate</small>
                                    </div>
                                    <div className="p-2 w-50">
                                        <small className="d-block fw-bold text-uppercase" style={{ fontSize: "0.65rem" }}>
                                            Duration
                                        </small>
                                        <small className="text-muted">Monthly</small>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <small className="d-block fw-bold text-uppercase" style={{ fontSize: "0.65rem" }}>
                                        Space size
                                    </small>
                                    <small className="text-muted">{storage.size}m²</small>
                                </div>
                            </div>

                            <button className={`btn w-100 py-3 fw-bold text-white fs-6 mb-3 ${!isAvailable ? "disabled" : ""}`}
                                style={{
                                    background: isAvailable ? "#f24171" : "#cccccc",
                                    borderRadius: "10px",
                                    transition: "all 0.2s",
                                }}
                                onClick={() => navigate(`/client/private/checkout/${storage.id}`)}>
                                {isAvailable ? "Book space" : "Not available"}
                            </button>

                            <div className="text-center text-muted small">
                                You won't be charged yet
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};