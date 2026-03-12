import React, { useState, useEffect, useRef } from 'react';

export const SearchHome = () => {
    
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapContainerRef = useRef(null);
    const [isLeafletReady, setIsLeafletReady] = useState(false);
    
    const [searchData, setSearchData] = useState({
        location: '',
        lat: 40.416775,
        lng: -3.703790
    });
    
    useEffect(() => {
        
        if (window.L) {
            setIsLeafletReady(true);
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => setIsLeafletReady(true);
        document.head.appendChild(script);
    }, []);

    // 2. INICIALIZACIÓN DEL MAPA
    useEffect(() => {
        if (isLeafletReady && mapContainerRef.current && !mapRef.current) {
            const L = window.L;
            
            mapRef.current = L.map(mapContainerRef.current).setView([searchData.lat, searchData.lng], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(mapRef.current);

            markerRef.current = L.marker([searchData.lat, searchData.lng], {
                draggable: true
            }).addTo(mapRef.current);

            markerRef.current.on('dragend', function (e) {
                const position = markerRef.current.getLatLng();
                setSearchData(prev => ({ ...prev, lat: position.lat, lng: position.lng }));
            });

            // Forzar renderizado correcto
            setTimeout(() => mapRef.current.invalidateSize(), 500);
        }
    }, [isLeafletReady]);

    return (
        <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
            
            {/* BARRA TIPO AIRBNB */}
            <div className="container pt-4" style={{ zIndex: 1000 }}>
                <div className="row g-0 shadow-lg border rounded-pill bg-white p-2 align-items-center">
                    <div className="col px-4">
                        <label className="d-block small fw-bold text-muted mb-0">UBICACIÓN</label>
                        <input 
                            type="text" 
                            className="form-control border-0 p-0 shadow-none" 
                            placeholder="¿Dónde buscas trastero?" 
                            value={searchData.location}
                            onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                        />
                    </div>
                    <div className="col-auto pe-2">
                        <button className="btn btn-danger rounded-pill px-4 py-2 fw-bold">
                            Buscar
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTENEDOR DEL MAPA */}
            <div className="flex-grow-1 mt-4" style={{ position: 'relative' }}>
                {!isLeafletReady ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-danger" role="status"></div>
                        <span className="ms-2">Cargando Mapa...</span>
                    </div>
                ) : (
                    <div 
                        ref={mapContainerRef} 
                        style={{ height: '100%', width: '100%', zIndex: 1 }}
                    ></div>
                )}
            </div>
        </div>
    );
};
