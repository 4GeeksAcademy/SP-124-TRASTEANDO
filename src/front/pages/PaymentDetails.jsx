import React, { useState } from "react";

const COLOR = "#5C73F2";

export const PaymentDetails = () => {
  // Estado para la dirección de facturación
  const [billingAddress, setBillingAddress] = useState({
    street: "Calle Ejemplo 123, 4ºB",
    city: "Madrid",
    zip: "28001",
    country: "España"
  });

  // Estado temporal para el formulario del modal
  const [tempAddress, setTempAddress] = useState({ ...billingAddress });

  const handleSaveAddress = () => {
    setBillingAddress({ ...tempAddress });
    // Aquí podrías añadir un fetch (PUT) para guardar en base de datos
  };

  const cards = [
    { id: 1, type: "Visa", last4: "4422", exp: "08/26", name: "David G.", primary: true },
    { id: 2, type: "Mastercard", last4: "8811", exp: "12/25", name: "David G.", primary: false }
  ];

  return (
    <div className="vstack gap-4">
      
      {/* TÍTULO Y BOTÓN AÑADIR */}
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="fw-bold mb-0">Payment Methods</h4>
        <button className="btn btn-sm px-3" style={{ background: COLOR, color: "#fff", borderRadius: 10 }}>
          <i className="bi bi-plus-lg me-2"></i>Add Card
        </button>
      </div>

      {/* GRID DE TARJETAS */}
      <div className="row g-4">
        {cards.map((card) => (
          <div className="col-md-6" key={card.id}>
            <div 
              className="card border-0 shadow-sm p-4 position-relative overflow-hidden" 
              style={{ 
                borderRadius: 20, 
                background: card.primary ? `linear-gradient(135deg, ${COLOR} 0%, #3a4dbd 100%)` : "#fff",
                color: card.primary ? "#fff" : "#333",
                border: card.primary ? "none" : "1px solid #e8eaf6",
                minHeight: "180px"
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <p className="small mb-0 opacity-75">Cardholder</p>
                  <h6 className="fw-bold">{card.name}</h6>
                </div>
                <div className="fw-italic fw-bold fs-5">{card.type}</div>
              </div>
              <div className="mt-auto">
                <h5 className="mb-2" style={{ letterSpacing: "2px" }}>•••• •••• •••• {card.last4}</h5>
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <p className="small mb-0 opacity-75">Expires</p>
                    <p className="mb-0 fw-semibold">{card.exp}</p>
                  </div>
                  {card.primary && <span className="badge bg-white text-primary rounded-pill px-3 py-2 small">Primary</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN DE FACTURACIÓN */}
      <div className="card border shadow-sm rounded-4 p-4 mt-2" style={{ background: "#fff" }}>
        <h6 className="fw-bold mb-3">Billing Address</h6>
        <div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-light border">
          <i className="bi bi-geo-alt fs-4 text-muted"></i>
          <div>
            <p className="mb-1 fw-semibold">Primary Address</p>
            <p className="mb-0 small text-muted">
              {billingAddress.street}<br/>
              {billingAddress.zip} {billingAddress.city}, {billingAddress.country}
            </p>
          </div>
          {/* BOTÓN QUE ABRE EL MODAL */}
          <button 
            className="btn btn-sm ms-auto fw-bold" 
            style={{ color: COLOR }}
            data-bs-toggle="modal" 
            data-bs-target="#addressModal"
          >
            Change
          </button>
        </div>
      </div>

      {/* MODAL DE BOOTSTRAP PARA CAMBIAR DIRECCIÓN */}
      <div className="modal fade" id="addressModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: 20 }}>
            <div className="modal-header border-0 pt-4 px-4">
              <h5 className="modal-title fw-bold">Edit Address</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body px-4">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold">Street and number</label>
                  <input 
                    type="text" className="form-control" style={{ borderRadius: 10 }}
                    value={tempAddress.street}
                    onChange={(e) => setTempAddress({...tempAddress, street: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">City</label>
                  <input 
                    type="text" className="form-control" style={{ borderRadius: 10 }}
                    value={tempAddress.city}
                    onChange={(e) => setTempAddress({...tempAddress, city: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Postal code</label>
                  <input 
                    type="text" className="form-control" style={{ borderRadius: 10 }}
                    value={tempAddress.zip}
                    onChange={(e) => setTempAddress({...tempAddress, zip: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 pb-4 px-4">
              <button type="button" className="btn btn-light px-4" data-bs-dismiss="modal" style={{ borderRadius: 10 }}>Cancelar</button>
              <button 
                type="button" className="btn px-4" data-bs-dismiss="modal"
                style={{ background: COLOR, color: "#fff", borderRadius: 10 }}
                onClick={handleSaveAddress}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};