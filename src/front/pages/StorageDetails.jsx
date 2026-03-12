import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStorageOverview } from "../utilsStorages.js";


export const StorageDetails = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [storage, setStorage] = useState(null);

   useEffect(() => {
      getStorageOverview(id)
         .then((data) => setStorage(data))
         .catch(console.error);
   }, [id]);

   if (!storage) return <p>Loading storage...</p>;

   return (
      <div className="container mt-4">
         <h1>Storage Details</h1>

         <ul className="list-group mb-3">
            <li className="list-group-item">
               <strong>City:</strong> <strong className="text-primary fs-5"> {storage.city}</strong>
            </li>
            <li className="list-group-item">
               <strong>Company:</strong> <strong className="text-secondary"> {storage.company_name}</strong>
            </li>
            <li className="list-group-item">
               <strong>ID:</strong> {storage.id}
            </li>
            <li className="list-group-item">
               <strong>Size:</strong> {storage.size}
            </li>
            <li className="list-group-item">
               <strong>Price:</strong> {storage.price} €
            </li>
            <li className="list-group-item">
                <button onClick={() => console.log(storage.status)} >Ver sotage.status</button>
               <strong>Status:</strong>{" "}
               {!storage.status
                  ? <em className="text-success">Available</em>
                  : <em className="text-danger">Occupied</em>}

            </li>
            <li className="list-group-item">
               <strong>Location ID:</strong> {storage.location_id}
            </li>
         </ul>

         <button className="btn btn-secondary"
            onClick={() => navigate(-1)}
         >
            Back
         </button>
      </div >
   );
};