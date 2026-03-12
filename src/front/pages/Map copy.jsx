import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getStoragesFiltered } from "../utilsStorages";


export const Map = () => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const inputRef = useRef(null);
    const markersRef = useRef([]);
    const [storages, setStorages] = useState([]);
    const [mapReady, setMapReady] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams()

    const navigate = useNavigate()
    // unificado searchLat/Lng dentro de searchData para que solo haya una "fuente de verdad"
    const [searchData, setSearchData] = useState({
        location: searchParams.get('loc') || "",
        lat: parseFloat(searchParams.get('lat')) || null,
        lng: parseFloat(searchParams.get('lng')) || null,
        checkin: searchParams.get('checkin') || "",
        checkout: searchParams.get('checkout') || "",
    });

    const handleSearch = () => {
        if (!searchData.lat || !searchData.lng) {
            alert("Selecciona una ciudad del desplegable.");
            return;
        }

        if (mapInstance.current) {
            mapInstance.current.setCenter({ lat: searchData.lat, lng: searchData.lng });
            mapInstance.current.setZoom(15);

            initDraggableMarker();
        }
    };

    // useeffect de carga
    useEffect(() => {
        const lat = searchParams.get('lat')
        const lng = searchParams.get('lng')

        if (lat && lng) {
            setSearchData(prev => ({
                ...prev,
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                location: searchParams.get('loc') || ""
            }));
        }

        const startGoogleMaps = () => {
            initMap();
            initAutocomplete();
        };

        if (window.google && window.google.maps) {
            startGoogleMaps();
        } else {
            const existingScript = document.getElementById("google-maps-script");
            if (!existingScript) {
                const script = document.createElement("script");
                script.id = "google-maps-script";
                script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;
                script.async = true;
                script.onload = startGoogleMaps;
                document.head.appendChild(script);
            } else {
                existingScript.addEventListener("load", startGoogleMaps);
            }
        }
    }, [searchParams]);
    // useEffect que vigila lat/lng para qeu si cambian pide los trasteros.(marcador drggable y buscador actualizan la lsita automaticamente)
    useEffect(() => {
        fetchStorages();
    }, [searchData.lat, searchData.lng, searchData.checkin, searchData.checkout]);

    // cuando se inicia el mapa lo qeu sale (añadir aqui los initdraggable etc)

    const initMap = () => {
        if (!mapRef.current) return;
        const defaultCenter = { lat: 40.416775, lng: -3.703790 };
        const center = (searchData.lat && !isNaN(searchData.lat))
            ? { lat: searchData.lat, lng: searchData.lng }
            : defaultCenter;

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: searchData.lat ? 13 : 9,
            mapTypeControl: true,
            streetViewControl: false,
        });

        setMapReady(true);
        initDraggableMarker();
    };

    // draggable

    const initDraggableMarker = () => {
        if (!mapInstance.current) return;

        if (window.draggableMarker) {
            window.draggableMarker.setMap(null);
        }
        const position = (searchData.lat && searchData.lng)
            ? { lat: searchData.lat, lng: searchData.lng }
            : mapInstance.current.getCenter();

        window.draggableMarker = new window.google.maps.Marker({
            position: position,
            map: mapInstance.current,
            draggable: true,
            title: "Arrastra para mover",
            icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
        });

        window.draggableMarker.addListener("dragend", () => {
            const position = window.draggableMarker.getPosition();
            const lat = position.lat();
            const lng = position.lng();

            setSearchData(prev => ({
                ...prev,
                lat,
                lng,
                location: "Posición personalizada"
            }));
        });
    };

    const initAutocomplete = () => {
        if (!inputRef.current || !window.google?.maps?.places) return;
        const autocomplete = new
            window.google.maps.places.Autocomplete(inputRef.current);

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setSearchData(prev => ({
                ...prev,
                location: place.formatted_address,
                lat,
                lng
            }));

            if (mapInstance.current) {
                mapInstance.current.setCenter({ lat, lng });
                mapInstance.current.setZoom(13);
            }
        });
    };

    const fetchStorages = async () => {
        try {
            const data = await getStoragesFiltered({
                lat: searchData.lat,
                lng: searchData.lng,
                checkin: searchData.checkin,
                checkout: searchData.checkout
            });
            setStorages(data);
        } catch (error) {
            console.error("Error cargando storages:", error);
        }
    };
    // para dibujar los trasteros en el mapa
    useEffect(() => {
        if (!mapReady || !mapInstance.current) return;

        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        storages.forEach((storage, index) => {
            const marker = new window.google.maps.Marker({
                position: {
                    lat: parseFloat(storage.latitude) + (index * 0.00001),
                    lng: parseFloat(storage.longitude) + (index * 0.00001),
                },
                map: mapInstance.current,
                icon: {
                    url: "https://maps.gstatic.com/mapfiles/transparent.png",
                    size: new window.google.maps.Size(50, 30),
                    anchor: new window.google.maps.Point(25, 15)
                },
                optimized: false,
                label: {
                    className: "marker-nube",
                    text: `${storage.price}€`,
                }

            });
            const infoWindow = new window.google.maps.InfoWindow({
                content:
                    `<div style="color: black; padding: 5px;">
                        <strong>${storage.price}€ / mes</strong><br>
                        <span>${storage.size} m²</span>
                    </div> `
            });
            marker.addListener("click", () => {
                infoWindow.open(mapInstance.current, marker);
            });

            markersRef.current.push(marker);
        });
    }, [storages, mapReady])


    return (
        // barra de busqeuda
        <div className="p-4">
            <div className="bg-white border-bottom p-3 shadow-sm z-3">
                <div className="container-fluid">
                    <div className="row g-2 align-items-center">
                        <div className="col-md-4 position-relative">
                            <i className="fa fa-map-marker-alt position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                            <input ref={inputRef} type="text" className="form-control ps-5 border-0 bg-light rounded-pill"
                                placeholder="Where are you looking?" value={searchData.location}
                                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })} />
                        </div>
                        <div className="col-md-2">
                            <input type="date" className="form-control border-0 bg-light rounded-pill px-3" value={searchData.checkin} onChange={(e) => setSearchData({ ...searchData, checkin: e.target.value })} />
                        </div>
                        <div className="col-md-2">
                            <input type="date" className="form-control border-0 bg-light rounded-pill px-3" value={searchData.checkout} onChange={(e) => setSearchData({ ...searchData, checkout: e.target.value })} />
                        </div>
                        <div className="col-md-2">
                            <button onClick={fetchStorages} className="btn btn-primary rounded-pill w-100 fw-bold shadow-sm">
                                <i className="fa fa-search me-2"></i>Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* // barra de busqeuda */}

            <div style={{ display: "flex", height: "100vh" }}>
                <div style={{ width: "50%", overflowY: "scroll", padding: "20px" }}>
                    <h2>Trasteros cercanos</h2>
                    {storages.length === 0 && <p>No hay trasteros disponibles en esta zona.</p>}

                    {storages.map(storage => (
                        <div key={storage.storage_id} style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "15px", marginBottom: "15px", display: "flex", gap: "15px" }} >

                            {/* CONTENEDOR DE IMAGEN CON URL SEGURA */}
                            <div style={{ width: "150px", height: "120px", flexShrink: 0 }}>
                                <img
                                    src={storage.photo || "https://cdn.pixabay.com/photo/2017/02/22/15/55/storage-warehouse-2089775_1280.jpg"}
                                    alt="Storage"
                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://cdn.pixabay.com/photo/2017/02/22/15/55/storage-warehouse-2089775_1280.jpg";
                                    }}
                                />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <h4 style={{ margin: "0 0 5px 0" }}>{storage.address}</h4>
                                <p style={{ margin: "0" }}>{storage.city}</p>
                                <p style={{ margin: "0" }}>{storage.size} m²</p>
                                <p style={{ margin: "5px 0" }}><strong>{storage.price}€ / mes</strong></p>

                                {storage.distance_km !== undefined && storage.distance_km !== null && (
                                    <p className="text-muted" style={{ margin: "0" }}>
                                        <small>A {storage.distance_km} km de tu búsqueda</small>
                                    </p>
                                )}

                                <p style={{ margin: "5px 0 0 0" }}>Status: {storage.status}</p>
                                <button className="btn btn-primary mt-2" onClick={() => navigate(`/client/private/storage/${storage.storage_id}`)} >
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ width: "50%", height: "100vh", background: "grey" }}>
                    <div
                        ref={mapRef}
                        style={{ height: "100vh", width: "100%" }}
                    />
                </div>
            </div>
        </div>
    )
}