import imagen1 from "../assets/img/Sergio.jpg";
import imagen2 from "../assets/img/irene.png";
import imagen3 from "../assets/img/david.png"
import problem from "../assets/img/problem-solving.jpg";
import team from "../assets/img/team-colaboration.avif";
import real from "../assets/img/real-work.jpg"
import { useEffect } from "react";

export const AboutUs = () => {

    useEffect(() => {
        const sections = document.querySelectorAll(".fade-section");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.2 }
        );

        sections.forEach((section) => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);


    return (
        <div className="container-fluid p-0 features-bg">

            {/* ================= HERO SECTION ================= */}
            <div className="container py-5 text-black text-center fade-section" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
                <h1 className="display-3 fw-bold mb-4" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
                    About Trasteando
                </h1>

                <div className="mx-auto hero-text-box" style={{ maxWidth: "850px" }}>
                    <p className="lead">
                        Trasteando was born as our final project at 4Geeks Academy, but it quickly became much more than just an academic assignment.
                    </p>

                    <p>
                        This is our first project as developers — a product built with passion, dedication, and countless hours of learning, problem-solving, and teamwork.
                        We are a team of three aspiring developers who are eager to grow in the tech industry. Every line of code in this project represents progress, resilience,
                        and the ambition to turn ideas into real solutions.
                    </p>

                    <p>
                        Trasteando is not perfect — and that’s exactly why we’re proud of it. It represents our journey, our mistakes, our improvements,
                        and our evolution as professionals. We truly hope you enjoy exploring it, and who knows — maybe one day it will grow into something real and impactful.
                    </p>
                </div>
            </div>

            {/* ================= TEAM SECTION ================= */}
            <div className="container py-5">
                <h2 className="text-center text-black fw-bold mb-5">Meet the Team</h2>

                <div className="row g-4">

                    <div className="col-md-4">
                        <div className="card h-100 shadow border-0 text-center p-4 team-card">
                            <img
                                src={imagen1}
                                alt="Sergio Cordoba"
                                className="rounded-circle mx-auto mb-3"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                            <h4 className="fw-bold">Sergio Córdoba</h4>
                            <p className="text-muted mb-1">Full Stack Developer</p>
                            <p>
                                Focused on building the user interface and creating a smooth, responsive experience.
                                Worked extensively with React and Javascript to develop reusable components and manage state efficiently.
                                Contributed to backend integration using Python and SQLAlchemy, ensuring seanless communication between the frontend and database.
                                Responsible for layout structure, component logic, and UI consistency, and overall user experience optimization.
                            </p>

                            <div className="mt-3">
                                <a href="https://www.linkedin.com/in/sergio-cordoba-199bba150"
                                    target="_blank"
                                    rel="noopener noreferrer" className="text-dark me-3 fs-5">
                                    <i className="fa-brands fa-linkedin social-icon"></i>
                                </a>
                                <a href="https://github.com/SergioC246"
                                    target="_blank"
                                    rel="noopener noreferrer" className="text-dark me-3 fs-5">
                                    <i className="fa-brands fa-github social-icon"></i>
                                </a>
                                <a href="mailto:sergiocordoba246@gmail.com" className="text-dark fs-5">
                                    <i className="fa-regular fa-envelope social-icon"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 shadow border-0 text-center p-4 team-card">
                            <img
                                src={imagen2}
                                alt="Irene Sanchez"
                                className="rounded-circle mx-auto mb-3"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                            <h4 className="fw-bold">Irene Sánchez</h4>
                            <p className="text-muted mb-2">Full Stack Developer</p>
                            <p>
                                Designed and structured the relational database using SQLAlchemy, ensuring scalable and efficient data models.
                                Implemented authentication and authorization logic with secure user session management.
                                Developed and integrated RESTful APIs to enable smooth communication between frontend and backend services.
                                Focused on data integrity, security best practices, and optimized data flow across the application.
                            </p>

                            <div className="mt-3">
                                <a href="https://www.linkedin.com/in/irene-sanchez-419041248/?trk=opento_sprofile_topcard"
                                    target="_blank"
                                    rel="noopener noreferrer" className="text-dark me-3 fs-5">
                                    <i className="fa-brands fa-linkedin social-icon"></i>
                                </a>
                                <a href="https://github.com/isanarmu"
                                    target="_blank"
                                    rel="noopener noreferrer" className="text-dark fs-5">
                                    <i className="fa-brands fa-github me-3 social-icon"></i>
                                </a>
                                <a href="mailto:isanarmu@gmail.com" className="text-dark fs-5">
                                    <i className="fa-regular fa-envelope social-icon"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 shadow border-0 text-center p-4 team-card">
                            <img
                                src={imagen3}
                                alt="David Alvarez"
                                className="rounded-circle mx-auto mb-3"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                            <h4 className="fw-bold">David Álvarez</h4>
                            <p className="text-muted mb-2">Full Stack Developer</p>
                            <p>
                                Contributed to the overall system architecture and backend structure, ensuring scalability and maintainability.
                                Implemented role-based authentication and access control mechanisms.
                                Developed real-time communication features using Socket.IO.
                                Integrated Stripe payment processing and contributed to an AI-based module (“Inventariator”) for intelligent product classification.
                                Focused on performance, modular design, and seamless feature integration.
                            </p>

                            <div className="mt-3">
                                <a href="https://www.linkedin.com/in/davidalvarezig"
                                    target="_blank"
                                    rel="noopener noreferrer" className="text-dark me-3 fs-5">
                                    <i className="fa-brands fa-linkedin social-icon"></i>
                                </a>
                                <a href="https://github.com/daalvarezig"
                                    target="_blank"
                                    rel="noopener noreferrer" className="text-dark fs-5">
                                    <i className="fa-brands fa-github me-3 social-icon"></i>
                                </a>
                                <a href="mailto:daalvarezig@gmail.com" className="text-dark fs-5">
                                    <i className="fa-regular fa-envelope social-icon"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= WHAT WE LEARNED SECTION ================= */}
            <div className="container py-5 text-black fade-section">
                <div className="row align-items-center gy-5">

                    {/* LEFT IMAGE COLUMN */}
                    <div className="col-lg-5">
                        <div className="image-section">

                            <div className="primary-image">
                                <img
                                    src={problem}
                                    alt="Problem solving"
                                    className="img-fluid main-img"
                                />
                            </div>

                            <div className="image-grid">
                                <img src={team} alt="Team work" className="small-img" />
                                <img src={real} alt="Development" className="small-img" />
                            </div>

                        </div>
                    </div>

                    {/* RIGHT CONTENT COLUMN */}
                    <div className="col-lg-7">
                        <h2 className="fw-bold section-heading mb-4">
                            What We Learned Building This
                        </h2>

                        <div className="mt-4 learn-wrapper">

                            <div className="learn-row">
                                <div className="learn-icon">
                                    <i className="fa-solid fa-lightbulb"></i>
                                </div>
                                <div className="learn-content">
                                    <h5 className="fw-bold">Problem Solving</h5>
                                    <p>
                                        Turning challenges into opportunities through creative thinking and persistence.
                                    </p>
                                </div>
                            </div>

                            <div className="learn-row">
                                <div className="learn-icon">
                                    <i className="fa-solid fa-people-group"></i>
                                </div>
                                <div className="learn-content">
                                    <h5 className="fw-bold">Team Collaboration</h5>
                                    <p>
                                        Learning how to communicate, plan, and build together as a real development team.
                                    </p>
                                </div>
                            </div>

                            <div className="learn-row">
                                <div className="learn-icon">
                                    <i className="fa-solid fa-code"></i>
                                </div>
                                <div className="learn-content">
                                    <h5 className="fw-bold">Real-World Development</h5>
                                    <p>
                                        Designing, coding, debugging, and deploying a complete full-stack application.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* ================= SLOGAN SECTION ================= */}
            <div className="container py-5 text-center fade-section" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
                <div
                    className="p-3 px-5 rounded-pill shadow-sm d-inline-block"
                    style={{
                        background: "#91BBF2",
                        textShadow: "0px 2px 8px rgba(0,0,0,0.2)"
                    }}
                >
                    <h1 className="fw-bold mb-0" style={{ fontSize: "2.5rem" }}>
                        Smart storage for modern living
                    </h1>
                </div>
            </div>
        </div>
    );
};
