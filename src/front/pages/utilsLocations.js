const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Fetch para conseguir todos
export const getLocations = async() => {
    const response = await fetch(BACKEND_URL + "/location")

    const data = await response.json()

    return data
}


// Fetch para conseguir uno
export const getLocation = async(id) => {
    const response = await fetch(BACKEND_URL + "/location/" + id)

    const data = await response.json()

    return data
}


// Fetch para crear
export const createLocations = async (address, city, latitude, longitude, company_id) => {
    const response = await fetch(`${BACKEND_URL}/location`,{
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ address, city, latitude, longitude, company_id })
    })

    if (response.status !== 201) {
        return null
    }

    return await response.json()
}


// Fetch para editar
export const updateLocations = async (Id, address, city, latitude, longitude, company_id) => {    
    const response = await fetch(`${BACKEND_URL}/location/${Id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ address, city, latitude, longitude, company_id })
    })
    
    const data = await response.json();
    return data;
}


// Fetch para eliminar
export const deleteLocations = async(locationId) => {
    const response = await fetch(`${BACKEND_URL}/location/${locationId}`, {
        method: "DELETE"
    })
    return response.ok
}
