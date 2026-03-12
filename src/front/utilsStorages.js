const STORAGES_URL = `${import.meta.env.VITE_BACKEND_URL}/storage`;

// Get one storage

export const getStorage = async (storageId) => {
  const response = await fetch(`${STORAGES_URL}/${storageId}`);

  if (!response.ok) {
    throw new Error("Storage not found");
  }

  const data = await response.json();
  return data;
};

// Get All Storages

export const getAllStorages = async () => {
  const response = await fetch(STORAGES_URL);

  if (!response.ok) {
    throw new Error("Get all storages failed");
  }

  const data = await response.json();
  return data;
};

// Create storage

export const createStorage = async (storageData) => {
  console.log(storageData);
  const response = await fetch(STORAGES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(storageData),
  });

  console.log(response);
  // if (!response.ok) {
  //     throw new  Error("Create storage failed");
  // }

  // const data = await response.json();
  // return data;
};

// Edit storage

export const editStorage = async (storageId, storageData) => {
  const response = await fetch(`${STORAGES_URL}/${storageId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(storageData),
  });

  if (!response.ok) {
    throw new Error("Edit storage failed");
  }

  const data = await response.json();
  return data;
};

// Delete storage

export const deleteStorage = async (storageId) => {
  const response = await fetch(`${STORAGES_URL}/${storageId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Delete storage failed");
  }

  const data = await response.json();
  return data;
};

// Get all Storage Overview

export const getAllStoragesOverview = async () => {
  const response = await fetch(`${STORAGES_URL}/overview`);

  if (!response.ok) {
    throw new Error("Get all storages overview failed");
  }

  const data = await response.json();
  return data;
};

// Get one Storage Overview

export const getStorageOverview = async (storageId) => {
  const response = await fetch(`${STORAGES_URL}/${storageId}/overview`);

  if (!response.ok) {
    throw new Error("Storages overview failed");
  }

  const data = await response.json();
  return data;
};

// Get all storages by company

export const getCompanyStorage = async () => {
  const token = localStorage.getItem("token_company");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const response = await fetch(`${backendUrl}/company/storages/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch company storages");
  }

  return await response.json();
};

// Get sotrafes para el Mapa de google(markers)
export const getStoragesForMap = async () => {
  const response = await fetch(`${STORAGES_URL}/map`);

  if (!response.ok) {
    throw new Error("Map storages failed");
  }
  const data = await response.json();
  return data;
};

// get para el mapa filtrado por cercania ubicacion latitud lng etc
export const getNearbyStorages = async (lat, lng) => {
    // validacion para prevenir
    if (!lat || !lng) {
        console.warn("getNearbyStorages: Latitud o Longitud faltantes");
        return []; 
    }

    try {
        const params = new URLSearchParams({ lat, lng });
        const response = await fetch(`${STORAGES_URL}/map?${params}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al obtener trasteros cercanos');
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getNearbyStorages:", error);
        throw error;
    }
};

// para filtrar por fechas
export const getStoragesFiltered = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.lat) params.append('lat', filters.lat);
    if (filters.lng) params.append('lng', filters.lng);
    if (filters.checkin) params.append('checkin', filters.checkin);
    if (filters.checkout) params.append('checkout', filters.checkout);
    
    const url = `${STORAGES_URL}/map?${params}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Filtered storages failed');
    return await response.json();
};


