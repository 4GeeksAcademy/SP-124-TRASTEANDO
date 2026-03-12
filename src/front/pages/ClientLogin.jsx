import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import clientLoginImg from "../assets/img/Login-client.png";
import googleIcon from "../assets/img/googleIcon.png";
import facebookIcon from "../assets/img/facebookIcon.png"


export const ClientLogin = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (store.tokenClient) {
            const timer = setTimeout(() => {
                navigate("/client/private");
            }, 1500);
            return () => clearTimeout(timer)
        }
    }, [store.tokenClient, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const resp = await fetch(`${backendUrl}/login/client`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await resp.json();

            if (!resp.ok) {
                setError(data.message || data.msg || "Login failed");
                return;
            }

            localStorage.setItem("tokenClient", data.token);
            localStorage.setItem("client_id", data.client_id)

            dispatch({
                type: "set_auth_client",
                payload: { tokenClient: data.token },
            });

            setTimeout(() => navigate("/search"), 1000);

        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className="container my-5" style={{ maxWidth: "1100px" }}>
                <div className="row shadow-lg mx-auto" style={{ borderRadius: "18px", overflow: "hidden" }}>
                    <div className="col-md-6 d-none d-md-block" style={{
                        backgroundImage: `url(${clientLoginImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}>
                    </div>

                    <div className="col-md-6 bg-white p-5 d-flex flex-column justify-content-center">
                        <div className="h-100 w-100 d-flex flex-column justify-content-end">
                            <h2 className="text-black fw-bold">Welcome Back</h2>
                            <div className="mb-3">
                                <small className="text-secondary">New here? <span className="fw-bold" style={{ cursor: 'pointer', color: "#91BBF2" }} onClick={() => navigate("/client/signup")}>Register here</span></small>
                            </div>
                        </div>

                        <h3 className="fw-bold mb-2 text-center" style={{ color: "#5C73F2" }}>Client Login</h3>
                        {error && (
                            <div className="alert alert-danger d-flex align-items-center p-2 mb-3" style={{ fontSize: '0.85rem' }}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                <div>{error}</div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="mb-2 text-secondary" htmlFor="email">Email address</label>
                                <input type="email" className="form-control" id="email" style={{ borderRadius: "10px", padding: "10px 14px" }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" disabled={loading} required />
                            </div>
                            <div className="mb-3">
                                <label className="mb-2 text-secondary" htmlFor="password">Password</label>
                                <div className="position-relative">
                                    <input type={showPassword ? "text" : "password"} className="form-control text-black" id="password" style={{ borderRadius: "10px", padding: "10px 14px" }} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="***********" disabled={loading} required />
                                    <i
                                        className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            right: "15px",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            color: "#91BBF2"
                                        }}
                                    ></i>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <div className="form-check m-0">
                                        <input className="form-check-input" type="checkbox" id="remember" />
                                        <label className="form-check-label text-secondary ms-1" htmlFor="remember">
                                            Remember me?
                                        </label>
                                    </div>
                                    <Link to="#"
                                        className="text-decoration-none"
                                        style={{ color: "#91BBF2" }}>Forgot your password?</Link>
                                </div>
                            </div>

                            <button type="submit" className="btn w-100 py-2 fw-bold mb-1 login-btn" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Logging in...
                                    </>
                                ) : ("Login"

                                )}
                            </button>

                            {/* <div className="d-flex align-items-center my-4">
                                <div className="flex-grow-1" style={{ height: "1px", backgroundColor: "#e0e0e0" }}></div>

                                <span
                                    className="mx-2 text-secondary"
                                    style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                                    Or sign in with
                                </span>

                                <div className="flex-grow-1" style={{ height: "1px", backgroundColor: "#e0e0e0" }}></div>
                            </div>

                            <div className="d-flex flex-column gap-2">
                                <button className="btn social-btn d-flex align-items-center justify-content-center border">
                                    <img src={googleIcon} alt="Google" style={{ width: "40px" }}/>
                                    <strong> Continue with Google</strong>
                                </button>

                                <button className="btn social-btn d-flex align-items-center justify-content-center gap-2 border">
                                    <img src={facebookIcon} alt="Facebook" style={{ width: "20px" }}/>
                                    <strong> Continue with Facebook</strong>
                                </button>
                            </div> */}
                            <div className="d-flex flex-column flex-md-row justify-content-center text-muted mt-3">
                                <div>
                                    © {new Date().getFullYear()} Trasteando. All rights reserved.
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}