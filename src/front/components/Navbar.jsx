import { Link, useNavigate } from "react-router-dom";
import { getUserRole } from "../store";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logo from "../assets/img/logo-trasteando.png";

export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer();
	const role = getUserRole(store);


	const navigate = useNavigate()

	const handleLogout = () => {
		localStorage.clear();
		dispatch({ type: "LOGOUT" });
		navigate("/");
	};

	return (
		<header className="navbar-light header-sticky">
			<nav className="navbar navbar-expand-xl navbar-light">
				<div className="container px-2">

					<Link to="/" className="navbar-brand">
						<img src={logo} alt="logo" height="70" className="navbar-brand-item" />
						<span className="fw-bold fs-5 me-3" style={{ color: "#5C73F2" }}>
							Trasteando
						</span>
					</Link>

					{!role && (
						<>
							<div className="d-flex w-100 justify-content-between align-items-center">
								<div className="d-flex align-items-center gap-4">

									<div className="nav-item dropdown">
										<a className="nav-link dropdown-toggle fw-bold"
											role="button"
											data-bs-toggle="dropdown">
											<i className="fa-regular fa-circle-user me-2 nav-icon"></i>
											Login
										</a>

										<ul className="dropdown-menu shadow border-0 rounded-3">
											<li>
												<Link className="dropdown-item d-flex gap-2 align-items-center" to="/client/login">
													<i className="fa-regular fa-user nav-icon" style={{ color: "#5C73F2" }}></i>
													Client
												</Link>
											</li>
											<li>
												<Link className="dropdown-item d-flex  gap-2 align-items-center" to="/companies/login">
													<i className="fa-regular fa-building nav-icon" style={{ color: "#5C73F2" }}></i>
													Company
												</Link>
											</li>
										</ul>
									</div>

									<li className="nav-item dropdown">
										<a className="nav-link dropdown-toggle fw-bold"
											role="button"
											data-bs-toggle="dropdown">
											<i className="fa-solid fa-house me-2 nav-icon"></i>
											Services
										</a>

										<ul className="dropdown-menu shadow border-0 rounded-3">
											<li>
												<Link className="dropdown-item d-flex gap-2 align-items-center" to="/client/private/locations">
													<i className="fa-regular fa-map nav-icon" style={{ color: "#5C73F2" }}></i>
													Locations
												</Link>
											</li>
											<li>
												<Link className="dropdown-item d-flex gap-2 align-items-center" to="/search">
													<i className="fas fa-box-open nav-icon" style={{ color: "#5C73F2" }}></i>
													Storages
												</Link>
											</li>
										</ul>
									</li>
								</div>
							</div>

							<div className="navbar-right d-flex align-items-center gap-2">

								<Link to="/aboutUs" className="nav-link fw-bold nav-main-link">
									<i className="fa-solid fa-users nav-icon"></i>
									About us
								</Link>

								<Link to="/features" className="nav-link fw-bold nav-main-link">
									<i className="fa-solid fa-magnifying-glass nav-icon"></i>
									Features
								</Link>

								<div className="nav-link fw-bold nav-main-link dropdown">
									<a className="nav-link dropdown-toggle fw-bold"
										role="button"
										data-bs-toggle="dropdown">
										<i className="fa-solid fa-paper-plane nav-icon"></i> Contact
									</a>
									<ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2">
										<li className="dropdown-item">
											<i className="fa-solid fa-phone nav-icon" style={{ color: "#5C73F2" }}></i> +34 600 000 000
										</li>
										<Link to="/chat" className="dropdown-item d-flex justify-content-center align-items-center">
											<i className="fas fa-comments me-2 nav-icon" style={{ color: "#5C73F2" }}></i>
											Chat
										</Link>
									</ul>
								</div>
								<Link to="/chat" className="nav-pill active-pill">
									Become a host
								</Link>
							</div>
						</>
					)}

					{/* ==== Solo Admin ==== */}

					{role === "admin" && (
						<>
							<ul className="navbar-nav ms-auto align-items-center">

								<li className="nav-item ms-2">
									<Link to="/clients-info" className="nav-link">
										<i className="fa-solid fa-user me-2 nav-icon"></i>
										Clients
									</Link>
								</li>

								<li className="nav-item ms-2">
									<Link to="/companies" className="nav-link">
										<i className="fa-regular fa-building me-2 nav-icon"></i>
										Companies
									</Link>
								</li>

								<li className="nav-item ms-2">
									<Link to="/admin-users" className="nav-link">
										<i class="fa-solid fa-user-tie me-2 nav-icon"></i>
										Admins
									</Link>
								</li>

								<li className="nav-item ms-2">
									<Link to="/location" className="nav-link">
										<i className="fa-regular fa-map me-2 nav-icon"></i>
										Locations
									</Link>
								</li>

								<li className="nav-item ms-2 me-2">
									<Link to="/admin/dashboard" className="nav-link" >
										<i className="fa-solid fa-user me-2 nav-icon"></i>
										My Profile
									</Link>
								</li>
							</ul>
						</>
					)}

					{/* ==== Solo Company ==== */}

					{role === "company" && (
						<>
							<li className="nav-item ms-auto company-link me-2">
								<Link to="/company/dashboard" className="nav-link">
									<i className="fa-solid fa-building-lock me-2 nav-icon"></i>
									Company Private
								</Link>
							</li>
						</>
					)}

					{/*{/* ==== Solo CLient ==== */}

					{role === "client" && (
						<>
							<ul className="navbar-nav ms-auto align-items-center">

								<li className="nav-item ms-2">
									<Link to="/client/private/leases" className="nav-link">
										<i className="fa-solid fa-file-contract me-2 nav-icon"></i>
										My leases
									</Link>
								</li>

								<li className="nav-item ms-2">
									<Link to="/search" className="nav-link">
										<i className="fa-solid fa-box-open me-2 nav-icon"></i>
										Find storages
									</Link>
								</li>

								<li className="nav-item ms-2">
									<Link to="/client/private/locations" className="nav-link">
										<i className="fa-solid fa-warehouse me-2 nav-icon"></i>
										Locations available
									</Link>
								</li>

								<li className="nav-item ms-2">
									<Link to="/client/dashboard" className="nav-link">
										<i className="fa-solid fa-user me-2 nav-icon"></i>
										My Profile
									</Link>
								</li>

								<li className="nav-item ms-2">
									<Link to="/inventariator" className="nav-link">
										<i className="fa-solid fa-cart-flatbed me-2 nav-icon"></i>
										My Inventory
									</Link>
								</li>
							</ul>
						</>
					)}

					{/* ==== Logout si hay alguien logueado ==== */}
					{role && (
						<li className="nav-item ms-2">
							<button
								className="nav-link btn btn-link logout-link"
								type="button"
								onClick={handleLogout}>
								<i className="fa-solid fa-arrow-right-from-bracket me-2 nav-icon"></i>
								Logout
							</button>
						</li>
					)}
				</div>
			</nav>
		</header>
	);
};