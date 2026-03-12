const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Fetch para conseguir todos
export const getAdminUsers = async() =>{
    const response = await fetch(BACKEND_URL + "/admin_user")

    const data = await response.json()

    return data
}


// Fetch para conseguir uno
export const getAdminUser = async(id) =>{
    const response = await fetch(BACKEND_URL + "/admin_user/" + id)

    const data = await response.json()
    
    return data
}


//Fetch para crear
export const createAdminUsers = async (name, email, password) => {
    const response = await fetch(`${BACKEND_URL}/admin_user`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ name, email, password })
    })

    if (response.status !== 201) {
        return null
    }

    return await response.json()
}


//Fetch para editar
export const updateAdminUsers = async (id, name, email, password) => {
    const response = await fetch(`${BACKEND_URL}/admin_user/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ name, email, password })
    })

    if (response.status !== 200) {
        return null;
    }

    return await response.json()
}




// Fetch para eliminar
export const deleteAdminUsers = async(adminUserId) => {
    const response = await fetch(`${BACKEND_URL}/admin_user/${adminUserId}`,{
        method: "DELETE"
    })
    return response.status === 200
}

// Login Admin

export const loginAdmin = async (email, password, dispatch) => {
    try{
        const response = await fetch(`${BACKEND_URL}/login/admin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Login failed");
        }

        const data = await response.json();

        dispatch({
            type: "set_admin_login",
            payload: {
                token: data.admin_token,
                admin: data.admin
            }
        });

        return { success: true};
    } catch (error) {
        console.error(error);
        return { success: false, error: error.message };
    }
};

export const verifyAdminToken = async (token, dispatch) => {
    try {
        const response = await
fetch (`${BACKEND_URL}/private/admin`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
    });

    if (!response.ok) {
        throw new Error("Token inválido");
    }

    const data = await response.json();

    dispatch({
        type: "set_admin_info",
        payload: data
    });

    return { success: true };
  } catch (error) {
      console.error("Error verifying token:", error);

      dispatch({ type: "logout_admin" });

      return { success: false, error: error.message };
  }
};  

export const logoutAdmin = (dispatch) => {
    dispatch({ type: "logout_admin" });
};