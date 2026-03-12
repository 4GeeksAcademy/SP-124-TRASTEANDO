import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStoragesOverview } from "../utilsStorages";

export const SearchHome = () => {
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const autocompleteRef = useRef(null);
    const [storages, setStorages] = useState([]);

    const [searchData, setSearchData] = useState({
        location: "",
        lat: null,
        lng: null,
        checkin: "",
        checkout: ""
    });

    useEffect(() => {
        const initAutocomplete = () => {
            if (!inputRef.current || autocompleteRef.current) return;
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
            autocompleteRef.current.addListener("place_changed", () => {
                const place = autocompleteRef.current.getPlace();
                if (!place.geometry) return;
                setSearchData(prev => ({
                    ...prev,
                    location: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                }));
            });
        };

        if (window.google && window.google.maps && window.google.maps.places) {
            initAutocomplete();
        } else {
            const existingScript = document.getElementById("google-maps-script");
            if (!existingScript) {
                const script = document.createElement("script");
                script.id = "google-maps-script";
                script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = initAutocomplete;
                document.head.appendChild(script);
            } else {
                existingScript.addEventListener("load", initAutocomplete);
            }
        }
    }, []);

    useEffect(() => {
        fetchStorages();
    }, []);

    const fetchStorages = async () => {
        try {
            const data = await getAllStoragesOverview(searchData);
            setStorages(data);
        } catch (error) {
            console.error("Error loading storages:", error);
        }
    };

    const handleSearch = () => {
        if (!searchData.lat || !searchData.lng) {
            alert("Please select a location from the dropdown.");
            return;
        }
        const params = new URLSearchParams({
            loc: searchData.location,
            lat: searchData.lat,
            lng: searchData.lng,
            checkin: searchData.checkin,
            checkout: searchData.checkout
        }).toString();
        navigate(`/search/map?${params}`);
    };

    const scroll = (direction) => {
        const { current } = scrollRef;
        const scrollAmount = 400;
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* SEARCHBAR */}
            <div className="bg-white p-4 d-flex justify-content-center ">
                <div className="search-bar-map w-100" style={{ maxWidth: "850px" }}>
                    <div className="bg-white search-bar-inner shadow-sm border d-flex align-items-center justify-content-between rounded-pill p-2">
                        <div className="search-field border-end flex-grow-1 px-4">
                            <label className="d-block mb-0 text-muted small fw-bold">LOCATION</label>
                            <input ref={inputRef} type="text" className="form-control border-0 p-0 shadow-none fw-bold" placeholder="Where?"
                                value={searchData.location}
                                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })} />
                        </div>
                        <div className="search-field border-end flex-grow-1 px-4">
                            <label className="d-block mb-0 text-muted small fw-bold">FROM</label>
                            <input type="date" className="form-control border-0 p-0 shadow-none fw-bold"
                                value={searchData.checkin}
                                onChange={(e) => setSearchData({ ...searchData, checkin: e.target.value })} />
                        </div>
                        <div className="search-field flex-grow-1 px-4">
                            <label className="d-block mb-0 text-muted small fw-bold">TO</label>
                            <input type="date" className="form-control border-0 p-0 shadow-none fw-bold"
                                value={searchData.checkout}
                                onChange={(e) => setSearchData({ ...searchData, checkout: e.target.value })} />
                        </div>
                        <button onClick={handleSearch} className="btn search-btn text-white ms-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", backgroundColor: "var(--primary-color)" }}>
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* GRID DE TRASTEROS*/}
            <div className="container py-5 position-relative">
                <div className="mb-3 mt-2">
                    <h2 className="ms-2 fw-bold mb-3 text-dark">Recommended Storage Units</h2>
                    <p className="ms-2 text-muted" style={{ maxWidth: "600px" }}>
                        Explore our handpicked selection of top-rated units and grab an exclusive deal to save massive on your rental.
                    </p>
                </div>
                <div className="position-relative slider-container">
                    <button className="tns-custom-btn prev" onClick={() => scroll('left')}>
                        <i className="fa fa-chevron-left"></i>
                    </button>
                    <button className="tns-custom-btn next" onClick={() => scroll('right')}>
                        <i className="fa fa-chevron-right"></i>
                    </button>

                    {/* El carrusel real */}
                    <div className="tns-carousel-manual" ref={scrollRef}>
                        {storages.map(storage => (
                            <div key={storage.id} className="tns-manual-item">
                                <div className="card border rounded-3 overflow-hidden shadow-sm h-100">
                                    <div className="row g-0 align-items-center h-100">

                                        <div className="col-5">
                                            <img
                                                src={storage.photo || "https://cdn.pixabay.com/photo/2017/02/22/15/55/storage-warehouse-2089775_1280.jpg"}
                                                className="img-fluid h-100"
                                                style={{ objectFit: "cover", minHeight: "140px" }}
                                                alt={storage.city}
                                            />
                                        </div>
                                        <div className="col-7">
                                            <div className="card-body p-3">
                                                <h6 className="card-title fw-bold mb-1 text-truncate">Storage in {storage.city}</h6>
                                                <p className="mb-1 small text-muted">{storage.size} m² • 24/7 Access</p>
                                                <p className="mb-2 fw-bold text-primary">€{storage.price} / month</p>
                                                <button className="btn btn-sm btn-outline-primary rounded-pill w-100 mt-1" onClick={() => navigate(`/client/private/storage/${storage.id}`)}>
                                                    View Details </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* FEATURES SECTION */}
            <div className="container pb-5">
                <div className="row g-4 py-4 justify-content-center">
                    <div className="col-md-4">
                        <div className="d-flex align-items-start p-3">
                            <div className="feature-icon-container me-3 d-flex align-items-center justify-content-center"
                                style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#fff4e6", minWidth: "60px" }}>
                                <i className="fa fa-shield text-warning fs-3"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">High Security</h5>
                                <p className="text-muted small mb-0">Advanced surveillance and reinforced locks to keep your belongings safe at all times.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex align-items-start p-3">
                            <div className="feature-icon-container me-3 d-flex align-items-center justify-content-center"
                                style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#91bbf248", minWidth: "60px" }}>
                                <i style={{ color: "#5c73f2" }} className="fa fa-bolt fs-3"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">24 Hours Alert</h5>
                                <p className="text-muted small mb-0">Real-time monitoring and instant notifications for any access to your storage unit.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex align-items-start p-3">
                            <div className="feature-icon-container me-3 d-flex align-items-center justify-content-center"
                                style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#f241703d", minWidth: "60px" }}>
                                <i style={{ color: "#f24171" }} className="fa fa-key fs-3"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Easy Access</h5>
                                <p className="text-muted small mb-0">Manage your unit and access codes directly from your smartphone, whenever you need.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};