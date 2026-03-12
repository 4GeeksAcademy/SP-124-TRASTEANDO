import{ useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { store } = useGlobalReducer();

    useEffect(() => {
        const confirmAndMove = async () => {
            const leaseId = searchParams.get("lease_id");
            console.log("ID recuperado de la URL:", leaseId); // Para debugear
            
            if (leaseId && store.tokenClient) {
                try {
                    // Esperamos a que el fetch termine ANTES de seguir
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/client/leases/${leaseId}/confirm`, {
                        method: "PATCH",
                        headers: { 
                            "Authorization": `Bearer ${store.tokenClient}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (response.ok) {
                        console.log("¡Contrato activado en DB!");
                    }
                } catch (e) {
                    console.error("Error confirmando:", e);
                }
            }

            // SOLO después de intentar confirmar, esperamos 3 segundos y navegamos
            setTimeout(() => {
                navigate("/client/private/leases");
            }, 3000);
        };

        confirmAndMove();
    }, [searchParams, store.tokenClient]); // Añadimos dependencias

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", color: "#222222", fontFamily: "system-ui, -apple-system, sans-serif" }}>
    <div className="card border-0 shadow-lg p-5 text-center" style={{ borderRadius: "28px", maxWidth: "450px", background: "#ffffff" }}>
        <div className="mb-4 d-flex justify-content-center">
            <div className="d-flex align-items-center justify-content-center shadow-sm" style={{ 
                height: "80px", 
                width: "80px", 
                backgroundColor: "#f7f7f7", 
                borderRadius: "50%",
                color: "#00a699" 
            }}>
                <i className="bi bi-check-lg" style={{ fontSize: "2.5rem" }}></i>
            </div>
        </div>
        <h2 className="fw-bold mb-3" style={{ letterSpacing: "-0.5px" }}>Payment Successful</h2>

        <p className="text-muted px-3" style={{ lineHeight: "1.6" }}>
            Your payment has been processed securely. We are currently activating your contract.
        </p>
        <div className="d-flex align-items-center justify-content-center my-4 p-3 rounded-4" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="spinner-border spinner-border-sm me-3 text-secondary" role="status" style={{ width: "1rem", height: "1rem", borderWeight: "2px" }}></div>
            <span className="small fw-bold text-uppercase text-muted" style={{ letterSpacing: "1px" }}>
                Activating contract...
            </span>
        </div>

        <p className="small text-muted mb-4">Please do not refresh or close this window.</p>
    </div>
</div>
    );
};

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const PaymentSuccess = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         setTimeout(() => {
//             navigate("/client/private/leases");
//         }, 3000);
//     }, []);

//     return (
//         <div className="container text-center py-5">
//             <h2 className="text-success">✅ Pago realizado con éxito</h2>
//             <p>Tu suscripción se ha activado correctamente.</p>
//             <p>Redirigiendo a tus contratos...</p>
//         </div>
//     );
// };