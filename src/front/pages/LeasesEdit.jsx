import { useNavigate, useParams } from "react-router-dom"
import { getLease, editLease } from "../utilsLeases"
import { useState,useEffect } from "react"

export const LeasesEdit = () => {

    const navigate = useNavigate()
    const { id } = useParams();


    const [formData, setFormData] = useState({
        start_date: "",
        end_date: "",
        status: false,
        client_id: "",
        storage_id:""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === "status" ? value === "true" : value;
        const newData = { ...formData, [name]: finalValue };
        setFormData(newData);
        localStorage.setItem('editingLease', JSON.stringify(newData));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editLease(id, formData);
            
            localStorage.removeItem('editingLease');
            localStorage.removeItem('editingId');
            navigate("/leases");
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };


    useEffect(() => {
        if (id) {
            const loadLeaseData = async () => {
                try {
                    const lease = await getLease(id);
                
                    if (lease.start_date) lease.start_date = lease.start_date.split('T')[0];
                    if (lease.end_date) lease.end_date = lease.end_date.split('T')[0];

                    setFormData(lease); 
                    localStorage.setItem('editingLease', JSON.stringify(lease));
                } catch (error) {
                    console.error("Error cargando el contrato:", error);
                }
            };
            loadLeaseData();
        }
    }, [id]);


   return (

        <div className="container mt-5">
            <h1 className="text-start mb-4">Edit Lease #{id}</h1>
            
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label d-block text-start fw-bold">Start date</label>
                    <input type="date" className="form-control" name="start_date" value={formData.start_date} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label d-block text-start fw-bold">End date</label>
                    <input type="date" className="form-control" name="end_date" value={formData.end_date} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label d-block text-start fw-bold">Lease Status</label>
                    <select className="form-select" name="status" value={formData.status.toString()} onChange={handleChange}>
                        <option value="true">Active</option>
                        <option value="false">Not Active</option>
                    </select>
                </div>

                <div className="mt-3 p-2 bg-light rounded text-start">
                    <small className="text-muted d-block">Client ID: {formData.client_id}</small>
                    <small className="text-muted d-block">Storage Unit ID: {formData.storage_id}</small>
                </div>

                <div className="d-flex gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary w-50" onClick={() => navigate("/leases")}>Cancel</button>
                    <button type="submit" className="btn btn-primary w-50">Save Changes</button>
                </div>
            </form>
        </div>
    );
}