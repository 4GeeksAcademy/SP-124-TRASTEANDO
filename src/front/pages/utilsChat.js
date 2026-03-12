const API_URL = import.meta.env.VITE_BACKEND_URL;

export const chatAPI = {
  send: async (data) => {
    const resp = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });
    return resp.ok ? await resp.json() : null;
  },

  getConversation: async (myId, myRole, targetId, targetRole) => {
    const resp = await fetch(
      `${API_URL}/messages/conversation/${myId}/${myRole}/${targetId}/${targetRole}`,
    );
    return resp.ok ? await resp.json() : [];
  },

  getContacts: async (myId, myRole) => {
    const resp = await fetch(
      `${API_URL}/messages/contacts/${myId}/${myRole}`,
    );
    console.log("API_URL:", API_URL);
    return resp.ok ? await resp.json() : [];
  },
};
