import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const ClientPrivate = () => {
    const { store, dispatch } = useGlobalReducer();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("tokenClient");
        localStorage.removeItem("client_id");
        dispatch({ type: "logout_client" });
        navigate("/client/login");
    };

    useEffect(() => {
        const token = localStorage.getItem("tokenClient");

        if (!token) {
            navigate("/client/login");
            return;
        }

        const loadClient = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const resp = await fetch(`${backendUrl}/private/client`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await resp.json();

                if (!resp.ok) {
                    localStorage.removeItem("tokenClient");
                    localStorage.removeItem("client_id");
                    dispatch({ type: "logout_client" });
                    navigate("/client/login");
                    return;
                }
                setClient(data);
            } catch (err) {
                setError("Error de conexión con el servidor");
            } finally {
                setLoading(false);
            }
        };
        loadClient();
    }, [store.tokenClient, dispatch, navigate]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
    if (!client) return null;

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4 rounded-4">
                        <div className="card-body text-center p-4">
                            <div className="position-relative d-inline-block mb-3">
                                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm"
                                    style={{ width: "120px", height: "120px", border: "4px solid white", overflow: "hidden" }}>



                                    {client.photo_url ? (
                                        <img
                                            src={client.photo_url}
                                            alt="Profile"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (


                                        <span className="fs-1 fw-bold text-primary">
                                            {client.email.charAt(0).toUpperCase()}
                                        </span>

                                    )}



                                </div>
                            </div>
                            <h4 className="fw-bold mb-1">Mi Profile</h4>
                            <p className="text-muted small mb-3">{client.email}</p>
                            <button className="btn btn-sm px-4 rounded-pill mb-2 w-100" style={{ backgroundColor: "rgb(92, 115, 242)", border: "none", color: "white" }}
                                onClick={() => navigate(`/clients/${client.id}/edit`)} >Edit Profile</button>
                            <button className="btn btn-outline-danger btn-sm px-4 rounded-pill w-100" onClick={handleLogout}>
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold">Account Information</h5>
                        </div>
                        <div className="card-body p-4 pt-0">
                            <div className="row mb-4">
                                <div className="col-sm-4 text-muted">Client ID</div>
                                <div className="col-sm-8 fw-medium">#{client.id}</div>
                            </div>
                            <hr className="text-light" />
                            <div className="row mb-4">
                                <div className="col-sm-4 text-muted">Email Address</div>
                                <div className="col-sm-8 fw-medium">{client.email}</div>
                            </div>
                            <hr className="text-light" />
                            <div className="row mb-4">
                                <div className="col-sm-4 text-muted">Account Status</div>
                                <div className="col-sm-8">
                                    <span className={`badge ${client.is_active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} px-3`}>
                                        {client.is_active ? 'Activa' : 'Inactiva'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};