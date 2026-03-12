import { NavLink, useNavigate } from "react-router-dom";

export const DashboardSidebar = ({ title, links, color, user, onLogout }) => {
  const navigate = useNavigate();

  const fallbackAvatar =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>
        <rect width='100%' height='100%' fill='${color}'/>
        <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle'
          font-family='Arial' font-size='18' fill='white'>U</text>
      </svg>
    `);

  const avatar = user?.photo || fallbackAvatar;

  return (
    <div style={{ width: 280, minHeight: "100vh", background: "#fff", borderRight: "1px solid #e8eaf6", padding: 24 }}>

      {/* PERFIL */}
      <div className="text-center mb-4">
        <img
          src={avatar}
          alt="avatar"
          className="rounded-circle mb-2"
          style={{ width: 80, height: 80, objectFit: "cover", border: `3px solid ${color}` }}
        />
        <h6 className="mb-0 fw-bold">{user?.name || title}</h6>
        <small className="text-muted">{user?.email || ""}</small>

        {user?.editPath && (
          <div className="mt-2">
            <button
              className="btn btn-sm"
              onClick={() => navigate(user.editPath)}
              style={{ borderRadius: 8, border: `1px solid ${color}`, color: color, fontSize: 12 }}
            >
              <i className="bi bi-pencil me-1"></i> Editar perfil
            </button>
          </div>
        )}
        <hr className="mt-3" />
      </div>

      {/* LINKS */}
      <ul className="nav flex-column gap-1">
        {links.map((link, index) => (
          <li key={index} className="nav-item">
            <NavLink
              to={link.to}
              end={link.to.endsWith("/dashboard")}
              className="nav-link d-flex align-items-center"
              style={({ isActive }) => ({
                borderRadius: 12,
                padding: "10px 14px",
                backgroundColor: isActive ? color : "transparent",
                color: isActive ? "#fff" : "#444",
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.2s ease",
              })}
            >
              {link.icon && <i className={`bi ${link.icon} fa-fw me-2`}></i>}
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* LOGOUT */}
      <div className="mt-4 pt-3" style={{ borderTop: "1px solid #e8eaf6" }}>
        <button
          className="d-flex align-items-center w-100 border-0 bg-transparent text-danger"
          onClick={onLogout}
          style={{ borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 500 }}
        >
          <i className="fas fa-sign-out-alt fa-fw me-2"></i> Sign Out
        </button>
      </div>

    </div>
  );
};