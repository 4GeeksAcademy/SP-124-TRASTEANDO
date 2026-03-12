const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const COMPANIES_URL = BACKEND_URL + "/companies";

// fetch para eliminar

export const deleteCompany = async (companyId) => {
  const response = await fetch(COMPANIES_URL + "/" + companyId, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Delete failed");
  }
  const data = await response.json();
  return data;
};

// fetch para conseguir una

export const getCompany = async (companyId) => {
  const response = await fetch(COMPANIES_URL + "/" + companyId);

  if (!response.ok) {
    throw Error("Company not found");
  }
  const data = await response.json();
  return data;
};

// fetch para conseguir todas
export const getAllCompanies = async () => {
  const response = await fetch(COMPANIES_URL);

  if (!response.ok) {
    throw Error("Get all companies failed");
  }

  const data = await response.json();
  return data;
};

// fetch para editar

export const editCompany = async (companyId, companyData) => {
  const response = await fetch(COMPANIES_URL + "/" + companyId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(companyData),
  });
  if (!response.ok) {
    throw Error("Update failed");
  }
  const data = await response.json();
  return data;
};

// fetch para crear

export const createCompany = async (companyData) => {
  const response = await fetch(COMPANIES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(companyData),
  });
  if (!response.ok) {
    throw Error("Creation failed");
  }

  const data = await response.json();
  return data;
};
