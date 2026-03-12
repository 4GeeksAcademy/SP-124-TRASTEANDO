import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStoragesOverview, deleteStorage, getCompanyStorage } from "../utilsStorages.js";
import { getUserRole } from "../store.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const StorageList = () => {
    const { store } = useGlobalReducer();
    const role = getUserRole(store);
    const [storages, setStorages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load Storages
    const loadStorages = () => {
        setLoading(true);

        const fetchFunction = role === "company"
            ? getCompanyStorage()
            : getAllStoragesOverview()

        fetchFunction
            .then(data => {
                console.log(`Storages cargados (${role}):`, data)

                setStorages(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando storages:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadStorages()
    }, [role]);

    //Delete

    const handleDelete = (id) => {
        if (!confirm("Are you sure to delete this storage?"))
            return;

        deleteStorage (id)
            .then(loadStorages)
            .catch(err => console.error(err));
    };

    if (loading) return <p>Loading storages...</p>;


    return (
        <div className="container mt-4">

            <div className="d-flex gap-3 mb-4 justify-content-center">

                {/* Solo Admin y Company pueden crear storages */}
                {(role === "admin" || role === "company") && (
                <button className="btn btn-success"
                    onClick={() => navigate("/storages/create")}
                >
                        Create Storage
                </button>

                )}
            </div>          

        {storages.length === 0 ? (
            <p>No storages found</p>
        ) : (
        <ul className="list-group">
            {storages.map(storage => (
                <li
                    key={storage.id}
                    className="list-group-item d-flex 
                             justify-content-between align-items-center"
                >
                    <span>
                        <strong className= "text-primary fs-4" >{storage.city}</strong> 
                        {role !== "company" && (
                            <> - <strong className="text-secondary">{storage.company_name}</strong></>
                        )}
                         - {storage.size} - {storage.price} € - {storage.status === "Available" ? 
                         <em className="text-success"> Available</em> : <em className="text-danger"> Occupied</em>}
                    </span>

                    <div>
                        <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => navigate(`/storages/${storage.id}`)}
                        >
                            Details
                        </button>
                            
                            {/* Solo Admin y Company pueden editar */}

                        {(role === "admin" || role === "company" ) && (    
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => navigate(`/storages/${storage.id}/edit`)}
                          >
                            Edit
                          </button>
                        )}

                            {/* Solo Admin y Company pueden editar */}
                        
                        {(role === "admin" || role === "company" ) && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(storage.id)}
                          >
                            Delete
                          </button>
                        )}

                            {/* Solo Client puede alquilar,si está disponible */}

                        {role === "client" && storage.status  === "Available" && (
                          <button 
                            className="btn btn-sm btn-warning"
                            onClick={() => navigate(`/leasesCreate?storage_id=${storage.id}`)}
                          >
                            Rent
                          </button>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    )}  
                      </div > 
                    );
                };