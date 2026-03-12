const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const LEASES_URL = BACKEND_URL + "api/leases";

// fetch para eliminar
export const deleteLease = async (leaseId) => {
  const response = await fetch(LEASES_URL + "/" + leaseId, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Delete failed");
  }
  const data = await response.json();
  return data;
};

// fetch para conseguir una

export const getLease = async (leaseId) => {
  const response = await fetch(LEASES_URL + "/" + leaseId);

  if (!response.ok) {
    throw Error("Lease not found");
  }
  const data = await response.json();
  return data;
};

// fetch pra conseguir todas

export const getAllLeases = async () => {
  const response = await fetch(LEASES_URL);

  if (!response.ok) {
    throw Error("Get all leases failed");
  }

  const data = await response.json();
  return data;
};

// fetch para editar

export const editLease = async (leaseId, leaseData) => {
  const response = await fetch(LEASES_URL + "/" + leaseId, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(leaseData),
  });
  if (!response.ok) {
    throw Error("Update failed");
  }
  const data = await response.json();
  return data;
};

// fetch para crear un lease

export const createLease = async (leaseData) => {
  const response = await fetch(LEASES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leaseData),
  });

  if (!response.ok) {
    throw Error("Lease creation failed");
  }
  const data = await response.json();
  return data;
};

// nueva funcion para que funcione el lease d cliente privado

export const createClientLease = async (leaseData, token) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const response = await fetch(`${backendUrl}/client/leases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(leaseData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error en el área privada");
  }
  return await response.json();
};

// delete lease de cliente con cuenta logeada

export const deleteClientLease = async (leaseId, token) => {
  const response = await fetch(BACKEND_URL + "/client/leases/" + leaseId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("No se pudo eliminar el contrato");
  }
  return await response.json();
};

// fetch de limpieza que va  a llamar Layout para borrar los leases que no se hayan pagado

export const clearPendingLeases = async (token) => {
  const response = await fetch (BACKEND_URL+ '/client/leases/clear-pending', {
    method: 'DELETE',
    headers:{
      "Authorization": `Bearer ${token}`
    }
  });
  return response.ok
}