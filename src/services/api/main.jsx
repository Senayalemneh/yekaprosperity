import { getApiUrl } from "../../utils/getApiUrl";

const API_URL = getApiUrl();

// ---------- Headers ----------
const getHeader = () => {
  return {
    method: "GET",
  };
};

const postHeader = (body, stringify = true, contentType) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": body ? contentType || "application/json" : undefined,
    },
    body: body ? (stringify ? JSON.stringify(body) : body) : null,
  };
};

const formDataHeader = (body, method = "POST") => {
  return {
    method,
    body,
  };
};

const rolePostHeader = (
  body,
  stringify = true,
  contentType = "application/json"
) => {
  const headers = {};

  if (body) {
    headers["Content-Type"] = contentType;
  }

  return {
    method: "POST",
    headers,
    body: body ? (stringify ? JSON.stringify(body) : body) : null,
  };
};

const updateHeader = (body, stringify = true, contentType) => {
  return {
    method: "PUT",
    headers: {
      "Content-Type": body ? contentType || "application/json" : undefined,
    },
    body: body ? (stringify ? JSON.stringify(body) : body) : null,
  };
};

const updateStatusHeader = (body, stringify = true, contentType) => {
  return {
    method: "PATCH",
    headers: {
      "Content-Type": body ? contentType || "application/json" : undefined,
    },
    body: body ? (stringify ? JSON.stringify(body) : body) : null,
  };
};

const deleteHeader = () => {
  return {
    method: "DELETE",
  };
};

// ---------- API Services ----------

// Create new user
export const createUser = (body) => {
  return fetch(`${API_URL}users`, postHeader(body)).then((res) => res.json());
};

// Get all users
export const getAllUsers = () => {
  return fetch(`${API_URL}users`, getHeader()).then((res) => res.json());
};

// Get user by ID
export const getUserById = (id) => {
  return fetch(`${API_URL}users/${id}`, getHeader()).then((res) => res.json());
};

// Update user
export const updateUser = (id, body) => {
  return fetch(`${API_URL}users/${id}`, updateHeader(body)).then((res) =>
    res.json()
  );
};

// Delete user
export const deleteUser = (id) => {
  return fetch(`${API_URL}users/${id}`, deleteHeader()).then((res) =>
    res.json()
  );
};
