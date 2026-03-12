import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect } from "react";

export const ClientProtectedRoute = () => {
    
    const { store } = useGlobalReducer();
    const navigate = useNavigate()

    // Buscamos el token en el store O en el localStorage

    const token = store.tokenClient || localStorage.getItem("tokenClient");

    useEffect(() => {
         if (!token){
            navigate("/client/login")
         }
    },[])

    return <Outlet />
};