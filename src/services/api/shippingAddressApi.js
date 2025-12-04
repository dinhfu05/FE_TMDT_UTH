// shippingAddressApi.js
const API_BASE = "http://localhost:8080/api/shipping-address";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
    "Accept": "*/*"
  };
};

const shippingAddressApi = {
  getAll: async (page = 1, size = 10) => {
    try {
      const params = new URLSearchParams({ page, size });
      const response = await fetch(`${API_BASE}?${params}`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ||s `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Get addresses failed:", err);
      throw err;
    }
  },

  create: async (data) => {
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Create address failed:", err);
      throw err;
    }
  },

  update: async (addressId, data) => {
    try {
      const response = await fetch(`${API_BASE}/${addressId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Update address failed:", err);
      throw err;
    }
  },

  delete: async (addressId) => {
    try {
      const response = await fetch(`${API_BASE}/${addressId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Delete address failed:", err);
      throw err;
    }
  },
};

export default shippingAddressApi;
