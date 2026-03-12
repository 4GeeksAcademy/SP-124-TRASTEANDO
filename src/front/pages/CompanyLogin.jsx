import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer";
import companyLoginImg from "../assets/img/Login-company.jpg";
import googleIcon from "../assets/img/googleIcon.png";
import facebookIcon from "../assets/img/facebookIcon.png"

export const CompanyLogin = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const { store, dispatch } = useGlobalReducer()
    const [showPassword, setShowPassword] = useState(false)

    function sendData(e) {
        e.preventDefault()

        const requestOptions = {
            method: "POST",
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(
                {
                    "email": email,
                    "password": password
                }
            )
        }
        fetch(import.meta.env.VITE_BACKEND_URL + '/login/company', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.company_token) {
                    localStorage.setItem("token_company", data.company_token)

                    dispatch({
                        type: "set_auth_company",
                        payload: true
                    })

                    navigate("/company/dashboard")

                } else {
                    alert("Bad email or password")
                }
            })
    }

    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className="container my-5" style={{ maxWidth: "1100px" }}>
                <div className="row shadow-lg mx-auto" style={{ borderRadius: "18px", overflow: "hidden", minHeight: "600px" }}>
                    <div className="col-md-6 d-none d-md-block p-0">
                        <img
                            src={companyLoginImg}
                            alt="Login"
                            className="img-fluid"
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>

                    <div className="col-md-6 bg-white p-5 d-flex flex-column justify-content-center">
                        <div className="d-flex flex-column justify-content-end">
                            <h2 className="text-black fw-bold">Welcome Back</h2>
                            <div className="mb-3">
                                <small className="text-secondary">New here? <span className="fw-bold" style={{ cursor: 'pointer', color: "#91BBF2" }} onClick={() => navigate("/createCompanies")}>Register here</span></small>
                            </div>
                        </div>


                        <h3 className="fw-bold mb-2 text-center" style={{ color: "#5C73F2" }}>Company Login</h3>

                        <form onSubmit={sendData}>
                            <div className="mb-3">
                                <label className="mb-2 text-secondary" htmlFor="email">Email address</label>
                                <input type="email" className="form-control" value={email} style={{ borderRadius: "10px", padding: "10px 14px" }} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required></input>
                            </div>

                            <div className="mb-3">
                                <label className="mb-2 text-secondary" htmlFor="password">Password</label>
                                <div className="position-relative">
                                    <input type={showPassword ? "text" : "password"} className="form-control text-black" id="password" value={password} style={{ borderRadius: "10px", padding: "10px 14px" }} onChange={(e) => setPassword(e.target.value)} placeholder="***********" required />
                                    <i
                                        className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                                        onClick={() => setPassword(!showPassword)}
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

                            <button type="submit" className="btn w-100 py-2 fw-bold mb-1 login-btn">
                                Login
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
                                    <img src={googleIcon} alt="Google" style={{ width: "40px" }} />
                                    <strong> Continue with Google</strong>
                                </button>

                                <button className="btn social-btn d-flex align-items-center justify-content-center gap-2 border">
                                    <img src={facebookIcon} alt="Facebook" style={{ width: "20px" }} />
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
        </div >
    )
}