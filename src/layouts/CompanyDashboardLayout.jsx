import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "../front/components/DashboardSidebar";

export const CompanyDashboardLayout = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

  const links = [
    { to: "/company/dashboard", label: "Profile", icon: "bi-building" },
    // { to: "/company/dashboard/locations", label: "Locations", icon: "bi-geo-alt" },
    // { to: "/company/dashboard/storages", label: "Storages", icon: "bi-box" },
    { to: "/company/dashboard/chat", label: "Chat", icon: "bi-chat-dots" },
  ];

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token_company");

        if (!token) {
          navigate("/companies/login");
          return;
        }

        const resp = await fetch(`${backendUrl}/private/company`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resp.ok) return;

        const data = await resp.json();
        setMe(data);
      } catch (err) {
        console.error("Error loading company:", err);
      }
    };

    loadCompany();
  }, [navigate]);

  const user = {
    name: me?.name || me?.company_name || "Company",
    email: me?.email || "",
    photo: me?.photo_url || null,
    editPath: me?.id ? `/companies/${me.id}/edit` : null,
  };

  const onLogout = () => {
    localStorage.removeItem("token_company");
    navigate("/companies/login");
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
        <div className="flex-grow-1 p-5" style={{ color: "#5C73F2" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};