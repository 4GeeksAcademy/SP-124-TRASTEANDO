export const initialStore = () => {
  const tokenClient = localStorage.getItem("tokenClient");
  const tokenCompany = localStorage.getItem("token_company");
  const tokenAdmin = localStorage.getItem("admin_token");

  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
    tokenClient: tokenClient || null,
    authClient: !!tokenClient,

    company_token: tokenCompany || null,
    auth_company: !!tokenCompany,

    admin_token: tokenAdmin || null,
  };
};

export const getUserRole = (store) => {
  if (store.admin_token) return "admin";
  if (store.company_token) return "company";
  if (store.tokenClient) return "client";

  return null; // User not login
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };
    case "set_auth_admin":
      localStorage.setItem("admin_token", action.payload.token);
      localStorage.removeItem(
        "admin_info",
        JSON.stringify(action.payload.admin),
      );
      return {
        ...store,
        admin_token: action.payload.token,
        admin_info: action.payload.admin,
        auth_admin: true,
      };

    case "logout_admin":
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_info");
      return {
        ...store,
        admin_token: null,
        admin_info: null,
        auth_admin: false,
      };

    case "set_admin_info":
      return { ...store, admin_info: action.payload, auth_admin: true };

    case "set_auth_company": {
      const tokenCompany = localStorage.getItem("token_company");
      return {
        ...store,
        auth_company: !!tokenCompany,
        company_token: tokenCompany,
      };
    }

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo,
        ),
      };

    case "set_auth_client": {
      const { tokenClient } = action.payload;
      return { ...store, tokenClient, authClient: true };
    }

    case "logout_client":
      return { ...store, tokenClient: null, authClient: false };

    case "LOGOUT":
      return {
        ...store,
        tokenClient: null,
        authClient: false,
        admin_token: null,
        company_token: null,
        auth_company: false,
      };

    default:
      return store;
  }
}
