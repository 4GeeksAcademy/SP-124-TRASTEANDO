import { Link } from "react-router-dom";
import logo from "../assets/img/logo-trasteando.png";

export const Footer = () => {
  return (
    <footer className="bg-black text-white pt-4">

      <div className="container">
        {/* 🔹 Top row: Logo + 4 columns */}
        <div className="row g-4">

          {/* Logo + Slogan */}
          <div className="col-lg-3">
            <Link to="/" className="d-flex align-items-center text-decoration-none text-white my-2">
              <img src={logo} alt="Trasteando" height="70" className="me-2" />
              <h5 className="fw-bold fs-5" style={{ color: "#5C73F2" }}>
                Trasteando
              </h5>
            </Link>
            <p className="text-secondary">
              Smart storage for modern living
            </p>
            <p className="mb-2 text-secondary">
              <i className="fa-solid fa-phone me-2"></i>
              +34 600 000 000
            </p>
            <Link to="/chat" className="text-secondary text-decoration-none">
              <i className="fas fa-comments me-2"></i>
              Chat
            </Link>
          </div>


          {/* Page */}
          <div className="ms-auto col-lg-8">
            <div className="row g-4">
              <div className="col-md-3 col-6">
                <h5 className="text-white mb-2 mb-md-4 fw-bold">Page</h5>
                <ul className="list-unstyled small">
                  <li className="mb-2">
                    <Link to="/client/login" className="text-secondary text-decoration-none">Login Client</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/companies/login" className="text-secondary text-decoration-none">Login Company</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/client/private/locations" className="text-secondary text-decoration-none">Locations</Link>
                  </li>
                  <li>
                    <Link to="/client/private/storages/:locationId" className="text-secondary text-decoration-none">Storages</Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div className="col-md-3 col-6">
                <h5 className="text-white mb-2 mb-md-4 fw-bold">Legal</h5>
                <ul className="list-unstyled small">
                  <li className="mb-2">
                    <a href="#" className="text-secondary text-decoration-none">Terms & Conditions</a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-secondary text-decoration-none">Privacy Policy</a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-secondary text-decoration-none">Cookies Policy</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary text-decoration-none">Refund Policy</a>
                  </li>
                </ul>
              </div>                            

              {/* Social */}
              <div className="col-md-3 col-6">
                <h5 className="text-white mb-2 mb-md-4 fw-bold">Social</h5>
                <ul className="list-unstyled small">
                  <li className="mb-2">
                    <a href="#" className="text-secondary text-decoration-none"><i className="fa-brands fa-instagram me-2"></i>Instagram</a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-secondary text-decoration-none"><i className="fa-brands fa-facebook me-2"></i>Facebook</a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="text-secondary text-decoration-none"><i className="fa-brands fa-linkedin me-2"></i>LinkedIn</a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary text-decoration-none"><i className="fa-brands fa-twitter me-2"></i>X</a>
                  </li>
                </ul>
              </div>

              <div className="col-md-3 col-6">
                <h5 className="text-white mb-2 mb-md-4 fw-bold">Payment Methods</h5>
                <ul className="list-unstyled small text-secondary">
                  <li className="mb-2"><i className="fa-brands fa-cc-visa me-2"></i>Visa</li>
                  <li className="mb-2"><i className="fa-brands fa-cc-mastercard me-2"></i>Mastercard</li>
                  <li className="mb-2"><i className="fa-brands fa-paypal me-2"></i>PayPal</li>
                  <li><i className="fa-brands fa-cc-amex me-2"></i>AMEX</li>
                </ul>
              </div>
            </div>
          </div>
        </div>


        {/* 🔹 Divider */}
        <hr />

        {/* 🔹 Bottom */}
        <div className="d-lg-flex justify-content-between align-items-center py-3 text-center text-lg-start">
          <div className="text-secondary text-primary-hover">
            © {new Date().getFullYear()} Trasteando. All rights reserved.
          </div>

          <div className="nav mt-2 mt-lg-0 nav">
            <ul className="list-inline text-primary-hover mx-auto mb-0">
              <li className="list-inline-item me-4">
                <a href="#" className="text-secondary text-decoration-none">Privacy Policy</a>
              </li>
              <li className="list-inline-item me-4">
                <a href="#" className="text-secondary text-decoration-none">Terms and Conditions</a>
              </li>
              <li className="list-inline-item me-0">
                <a href="#" className="text-secondary text-decoration-none">Refund policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer >
  );
};