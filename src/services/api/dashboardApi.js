const API_BASE = "http://localhost:8080/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
};

const dashboardApi = {
  getOrders: (page = 1, size = 9999) =>
    fetch(`${API_BASE}/orders?page=${page}&size=${size}`, {
      headers: getHeaders(),
    }).then(res => res.json()),

  getCustomers: (page = 1, size = 9999) =>
    fetch(`${API_BASE}/customer?page=${page}&size=${size}`, {
      headers: getHeaders(),
    }).then(res => res.json()),

  getProducts: (page = 1, size = 9999) =>
    fetch(`${API_BASE}/product?page=${page}&size=${size}`, {
      headers: getHeaders(),
    }).then(res => res.json()),

  getReviews: (productId) =>
    fetch(`${API_BASE}/product/${productId}/reviews`, {
      headers: getHeaders(),
    }).then(res => res.json()),
};

export default dashboardApi;
