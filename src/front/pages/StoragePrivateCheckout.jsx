import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getStorageOverview } from "../utilsStorages";
import { createLease, deleteClientLease } from "../utilsLeases";
import { createClientLease } from "../utilsLeases";


export const StoragePrivateCheckout = () => {
    const { storageId } = useParams();
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [storage, setStorage] = useState(null);
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);


    
    const handleCompleteOrder = async () => {
        if (!startDate || !endDate) return alert("Por favor, elige las fechas.");

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end <= start) return alert("La fecha de fin debe ser posterior a la de inicio.");

        try {
            const leaseData = {
                storage_id: parseInt(storageId),
                start_date: startDate,
                end_date: endDate,
                status: "pending payment"
            };
          

            const newLease = await createClientLease(leaseData, store.tokenClient);

            const stripeResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stripe/create-subscription-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan: "monthly",
                    lease_id: newLease.id
                })
            });

            const stripeData = await stripeResponse.json();

            if (stripeResponse.ok && stripeData.url) {
                window.location.href = stripeData.url;
            } else {
                await deleteClientLease(newLease.id, store.tokenClient);
                throw new Error(stripeData.error || "El plan de pago no es válido en el servidor.");
            }

        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    };

    // codigo añadido para lo de las fechas
    const isDateConflict = () => {
        if (!startDate || !endDate || !storage?.occupied_dates) return false;

        const start = new Date(startDate);
        const end = new Date(endDate);

        return storage.occupied_dates.some(lease => {
            const leaseStart = new Date(lease.start);
            const leaseEnd = new Date(lease.end);
            return start <= leaseEnd && end >= leaseStart;
        });
    };

    useEffect(() => {
        const loadInfo = async () => {
            try {
                const data = await getStorageOverview(storageId, store.tokenClient);
                setStorage(data);
            } catch (error) {
                console.error("Error al cargar datos", error);
            } finally {
                setLoading(false);
            }
        };
        if (storageId && store.tokenClient) loadInfo();
    }, [storageId, store.tokenClient]);


    return (

         <div className="container py-5" style={{ color: "#222222", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            <h2 className="fw-bold mb-5 pb-4 border-bottom d-flex align-items-center" style={{ fontSize: "2rem" }}>
                <i className="bi bi-chevron-left me-4" style={{ cursor: "pointer", fontSize: "1.5rem" }}></i>
                Confirmar y pagar
            </h2>

            <div className="row g-5">

                <div className="col-lg-7 pe-lg-5">

                    <div className="mb-5">
                        <h4 className="fw-bold mb-4 fs-5">Fechas de tu reserva</h4>
                        <div className="row g-0 border rounded-4 overflow-hidden shadow-sm">
                            <div className="col-md-6 border-md-bottom-0 position-relative">
                                <div className="form-floating" style={{ borderRight: "1px solid #dee2e6" }}>
                                    <input
                                        type="date"
                                        className="form-control border-0 shadow-none bg-light"
                                        id="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        style={{ cursor: "pointer", borderRadius: 0 }}
                                    />
                                    <label htmlFor="startDate" className="fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>Llegada</label>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input
                                        type="date"
                                        className="form-control border-0 shadow-none bg-light"
                                        id="endDate"
                                        value={endDate}
                                        min={startDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        style={{ cursor: "pointer", borderRadius: 0 }}
                                    />
                                    <label htmlFor="endDate" className="fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>Salida</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-5" />

                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 fs-5">Política de cancelación</h4>
                        <p className="text-muted" style={{ lineHeight: "1.6" }}>
                            <strong>Cancelación gratuita antes del inicio.</strong> Revisa las políticas completas de {storage?.company_name || "la empresa"} para conocer los detalles sobre cancelaciones a mitad de mes.
                        </p>
                    </div>

                    <hr className="my-5" />

                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 fs-5">Reglas fundamentales</h4>
                        <p className="text-muted mb-2">Pedimos a todos los clientes que recuerden un par de cosas muy sencillas sobre lo que hace de este un gran espacio:</p>
                        <ul className="text-muted" style={{ lineHeight: "1.8" }}>
                            <li>Sigue las normas del establecimiento.</li>
                            <li>Trata el espacio y las zonas comunes con respeto.</li>
                            <li>No almacenes materiales peligrosos o inflamables.</li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="card shadow border-0 p-4 sticky-top bg-white" style={{ borderRadius: "16px", top: "30px" }}>
                        <div className="d-flex align-items-center mb-4 pb-4 border-bottom">
                            <img
                                src={storage?.photo || "https://images.unsplash.com/photo-1581404917829-53144e2c115f?auto=format&fit=crop&q=80&w=150"}
                                alt="Trastero"
                                className="rounded-3 me-3 object-fit-cover shadow-sm"
                                style={{ width: "100px", height: "100px" }}
                            />
                            <div>
                                <span className="text-muted small d-block mb-1">Trastero #{storageId}</span>
                                <span className="fw-bold d-block" style={{ fontSize: "1.1rem" }}>{storage?.company_name}</span>
                                <span className="small d-block mt-1 text-muted">
                                    <i className="bi bi-star-fill text-dark me-1" style={{ fontSize: "0.75rem" }}></i>
                                    Protección garantizada
                                </span>
                            </div>
                        </div>

                        <h4 className="fw-bold mb-4 fs-5">Detalles del precio</h4>

                        <div className="d-flex justify-content-between mb-3 text-muted">
                            <span>{storage?.price}€ x mes contratado</span>
                            <span>{storage?.price}€</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3 text-muted">
                            <span className="text-decoration-underline">Tarifa de servicio del sitio</span>
                            <span className="text-success">Gratis</span>
                        </div>

                        <hr className="my-4" />

                        <div className="d-flex justify-content-between mb-4">
                            <span className="h5 fw-bold mb-0" style={{ color: "#222222" }}>Total hoy (EUR)</span>
                            <span className="h5 fw-bold mb-0" style={{ color: "#222222" }}>{storage?.price}€</span>
                        </div>
                        {isDateConflict() && (
                            <div className="alert alert-danger mb-4 d-flex align-items-center border-0 rounded-3 shadow-sm" style={{ background: "#ffebe9", color: "#da002a" }}>
                                <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                                <span className="small fw-semibold">Las fechas seleccionadas coinciden con una reserva existente. Por favor, selecciona otras.</span>
                            </div>
                        )}
                        <button
                            className="btn w-100 py-3 fw-bold text-white fs-6 shadow mt-2"
                            style={{
                                background: isDateConflict() ? "#cccccc" : "#f24171",
                                borderColor: isDateConflict() ? "#cccccc" : "#f24171",
                                borderRadius: "10px",
                                transition: "all 0.2s"
                            }}
                            onClick={handleCompleteOrder}
                            disabled={isDateConflict()}
                        >
                            Confirmar y Pagar
                        </button>
                    </div>
                </div>
            </div>
        </div>


    )

}