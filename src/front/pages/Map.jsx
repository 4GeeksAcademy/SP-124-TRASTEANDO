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

    useEffect(() => {
        fetchStorages();
    }, [searchData.lat, searchData.lng, searchData.checkin, searchData.checkout]);


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
            content: `
                <div class="custom-info-window" id="info-${storage.storage_id}">
                    <img src="${storage.photo || "https://cdn.pixabay.com/photo/2017/02/22/15/55/storage-warehouse-2089775_1280.jpg"}" alt="Storage">
                    <div class="info-text">
                        <h6>${storage.size} m² en ${storage.city}</h6>
                        <p>${storage.price}€ <span style="font-size:14px; font-weight:normal; color:#717171;">/ mes</span></p>
                    </div>
                </div>
            `
        });

        marker.addListener("click", () => {
            
            infoWindow.open(mapInstance.current, marker);
        });

        window.google.maps.event.addListener(infoWindow, 'domready', () => {
            const popup = document.getElementById(`info-${storage.storage_id}`);
            if (popup) {                
                popup.addEventListener('click', () => {
                    navigate(`/client/private/storage/${storage.storage_id}`);
                });
            }
        });

        markersRef.current.push(marker);
    });
}, [storages, mapReady]);


   return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>  
        <div className="bg-white mb-5 m-5 z-3 d-flex justify-content-center">
            <div className="search-bar-map w-100" style={{ maxWidth: "800px" }}>
                <div className="bg-white search-bar-inner shadow-sm border d-flex align-items-center justify-content-between rounded-pill p-2">
                    <div className="search-field border-end flex-grow-1 px-3">
                        <label className="d-block mb-0">Location</label>
                        <input ref={inputRef} type="text" className="form-control border-0 p-0 shadow-none fw-bold" placeholder="Where?" 
                            value={searchData.location || ""} 
                            onChange={(e) => setSearchData({ ...searchData, location: e.target.value })} />
                    </div>
                    <div className="search-field border-end flex-grow-1 px-3">
                        <label className="d-block mb-0">From</label>
                        <input type="date" className="form-control border-0 p-0 shadow-none fw-bold" 
                            value={searchData.checkin || ""} 
                            onChange={(e) => setSearchData({ ...searchData, checkin: e.target.value })} />
                    </div>
                    <div className="search-field flex-grow-1 px-3">
                        <label className="d-block mb-0">To</label>
                        <input type="date" className="form-control border-0 p-0 shadow-none fw-bold" 
                            value={searchData.checkout || ""} 
                            onChange={(e) => setSearchData({ ...searchData, checkout: e.target.value })} />
                    </div>
                    <button onClick={fetchStorages} className="btn search-btn text-white ms-2">
                        <i className="fa fa-search"></i>
                    </button>
                </div>
            </div>
        </div>

        <div className="map-view-containe ps-3 d-flex flex-grow-1 overflow-hidden">
            <div className="map-list-section custom-scrollbar p-1" style={{ width: "50%", overflowY: "auto" }}>
                <p className="text-dark fw-bold mb-4 fs-5">{storages.length} trasteros disponibles</p>
                
                <div className="airbnb-cards-grid">
                    {storages.map(storage => (
                        <div key={storage.storage_id} className="airbnb-grid-card" onClick={() => navigate(`/client/private/storage/${storage.storage_id}`)}>
                            <div className="img-container">
                                <img src={storage.photo || "https://cdn.pixabay.com/photo/2017/02/22/15/55/storage-warehouse-2089775_1280.jpg"} alt="Storage" />
                            </div>
                            <div className="card-info mt-2">
                                <p className="fw-bold mb-0 text-truncate">Trastero en {storage.city}</p>
                                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>{storage.size} m² • 24/7</p>
                                <p className="mt-1 mb-0"><span className="fw-bold">{storage.price}€</span> / mes</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="map-section" style={{ width: "50%", position: "relative", borderRadius:"15px 15px 0 0", overflow:"hidden" }}>
                <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
            </div>
        </div>
    </div>
);
}