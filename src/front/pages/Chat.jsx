import React, { useState, useEffect, useRef } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { chatAPI } from "./utilsChat";
import { jwtDecode } from "jwt-decode";
import { createSocket } from "../../socket";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const Chat = () => {
  const { store } = useGlobalReducer();
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [targetId, setTargetId] = useState(null);
  const [targetRole, setTargetRole] = useState(null);
  const [text, setText] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [socket, setSocket] = useState(null);
  const [unread, setUnread] = useState({});

  // Referencias para que el socket siempre vea el chat activo actual
  const activeChatRef = useRef({ targetId: null, targetRole: null });
  const myInfoRef = useRef({ id: null, role: null });
  const messagesEndRef = useRef(null);

  /* ===== USER DATA ===== */
  const decodedClient = store.tokenClient ? jwtDecode(store.tokenClient) : null;
  const decodedCompany = store.company_token ? jwtDecode(store.company_token) : null;
  const myId = decodedClient ? parseInt(decodedClient.sub) : decodedCompany ? parseInt(decodedCompany.sub) : null;
  const myRole = decodedClient ? "client" : decodedCompany ? "company" : null;
  const token = store.tokenClient || store.company_token;

  // Actualizar referencias
  useEffect(() => {
    activeChatRef.current = { targetId, targetRole };
    myInfoRef.current = { id: myId, role: myRole };
  }, [targetId, targetRole, myId, myRole]);

  /* ===== SOCKET INIT ===== */
  useEffect(() => {
    if (!token) return;
    const s = createSocket(token);
    setSocket(s);

    const handleNewMessage = (msg) => {
      const { targetId: tId, targetRole: tRole } = activeChatRef.current;
      const { id: mId, role: mRole } = myInfoRef.current;

      const isForActiveChat =
        tId && tRole && (
          (msg.sender_id === mId && msg.sender_role === mRole &&
            msg.receiver_id === tId && msg.receiver_role === tRole) ||
          (msg.sender_id === tId && msg.sender_role === tRole &&
            msg.receiver_id === mId && msg.receiver_role === mRole)
        );

      if (isForActiveChat) {
        setMessages(prev => {
          // Verificación extra: Si el mensaje ya existe en el estado por ID, no lo añadas
          if (msg.id && prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      } else {
        // Si yo soy el receptor y NO es el chat activo, sumar al badge
        if (msg.receiver_id === mId && msg.receiver_role === mRole) {
          const key = `${msg.sender_id}-${msg.sender_role}`;
          setUnread(prev => ({
            ...prev,
            [key]: (prev[key] || 0) + 1
          }));
        }
      }
    };

    // 1. Limpiamos CUALQUIER listener previo de este evento
    s.removeAllListeners("message:new");

    // 2. Registramos el listener
    s.on("message:new", handleNewMessage);

    return () => {
      s.off("message:new", handleNewMessage);
      s.disconnect();
    };
  }, [token]); // Solo depende del token

  /* ===== LOADS ===== */
  const loadContacts = async () => {
    if (!myId || !myRole) return;
    const data = await chatAPI.getContacts(myId, myRole);
    setContacts(data);
  };

  const loadChat = async () => {
    if (!myId || !targetId || !targetRole) return;
    const history = await chatAPI.getConversation(myId, myRole, targetId, targetRole);
    setMessages(history);
    // Limpiar no leídos al entrar
    setUnread(prev => ({ ...prev, [`${targetId}-${targetRole}`]: 0 }));
  };

  useEffect(() => { loadContacts(); }, [myId, myRole]);
  useEffect(() => { loadChat(); }, [targetId, targetRole]);

  // Scroll automático al último mensaje
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !targetId) return;
    const payload = { sender_id: myId, sender_role: myRole, receiver_id: targetId, receiver_role: targetRole, content: text };
    await chatAPI.send(payload);
    const result = await chatAPI.send(payload);

    if (result) {
      setMessages(prev => [...prev, result]);  // ← el sender ve su mensaje al instante
    }

    setText("");
  };

  /* ===== RENDER ===== */
  return (
    <div className="container-fluid" style={{ height: "calc(100vh - 130px)", display: "flex", flexDirection: "column", padding: "12px" }}>
      <div className="row flex-grow-1" style={{ overflow: "hidden", minHeight: 0 }}>

        {/* PANEL IZQUIERDO */}
        <div className="col-md-4 col-lg-3 border-end bg-white d-flex flex-column" style={{ overflow: "hidden", height: "100%" }}>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="m-0">Mensajes</h5>
            <button
              className="btn btn-sm"
              style={{ backgroundColor: "#5C73F2", color: "#fff", border: "none" }}
              onClick={async () => {
                const endpoint = myRole === "client" ? "/companies" : "/clients";
                const resp = await fetch(`${API_URL}${endpoint}`);
                const all = await resp.json();
                const filtered = all.filter(d => !contacts.find(c => c.id === d.id));
                setDirectory(filtered);
                setShowNewChat(true);
              }}
            >
              Nuevo
            </button>
          </div>

          <div className="list-group list-group-flush overflow-auto flex-grow-1">
            {contacts.map(c => {
              const key = `${c.id}-${c.role}`;
              const avatarUrl = c.photo_url || c.photo || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
              return (
                <button
                  key={key}
                  onClick={() => { setTargetId(c.id); setTargetRole(c.role); }}
                  className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
                  style={{
                    backgroundColor: targetId === c.id ? "#5C73F2" : "white",
                    color: targetId === c.id ? "#fff" : "#111827",
                    borderColor: targetId === c.id ? "#5C73F2" : "#dee2e6",
                    borderRadius: "12px",
                    marginBottom: "6px"
                  }}
                >
                  <div className="d-flex align-items-center text-truncate">
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      className="rounded-circle me-2"
                      style={{ width: "35px", height: "35px", objectFit: "cover", border: "1px solid #ccc" }}
                      onError={(e) => { e.target.src = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"; }}
                    />
                    <div className="text-truncate" style={{ maxWidth: "150px" }}>
                      {c.name || c.email}
                    </div>
                  </div>
                  {unread[key] > 0 && (
                    <span className="badge bg-danger rounded-pill">{unread[key]}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="col-md-8 col-lg-9 d-flex flex-column bg-white border rounded" style={{ overflow: "hidden", height: "100%" }}>

          {/* CABECERA con foto */}
          <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              {targetId && (() => {
                const activeContact = contacts.find(c => c.id === targetId && c.role === targetRole);
                const avatarUrl = activeContact?.photo_url || activeContact?.photo || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
                return (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="rounded-circle me-2"
                    style={{ width: "35px", height: "35px", objectFit: "cover" }}
                    onError={(e) => { e.target.src = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"; }}
                  />
                );
              })()}
              <span className="fw-bold">
                {contacts.find(c => c.id === targetId && c.role === targetRole)?.name ||
                  contacts.find(c => c.id === targetId && c.role === targetRole)?.email ||
                  "Selecciona un chat"}
              </span>
            </div>

            {/* BOTÓN BORRAR - Corregido con my_role en la URL */}
            {targetId && (
              <button
                className="btn btn-link text-danger p-0"
                onClick={async () => {
                  if (window.confirm("¿Borrar chat?")) {
                    await fetch(
                      `${API_URL}/messages/conversation/${myId}/${myRole}/${targetId}/${targetRole}`,
                      { method: "DELETE" }
                    );
                    setMessages([]);
                    setTargetId(null);
                    setTargetRole(null);
                    loadContacts();
                  }
                }}
              >
                <i className="fas fa-trash-alt"></i> Borrar
              </button>
            )}
          </div>

          {/* MENSAJES */}
          <div className="flex-grow-1 overflow-auto p-3">
            {!targetId ? (
              <div className="h-100 d-flex align-items-center justify-content-center" style={{ color: "#5C73F2" }}>
                <p>Selecciona una conversación para empezar</p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={m.id || i}
                  className={`d-flex mb-3 ${m.sender_id === myId && m.sender_role === myRole ? "justify-content-end" : "justify-content-start"}`}
                >
                  <div
                    className="p-2 px-3 rounded-pill"
                    style={{
                      maxWidth: "80%",
                      backgroundColor: m.sender_id === myId && m.sender_role === myRole ? "#5C73F2" : "#f0f0f0",
                      color: m.sender_id === myId && m.sender_role === myRole ? "#fff" : "#333"
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={targetId ? "Escribe un mensaje..." : "Selecciona un chat primero"}
                disabled={!targetId}
                onKeyDown={e => e.key === "Enter" && handleSend()}
              />
              <button className="btn"
                style={{
                  backgroundColor: "#5C73F2",
                  borderColor: "#5C73F2",
                  color: "#fff"
                }}
                onClick={handleSend} disabled={!targetId}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DIRECTORIO */}
      {showNewChat && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header text-white" style={{ backgroundColor: "#5C73F2" }}>
                <h5 className="modal-title">Iniciar nueva conversación</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowNewChat(false)}></button>
              </div>
              <div className="modal-body overflow-auto" style={{ maxHeight: "400px" }}>
                <div className="list-group list-group-flush">
                  {directory.length > 0 ? directory.map(d => {
                    const avatarUrl = d.photo_url || d.photo || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
                    return (
                      <button
                        key={d.id}
                        className="list-group-item list-group-item-action d-flex align-items-center py-3"
                        style={{ color: "#0f172a" }}
                        onClick={() => {
                          const role = myRole === "client" ? "company" : "client";
                          setTargetId(d.id);
                          setTargetRole(role);
                          setShowNewChat(false);
                          if (!contacts.find(c => c.id === d.id && c.role === role)) {
                            setContacts(prev => [...prev, { ...d, role, photo_url: avatarUrl }]);
                          }
                        }}
                      >
                        <img
                          src={avatarUrl}
                          alt="avatar"
                          className="rounded-circle me-3"
                          style={{ width: "40px", height: "40px", objectFit: "cover", border: "1px solid #eee" }}
                          onError={(e) => { e.target.src = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"; }}
                        />
                        <div className="fw-bold">{d.name || d.email}</div>
                      </button>
                    );
                  }) : (
                    <div className="text-center p-4" style={{ color: "#5C73F2" }}>
                      No hay nuevos contactos disponibles
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}