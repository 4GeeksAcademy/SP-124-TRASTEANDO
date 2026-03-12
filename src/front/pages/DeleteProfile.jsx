import React from "react";

export const DeleteProfile = () => {
  return (
    <div className="card border border-danger shadow-sm rounded-4 p-4" style={{ background: "#fff" }}>
      <h5 className="fw-bold text-danger mb-3">Delete Account</h5>
      <p className="text-muted">
        Once you delete your account, there's no going back. Please make sure you don't have any active rentals.
      </p>
      <div className="form-check mb-4">
        <input className="form-check-input" type="checkbox" id="confirmDelete" />
        <label className="form-check-label small" htmlFor="confirmDelete">
          I understand the consequences and wish to proceed.
        </label>
      </div>
      <button className="btn btn-danger px-4" style={{ borderRadius: 10 }}>
        Permanently delete my account
      </button>
    </div>
  );
};