import { useEffect } from "react"
import what from "../assets/img/what-is.jpg";
import client from "../assets/img/client-img.png";
import company from "../assets/img/company-img.jpg"
import flask from "../assets/img/flask-logo.jpg";
import sqla from "../assets/img/sql-logo.png";
import security from "../assets/img/security.png"
import reactlogo from "../assets/img/react-logo.webp";
import reactrouterlogo from "../assets/img/react-router.png";
import bootstrap from "../assets/img/bootstrap.webp";

export const Features = () => {

  useEffect(() => {
    const sections = document.querySelectorAll(".fade-section");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container-fluid p-0 features-bg">

      {/* ================= HERO ================= */}
      <div className="container text-center text-black py-5 fade-section hero" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <h1 className="display-3 fw-bold hero-title mb-3" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
          Building Trasteando
        </h1>
        <p className="lead mx-auto hero-subtitle">
          A full-stack storage marketplace engineered with scalable architecture,
          secure authentication, real-time systems and geolocation intelligence.
        </p>
      </div>

      <div className="section-divider fade-section"></div>

      {/* ================= TECHNOLOGIES ================= */}
      <div className="mx-auto hero-text-box fade-section" style={{ maxWidth: "850px" }}>
        <h2 className="text-center mb-3">Technologies & Tools Implemented</h2>
        <p className="mx-auto mb-4 text-center">
          To bring this platform to life, we implemented a modern full-stack architecture
          combining frontend, backend, database modeling, authentication systems,
          payment processing, real-time communication and interactive mapping.
        </p>

        <div className="tech-stack">
          <span><i className="fa-brands fa-react me-1"></i> React</span>
          <span>🐍 Flask</span>
          <span>🗄 SQLAlchemy</span>
          <span>🔐 JWT</span>
          <span>💳 Stripe</span>
          <span>⚡ Socket.IO</span>
          <span>📍 Google Maps</span>
          <span>🤖 OpenAI</span>
        </div>
      </div>

      <div className="section-divider fade-section"></div>

      {/* ================= WHAT IS TRASTEANDO ================= */}
      <div className="container py-5 text-black fade-section">
        <div className="row align-items-center gy-5">

          <div className="col-lg-5">
            <div className="primary-image">
              <img
                src={what}
                alt="What is"
                className="img-fluid main-img" />
            </div>
          </div>

          <div className="col-lg-7">
            <h2 className="fw-bold section-heading mb-4 text-center" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
              What is Trasteando?
            </h2>

            <div className="mt-4 learn-wrapper">
              <div className="learn-row">
                <div className="learn-content">
                  <p>
                    Trasteando is a two-sided storage marketplace that connects individuals
                    looking for storage space with companies offering available units.
                    Users can search, compare, book and manage storage facilities in real time,
                    while businesses control availability, revenue, and communication
                    through a dedicated management dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="section-divider fade-section"></div>

      {/* ================= MARKETPLACE ARCHITECTURE ================= */}
      <div className="container py-5 text-black fade-section">
        <h2 className="section-title mb-5" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
          Marketplace Architecture
        </h2>

        {/* ================= CLIENT APPLICATION LAYER ================= */}
        <div className="feature-card mb-4 d-flex flex-lg-row flex-column align-items-stretch" style={{ padding: "20px", borderRadius: "10px", border: "1px solid #e0e0e0", boxShadow: "0 4px 8px rgba(0,0,0,0.05)" }}>

          {/* Texto */}
          <div className="flex-grow-1 me-lg-4 mb-3 mb-lg-0">
            <h5 className="fw-bold mb-3">Client Application Layer</h5>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
              <li>Location-based search with interactive maps</li>
              <li>Storage comparison and filtering system</li>
              <li>Secure booking and payment flow</li>
              <li>Personal dashboard with user metrics</li>
              <li>Direct messaging with storage owners</li>
              <li>Custom storage selection</li>
              <li>AI-assisted inventory insights</li>
            </ul>
          </div>

          {/* Imagen */}
          <div className="flex-shrink-0" style={{ width: "200px" }}>
            <img
              src={client}
              alt="Client Layer"
              className="img-fluid"
              style={{ borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* ================= COMPANY MANAGEMENT LAYER ================= */}
        <div className="feature-card mb-4 d-flex flex-lg-row flex-column align-items-stretch" style={{ padding: "20px", borderRadius: "10px", border: "1px solid #e0e0e0", boxShadow: "0 4px 8px rgba(0,0,0,0.05)" }}>

          {/* Texto */}
          <div className="flex-grow-1 me-lg-4 mb-3 mb-lg-0">
            <h5 className="fw-bold mb-3">Company Management Layer</h5>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
              <li>CRUD system for storage facilities</li>
              <li>Availability and pricing management</li>
              <li>Revenue tracking dashboard</li>
              <li>Role-based staff access control</li>
              <li>Direct messaging with clients</li>
              <li>Live storage management</li>
              <li>AI-powered inventory management</li>
            </ul>
          </div>

          {/* Imagen */}
          <div className="flex-shrink-0" style={{ width: "200px" }}>
            <img
              src={company}
              alt="Company Layer"
              className="img-fluid"
              style={{ borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      <div className="section-divider fade-section"></div>


      {/* ================= BACKEND ENGINEERING ================= */}
      <div className="container py-5 text-black fade-section">
        <h2 className="section-title text-center mb-3" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
          Backend Engineering
        </h2>
        <p className="text-center mb-5">
          RESTful API architecture built with Flask, designed for maintainability,
          modularity and scalability.
        </p>

        <div className="row g-4">

          {/* ================= API ARCHITECTURE ================= */}
          <div className="col-md-4">
            <div className="feature-card backend-card p-4 h-100 d-flex flex-column align-items-center text-center">
              <img
                src={flask}
                alt="Flask"
                className="img-fluid backend-img mb-3"
                style={{ width: "80px", height: "80px", transition: "transform 0.3s, filter 0.3s" }}
              />
              <h5 className="fw-bold mb-3">API Architecture</h5>
              <ul className="backend-list" style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
                <li>⚡ RESTful endpoints structured by resource</li>
                <li>📝 HTTP methods: GET, POST, PUT, DELETE</li>
                <li>🗂 Blueprint modularization</li>
                <li>🔧 Controller-service separation pattern</li>
              </ul>
            </div>
          </div>

          {/* ================= DATABASE DESIGN ================= */}
          <div className="col-md-4">
            <div className="feature-card backend-card p-4 h-100 d-flex flex-column align-items-center text-center">
              <img
                src={sqla}
                alt="Database"
                className="img-fluid backend-img mb-3"
                style={{ width: "80px", height: "80px", transition: "transform 0.3s, filter 0.3s" }}
              />
              <h5 className="fw-bold mb-3">Database Design</h5>
              <ul className="backend-list" style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
                <li>🗄 Relational modeling with SQLAlchemy ORM</li>
                <li>🔗 One-to-many & many-to-many relationships</li>
                <li>⚡ Optimized queries & indexing</li>
                <li>📦 Migration-ready structure</li>
              </ul>
            </div>
          </div>

          {/* ================= AUTHENTICATION & SECURITY ================= */}
          <div className="col-md-4">
            <div className="feature-card backend-card p-4 h-100 d-flex flex-column align-items-center text-center">
              <img
                src={security}
                alt="Security"
                className="img-fluid backend-img mb-3"
                style={{ width: "80px", height: "80px", transition: "transform 0.3s, filter 0.3s" }}
              />
              <h5 className="fw-bold mb-3">Authentication & Security</h5>
              <ul className="backend-list" style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
                <li>🔐 JWT-based authentication</li>
                <li>🛡 Role-based access control (RBAC)</li>
                <li>🚧 Protected routes & middleware validation</li>
                <li>🔑 Secure password hashing</li>
              </ul>
            </div>
          </div>

        </div>

        <div className="section-divider fade-section"></div>

        {/* ================= FRONTEND ARCHITECTURE ================= */}
        <div className="container py-5 text-black fade-section">
          <h2 className="section-title text-center mb-3" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>Frontend Architecture</h2>
          <p className="text-center mb-5">
            Component-driven architecture using React, focused on scalability,
            maintainability and clean state management.
          </p>

          <div className="row g-4">

            {/* ================= COMPONENT SYSTEM ================= */}
            <div className="col-md-4">
              <div className="feature-card frontend-card p-4 h-100 d-flex flex-column align-items-center text-center">
                <img
                  src={reactlogo}
                  alt="Component System"
                  className="img-fluid frontend-img mb-3"
                  style={{ width: "80px", height: "80px", transition: "transform 0.3s, filter 0.3s" }}
                />
                <h5 className="fw-bold mb-3">Component System</h5>
                <ul className="frontend-list" style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
                  <li>⚛️ 40+ reusable components</li>
                  <li>🧩 Layout abstraction</li>
                  <li>🔀 Separation of UI and logic</li>
                  <li>📊 State-driven rendering</li>
                </ul>
              </div>
            </div>



            {/* ================= ROUTING & ACCESS CONTROL ================= */}
            <div className="col-md-4">
              <div className="feature-card frontend-card p-4 h-100 d-flex flex-column align-items-center text-center">
                <img
                  src={reactrouterlogo}
                  alt="Routing & Access Control"
                  className="img-fluid frontend-img mb-3"
                  style={{ width: "80px", height: "80px", transition: "transform 0.3s, filter 0.3s" }}
                />
                <h5 className="fw-bold mb-3">Routing & Access Control</h5>
                <ul className="frontend-list" style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
                  <li>🛣 React Router protected routes</li>
                  <li>👤 Client-side role validation</li>
                  <li>🔒 Private & public route separation</li>
                </ul>
              </div>
            </div>

            {/* ================= UX & PERFORMANCE ================= */}
            <div className="col-md-4">
              <div className="feature-card frontend-card p-4 h-100 d-flex flex-column align-items-center text-center">
                <img
                  src={bootstrap}
                  alt="UX & Performance"
                  className="img-fluid frontend-img mb-3"
                  style={{ width: "80px", height: "80px", transition: "transform 0.3s, filter 0.3s" }}
                />
                <h5 className="fw-bold mb-3">UX & Performance</h5>
                <ul className="frontend-list" style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
                  <li>📱 Responsive design with Bootstrap</li>
                  <li>⚡ Optimized rendering patterns</li>
                  <li>🧹 Clean state management</li>
                  <li>🎨 Smooth UI animations</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="section-divider fade-section"></div>

          {/* ================= ADVANCED FUNCTIONALITIES ================= */}
          <div className="container py-5 text-black fade-section">
            <h2 className="section-title text-center mb-5" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>Advanced Functionalities</h2>

            <div className="row g-4">

              <div className="col-md-6">
                <div className="feature-card p-4 h-100">
                  <h5 className="fw-bold">⚡ Real-Time Communication — Socket.IO</h5>
                  <p>
                    WebSocket-based messaging system enabling instant communication
                    between clients and storage providers.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="feature-card p-4 h-100">
                  <h5 className="fw-bold" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>💳 Secure Payments — Stripe</h5>
                  <p>
                    Tokenized checkout sessions with backend verification and
                    payment status validation using webhooks.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="feature-card p-4 h-100">
                  <h5 className="fw-bold">🤖 AI-Powered Inventory Module</h5>
                  <p>
                    Intelligent classification system for structured product tagging
                    and automated categorization.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="feature-card p-4 h-100">
                  <h5 className="fw-bold">🗺 Location Intelligence — Google Maps</h5>
                  <p>
                    Dynamic map rendering to visualize storage facilities,
                    highlight nearby options and enhance user decision-making.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="section-divider fade-section"></div>

          {/* ================= VISION ================= */}
          <div className="container py-5 text-center fade-section" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
            <div
              className="p-3 px-5 rounded-pill shadow-sm d-inline-block"
              style={{
                background: "#91BBF2",
                textShadow: "0px 2px 8px rgba(0,0,0,0.2)"
              }}
            >
              <h2 className="fw-bold mb-3" style={{ fontSize: "2.5rem" }}>Security, Scalability & Vision</h2>
              <p className="mx-auto section-text">
                Trasteando was designed with scalability and maintainability in mind.
                Its modular backend structure, reusable frontend architecture and
                secure authentication flow allow future feature expansion.
                This project represents a transition from academic learning
                to production-oriented engineering thinking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};