const CLIENTS_URL = `${import.meta.env.VITE_BACKEND_URL}/clients`;

// Obtain client

export const getClients = async (clientId) => {
    const response = await fetch(`${CLIENTS_URL}/${clientId}`);

    if (!response.ok) {
        throw new  Error("Client not found");
    }

    const data = await response.json();
    return data;
};

// Obtain All Clients

export const getAllClients = async () => {
    const response = await fetch(CLIENTS_URL);

    if (!response.ok) {
        throw new  Error("Get all clients failes");
    }

    const data = await response.json();
    return data;
};

// Create client

export const createClient = async (clientData) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(clientData)
    });

    if (!response.ok) {
        throw new  Error("Create client failed");
    }

    const data = await response.json();
    return data;
};

//Edit client

export const editClient = async (clientId, clientData) => {
    const response = await fetch(`${CLIENTS_URL}/${clientId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(clientData)
    });

    if (!response.ok) {
        throw new  Error("Edit client failed");
    }

    const data = await response.json();
    return data;
};

//Delete client

export const deleteClient = async (clientId) => {
    const response = await fetch(`${CLIENTS_URL}/${clientId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new  Error("Delete client failed");
    }

    const data = await response.json();
    return data;
};