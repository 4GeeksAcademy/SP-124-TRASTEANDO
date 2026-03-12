import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect } from "react";

export const AdminProtectedRoute = () => {
    
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    // Buscamos el token en el store O en el localStorage

    const token = store.admin_token || localStorage.getItem("admin_token");

    useEffect(() => {
         if (!token){
            navigate("/admin/login");
         }
    }, []);

    return <Outlet />;
};