import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "../front/components/DashboardSidebar";



export const ClientDashboardLayout = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

  const links = [
    { to: "/client/dashboard/profile",        label: "My Profile",         icon: "bi-person" },
    { to: "/client/dashboard/leases",         label: "My Leases",          icon: "bi-box-seam" },
    { to: "/client/dashboard/inventory",      label: "My Inventory",       icon: "bi-archive" },
    { to: "/client/dashboard/paymentdetails", label: "Payment Details",    icon: "bi-wallet" },
    { to: "/client/dashboard/chat",           label: "My Chat",            icon: "bi-chat-dots" },
    { to: "/client/dashboard/deleteprofile",  label: "Delete Profile",     icon: "bi-trash" },
  ];

  useEffect(() => {
    const loadMe = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("tokenClient");
        if (!token) { navigate("/client/login"); return; }

        const resp = await fetch(`${backendUrl}/private/client`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) return;
        const data = await resp.json();
        setMe(data);
      } catch (e) {
        console.error("Error loading client profile:", e);
      }
    };
    loadMe();
  }, [navigate]);

  const user = {
    name: me?.name || me?.email?.split("@")[0] || "Client",
    email: me?.email || "",
    photo: me?.photo_url || null,
  };

  const onLogout = () => {
    localStorage.removeItem("tokenClient");
    navigate("/client/login");
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
        <div className="flex-grow-1 p-1" style={{ color: "#5C73F2" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};