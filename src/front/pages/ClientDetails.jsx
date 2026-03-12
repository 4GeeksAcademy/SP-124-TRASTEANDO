import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClients } from "../utilsClients.js";


export const ClientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);

    useEffect(() => {
        getClients(id)
            .then(setClient)
            .catch(console.error);
    }, [id]);

    if (!client) return <p>Loading client...</p>;

    return (
        <div className="container mt-4">
            <h1>Client Details</h1>
         
        <ul className="list-group mb-3">
            <li className="list-group-item">
               <strong>ID:</strong> {client.id}
            </li>
            <li className="list-group-item">
               <strong>Email:</strong> {client.email}
            </li>
            <li className="list-group-item">
               <strong>Status:</strong>{" "}
               {client.is_active ? "Active" : "Inactive"}
            </li>
        </ul>

        <button className="btn btn-secondary"
                onClick={() => navigate("/clients")}
         >
            Back
         </button>
    </div > 
   );
  };