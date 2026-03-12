import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect } from "react";

export const CompanyProtectedRoute = () => {
    
    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    
    // Buscamos el token en el store O en el localStorage

    const token = store.company_token || localStorage.getItem("token_company");

    useEffect(() => {
         if (!token){
            navigate("/companies/login")
         }
    },[])

    return <Outlet />
};