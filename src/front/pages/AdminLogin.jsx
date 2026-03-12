import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AdminLogin = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (store.admin_token) {
            const timer = setTimeout(() => {
                navigate("/admin/private");
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [store.admin_token, navigate]);

    const handleSubmit = async (a) => {
        a.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const resp = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/login/admin`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("admin_token", data.admin_token);
            localStorage.setItem("admin_id", data.admin_id);

            dispatch({
                type: "set_auth_admin",
                payload: {
                    token: data.admin_token,
                    admin: data.admin
                }
            });

            setTimeout(() => {
                navigate("/admin/private");
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="card border-0 shadow-lg p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}>

                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Welcome Back</h2>
                    <p className="text-muted small">Admin Control Panel</p>
                </div>

                <div className="text-center mb-2">
                    <div className={`badge ${store.admin_token ?
                        "bg-success-subtle text-success" : "bg-warning-subtle text-warning"} p-2`}>
                        {store.admin_token ? "● Online" : "● Offline - Please log in"}
                    </div>
                </div>

                {!store.admin_token ? (
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="small fw-bold text-uppercase text-muted mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control bg-light border-0"
                                    value={email}
                                    onChange={(a) => setEmail(a.target.value)}
                                    placeholder="admin@example.com"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="small fw-bold text-uppercase text-muted mb-1">Password</label>
                                <input
                                    type="password"
                                    className="form-control bg-light border-0"
                                    value={password}
                                    onChange={(a) => setPassword(a.target.value)}
                                    placeholder="Password"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="alert alert-danger border-0 small py-2">
                                    <i className="fas fa-exclamation-circle me-2"></i>{error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary w-100 fw-bold py-2 mt-2 shadow-sm"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="spinner-border text-success mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted">Redirecting to admin panel...</p>
                    </div>
                )}
            </div>
        </div>
    );
};