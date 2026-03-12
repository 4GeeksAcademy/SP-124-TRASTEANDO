import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { getAllStoragesOverview } from "../utilsStorages";
import videoBg from "../assets/img/video.mp4";

export const Home = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const storageSectionRef = useRef(null);

  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lógica para el texto que cambia
  const words = ["Home", "Office", "Garage", "Business"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [searchData, setSearchData] = useState({
    location: "", lat: null, lng: null, checkin: "", checkout: ""
  });

  // cambiador de palabra
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToStorages = () => {
    storageSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

    if (window.google?.maps?.places) {
      initAutocomplete();
    } else {
      const existingScript = document.getElementById("google-maps-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => initAutocomplete();
        document.head.appendChild(script);
      }
    }
  }, []);

  useEffect(() => {
    const fetchStorages = async () => {
      try {
        setLoading(true);
        const data = await getAllStoragesOverview(searchData);
        setStorages(data);
      } catch (error) {
        console.error("Error loading storages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStorages();
  }, []);

  const handleSearch = () => {
    if (!searchData.lat || !searchData.lng) {
      alert("Please select a location from the dropdown.");
      return;
    }
    const params = new URLSearchParams(searchData).toString();
    navigate(`/search/map?${params}`);
  };

  return (

    <div className="hero-section">
      <div className="container">
        <div className="row align-items-center min-vh-75">
          <div className="col-lg-5 ps-lg-2 pe-lg-4 py-4 content-side">
            <h1 className="display-4 fw-bold mb-4" style={{ fontSize: '3.2rem' }}>
              Organized and Accessible Storage for Your
              <span className="dynamic-text-container">
                <span key={words[currentWordIndex]} className="dynamic-text">
                  {words[currentWordIndex]}
                </span>
              </span>
            </h1>
            <p className="lead text-muted mt-3 mb-3">
              Modern facilities, maximum security, and the best prices in your city.
            </p>

            <div className="d-flex align-items-center mb-3">
              <button className="btn btn-primary-custom rounded-pill px-5 py-3 shadow-sm"
                onClick={scrollToStorages}>Discover now </button>
            </div>
          </div>
          <div className="col-lg-7 d-none d-lg-block ps-lg-4 pe-lg-5 py-5">
            <div className="position-relative h-100">
              <img src="https://images.unsplash.com/photo-1551313158-73d016a829ae?q=80&w=2037&auto=format&fit=crop" alt="Storage facility" className="img-fluid shadow-sm"
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "50px",
                  minHeight: "700px",
                }}
              />
              <div className="support-badge position-absolute shadow-lg text-center z-3">
                <span className="d-block fw-bold fs-5 text-danger">🎧 24/7</span>
                <small className="text-muted fw-bold">Customer Support</small>
              </div>
            </div>
          </div>
        </div>

        {/* searchbar */}
        <div className="search-bar-container mx-auto position-relative mt-2 mb-2">
          <h6 className="fw-bold mb-3 ms-4 text-dark">Search your storage</h6>
          <div className="bg-white search-bar-inner shadow-lg d-flex align-items-center justify-content-between">
            <div className="search-field border-end flex-grow-1">
              <label className="d-block mb-0">Location</label>
              <input ref={inputRef} type="text" className="form-control border-0 p-0 shadow-none fw-bold" placeholder="Where do you need it?" />
            </div>
            <div className="search-field border-end flex-grow-1">
              <label className="d-block mb-0">From</label>
              <input type="date" className="form-control border-0 p-0 shadow-none fw-bold" onChange={(e) => setSearchData({ ...searchData, checkin: e.target.value })} />
            </div>
            <div className="search-field flex-grow-1">
              <label className="d-block mb-0">To</label>
              <input type="date" className="form-control border-0 p-0 shadow-none fw-bold" onChange={(e) => setSearchData({ ...searchData, checkout: e.target.value })} />
            </div>
            <button onClick={handleSearch} className="btn search-btn text-white ms-2">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>

        {/* storages section con circulitos*/}
        <div className="py-4 mt-2" ref={storageSectionRef}>
          <div className="text-center mb-4 mt-3">
            <h2 className="fw-bold secondary-hero-title">Find the best Storages close to you</h2>
            <p className="text-muted">Explore our high-security facilities across the country</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-4 justify-content-center">
              {storages.slice(0, 12).map((storage) => (
                <div key={storage.id} className="col">
                  <div className="nearby-card card h-100" onClick={() => navigate(`/client/private/storage/${storage.id}`)} >
                    <div className="nearby-img-container">
                      <img src={storage.photo || "https://trasteroencaceres.es/wp-content/uploads/2019/07/self-storage.jpg"}
                        alt={storage.city} />
                    </div>
                    <div className="nearby-content">
                      <div className="nearby-title">{storage.city}</div>
                      <div className="nearby-subtitle">{storage.price}€ / month</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-4 justify-content-center">
            {storages.slice(0, 12).map((storage) => (
              <div key={storage.id} className="col">
                <div className="nearby-card card h-100" onClick={() => navigate(`/client/private/storage/${storage.id}`)} >
                  <div className="nearby-img-container">
                    <img src={storage.photo || "https://images.unsplash.com/photo-1581404917829-https://images.unsplash.com/photo-1551313158-73d016a829ae?q=80&w=2037&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&q=80&w=400"}
                      alt={storage.city} />
                  </div>
                  <div className="nearby-content">
                    <div className="nearby-title">{storage.city}</div>
                    <div className="nearby-subtitle">{storage.price}€ / month</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* final debajo storages video */}

      <div className="container my-5">
        <div className="reserve-banner-video shadow-lg position-relative overflow-hidden">
          <video src={videoBg} autoPlay loop muted playsInline className="reserve-video-bg" />
          <div className="reserve-content-overlay">
            <h2 className="fw-extrabold display-3">
              Reserve your storage unit <br />
              <span style={{ color: '#f24171' }}>in minutes</span>
            </h2>
            <p className="text-white" style={{ maxWidth: '770px' }}>
              Experience the convenience of modern storage. Secure, accessible, and
              tailored to your needs. Start your journey with us today.
            </p>
            <button className="btn btn-glass-custom text-uppercase" onClick={() => navigate("/search/map")}>
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};