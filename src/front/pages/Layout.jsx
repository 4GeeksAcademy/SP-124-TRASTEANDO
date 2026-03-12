import { Outlet, useLocation } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useEffect } from "react"
import { clearPendingLeases } from "../utilsLeases"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const {store} = useGlobalReducer();
    const location = useLocation();

    useEffect(() => {
    // 1. Detectamos dónde estamos
    const isCheckoutPage = location.pathname.includes("checkout");
    const isPaymentPage = location.pathname.includes("payment");
    const isSuccessPage = location.pathname.includes("success");

    if (store.tokenClient && !isCheckoutPage && !isPaymentPage && !isSuccessPage) {
        clearPendingLeases(store.tokenClient)
            .then(() => console.log("Limpieza de pendientes completada"))
            .catch(err => console.error("Error limpiando:", err));
    }
}, [location.pathname, store.tokenClient]);

    return (

        <ScrollToTop>
            <Navbar />
                <Outlet />
            <Footer />
        </ScrollToTop>
    )
}