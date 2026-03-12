import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const StoragesPrivateList = () => {
    const { locationId } = useParams();
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [storages, setStorages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [storagesAvailability, setStoragesAvailability] = useState({});

    const checkAllStoragesAvailability = async (storagesList, token) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const resp = await fetch(`${backendUrl}/leases`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (resp.ok) {
                const allLeases = await resp.json();
                const availability = {};

                storagesList.forEach(storage => {
                    const hasLease = allLeases.some(lease => lease.storage_id === storage.id);
                    availability[storage.id] = storage.status === true && !hasLease;
                });

                setStoragesAvailability(availability);
            }
        } catch (error) {
            console.error("Error checking availability:", error);
        }
    };


    useEffect(() => {
        const fetchStorages = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const token = store.tokenClient;

                const resp = await fetch(`${backendUrl}/location/${locationId}/storages`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = await resp.json();

                if (resp.ok) {
                    setStorages(data);
                    // Check availability para todos
                    checkAllStoragesAvailability(data, token);
                }
            } catch (error) {
                console.error("Error cargando trasteros:", error);
            } finally {
                setLoading(false);
            }
        };



        if (locationId && store.tokenClient) fetchStorages();
    }, [locationId, store.tokenClient]);

    if (loading) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <h4 className="mt-3 text-muted">Buscando trasteros disponibles...</h4>
        </div>
    );

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold display-5">Trasteros Disponibles</h2>
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {storages.length > 0 ? storages.map((storage) => (
                    <div key={storage.id} className="col">
                        <div className="card h-100 shadow-lg border-0" style={{ borderRadius: "25px", overflow: "hidden", transition: "transform 0.3s" }}>
                            <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "180px" }}>
                                <i className="bi bi-box-seam text-primary" style={{ fontSize: "5rem", opacity: "0.2" }}></i>
                            </div>

                            <div className="card-body d-flex flex-column justify-content-between p-4" style={{ minHeight: "220px" }}>
                                <div>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h3 className="fw-bold mb-0">Unidad {storage.id}</h3>                    
                                        <span className={`badge rounded-pill border
                                         ${storagesAvailability[storage.id] ? 'border-success text-success' : 'border-danger text-danger'}`}
                                            style={{ backgroundColor: "transparent" }}> 
                                            {storagesAvailability[storage.id] === undefined ? 'Cargando...' : storagesAvailability[storage.id] === true ? 'Disponible' : 'Ocupado'}
                                        </span>                
                                    </div>

                                    <p className="text-muted mb-4"> Espacio optimizado con techos altos y vigilancia individual.</p>
                                    <div className="d-flex gap-3 mb-3">
                                        <div className="small border rounded-3 px-3 py-2 bg-light text-dark fw-bold">
                                            {storage.size}
                                        </div>
                                        <div className="small border rounded-3 px-3 py-2 bg-light text-primary fw-bold">
                                            {storage.price}€/mes
                                        </div>
                                    </div>
                                </div>
                                <button className={'btn w-100 fw-bold py-3 shadow-sm btn-primary'} style={{ borderRadius: "12px" }} onClick={() => navigate(`/client/private/storage/${storage.id}`)}>
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-12 text-center py-5">
                        <div className="p-5 border rounded-5 bg-light shadow-sm">
                            <h3 className="text-muted">No hay trasteros en esta ubicación</h3>
                            <p>Estamos trabajando para habilitar más espacios pronto.</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="text-center mb-5">
                <button className="btn btn-outline-secondary rounded-pill px-4 mt-2" onClick={() => navigate(-1)}>   ← Volver a ubicaciones </button>
            </div>
        </div>
    );
};