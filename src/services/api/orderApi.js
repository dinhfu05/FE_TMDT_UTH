// orderApi.js
const API_BASE = "http://localhost:8080/api/orders";
const ZALOPAY_BASE = "http://localhost:8080/api/zalopay";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    Accept: "*/*",
  };
};

const orderApi = {
  create: async ({
    addressShippingId,
    paymentMethod,
    orderDetailRequestDTOs,
  }) => {
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          addressShippingId,
          paymentMethod,
          orderDetailRequestDTOs,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (err) {
      console.error("Order creation failed:", err);
      throw err;
    }
  },

  // Lấy danh sách đơn hàng của user
  getMyOrders: async ({ page = 1, size = 20 } = {}) => {
    try {
      const response = await fetch(`${API_BASE}/me?page=${page}&size=${size}`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (err) {
      console.error("Get my orders failed:", err);
      throw err;
    }
  },

  // Lấy chi tiết 1 đơn hàng
  getById: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE}/${orderId}`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (err) {
      console.error("Get order failed:", err);
      throw err;
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE}/${orderId}/canceled`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (err) {
      console.error("Cancel order failed:", err);
      throw err;
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateStatus: async (orderId, status) => {
    try {
      const response = await fetch(`${API_BASE}/${orderId}?status=${status}`, {
        method: "PATCH",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (err) {
      console.error("Update order status failed:", err);
      throw err;
    }
  },

  createZaloPayOrder: async (orderId, description) => {
    try {
      const response = await fetch(`${ZALOPAY_BASE}/create-order`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          orderId,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (err) {
      console.error("ZaloPay order creation failed:", err);
      throw err;
    }
  },
};

export default orderApi;
