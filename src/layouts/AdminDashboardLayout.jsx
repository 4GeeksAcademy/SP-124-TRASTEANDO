import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "../front/components/DashboardSidebar";

export const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

  const links = [
    { to: "/admin/dashboard/private", label: "Profile", icon: "bi-person-gear" },
    { to: "/admin/dashboard/users", label: "Admin Users", icon: "bi-people" },
    { to: "/admin/dashboard/companies", label: "Companies", icon: "bi-buildings" },
    { to: "/admin/dashboard/clients", label: "Clients", icon: "bi-person-lines-fill" },
  ];

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("admin_token");

        if (!token) {
          navigate("/admin/login");
          return;
        }

        const resp = await fetch(`${backendUrl}/private/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resp.ok) return;

        const data = await resp.json();
        setMe(data);
      } catch (err) {
        console.error("Error loading admin:", err);
      }
    };

    loadAdmin();
  }, [navigate]);

  const user = {
    name: me?.email?.split("@")[0] || "Admin",
    email: me?.email || "",
    photo: me?.photo_url || null,
    editPath: null, // normalmente admin no edita perfil aquí
  };

  const onLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", padding: "40px 20px" }}>
      <div
        className="d-flex mx-auto"
        style={{
          maxWidth: 1200,
          borderRadius: 24,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 4px 24px rgba(92,115,242,0.08)",
          border: "1px solid #e8eaf6",
        }}
      >
        {/* SIDEBAR */}
        <div style={{ width: 280, borderRight: "1px solid #e8eaf6", background: "#fff" }}>
          <DashboardSidebar
            title="Client"
            links={links}
            color="#5C73F2"
            user={user}
            onLogout={onLogout}
          />
        </div>

        {/* CONTENIDO */}
        <div className="flex-grow-1 p-4" style={{ color: "#5C73F2" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};