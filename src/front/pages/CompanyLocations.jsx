import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const CompanyLocations = () => {

  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const getAvailableToken = () => {
    return localStorage.getItem("token_company") || localStorage.getItem("admin_token");
  }

  useEffect(() => {
    const token = getAvailableToken();

    if (!token) {
      navigate("/companies/login")
      return
    }

    const url = `${import.meta.env.VITE_BACKEND_URL}/mycompany/locations-overview`

    fetch(url, {
      headers: {
        "Authorization": "Bearer " + token,
      },
    })
      .then(response => response.json())
      .then(data => {
        setLocations(data);
        setLoading(false)
      })
      .catch(error => {
        console.error(error)
        setLoading(false)
      })

  }, [])

  const handleDelete = (locationId) => {
    const token = localStorage.getItem("token_company")
    if (!token) return

    if (!window.confirm("Are you sure you want to delete this location?")) return

    fetch(`${import.meta.env.VITE_BACKEND_URL}/private/company/locations/${locationId}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then(response => {
        if (!response.ok) throw new Error("Delete failed")
        setLocations(prevLocations => prevLocations.filter(location => location.id !== locationId))
      })
  }

  if (loading) return <h2>Loading locations...</h2>;
  if (locations.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
                <h3 className="mb-0">
                  No Locations Found
                </h3>
              </div>
              <div className="card-body py-4">
                <div className="d-flex flex-column align-items-center gap-3">
                  <button className="btn btn-secondary-custom shadow"
                    onClick={() => navigate("/companies/private/locations/create")}>
                    Create Location
                  </button>
                  <button
                    className="btn btn-outline-secondary shadow"
                    onClick={() => navigate("/companies/private")}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-5 px-5">
      <div className="row mb-5">
        <div className="col-12 col-xl-10 mx-auto">
          <div className="card shadow-lg border-0">

            <div className="card-header header-primary text-info-emphasis text-center py-4">
              <h4 className="mb-0 fw-bold" style={{ textShadow: "0px 4px 12px rgba(0,0,0,0.3)" }}>
                Locations of {locations[0]?.company_name}
              </h4>
            </div>

            <div className="card-body bg-light">
              <div className="row g-3">

                {locations.map((location) => {
                  const occupancyPercentage =
                    location.total_storages > 0
                      ? Math.round((location.occupied_storages / location.total_storages) * 100)
                      : 0;

                  return (
                    <div key={location.id} className="col-12 col-md-6 col-lg-4">
                      <div className="card shadow-sm h-100">
                        {location.photo ? (
                          <img
                            src={location.photo}
                            className="card-img-top"
                            alt="Location"
                            style={{ aspectRatio: "16/9", width: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            className="d-flex justify-content-center align-items-center bg-secondary text-white fw-bold"
                            style={{ aspectRatio: "16/9", width: "100%" }}
                          >
                            No Image
                          </div>
                        )}

                        <div className="card-body">

                          <div className="mb-2">
                            <span className="badge-city fw-bold">
                              {location.city}
                            </span>
                          </div>

                          <p className="mb-2">
                            <strong>Address:</strong> {location.address}
                          </p>

                          {/* Barra de ocupación */}
                          <div className="mb-2">
                            <div className="d-flex justify-content-between mb-2">
                              <small className="fw-bold">
                                Available: {location.occupied_storages}/{location.total_storages}
                              </small>
                              <small className="fw-bold">{occupancyPercentage}%</small>
                            </div>

                            <div className="progress" style={{ height: "10px" }}>
                              <div
                                className="progress-bar progress-bar-custom"
                                role="progressbar"
                                style={{ width: `${occupancyPercentage}%` }}
                                aria-valuenow={occupancyPercentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>

                          <div className="mt-3 d-flex justify-content-between align-items-center">
                            <button
                              className="btn btn-secondary-custom shadow"
                              onClick={() =>
                                navigate(`/companies/private/locations/storages/${location.id}`)
                              }
                            >
                              View Storages
                            </button>

                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-outline-secondary-custom shadow"
                                onClick={() => navigate(`/companies/private/locations/${location.id}`)}
                              >
                                <i className="fa-regular fa-eye"></i>
                              </button>

                              <button
                                className="btn btn-outline-secondary-custom shadow"
                                onClick={() =>
                                  navigate(`/companies/private/locations/edit/${location.id}`)
                                }
                              >
                                <i className="fa-solid fa-pencil"></i>
                              </button>

                              <button
                                className="btn btn-outline-danger shadow"
                                onClick={() => handleDelete(location.id)}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="card-footer bg-white border-0 py-3">
                <div className="d-flex flex-column align-items-center gap-3">
                  <button className="btn btn-secondary-custom shadow"
                    onClick={() => navigate("/companies/private/locations/create")}>
                    Create Location
                  </button>
                  <button
                    className="btn btn-secondary-custom shadow"
                    onClick={() => navigate("/companies/private")}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};