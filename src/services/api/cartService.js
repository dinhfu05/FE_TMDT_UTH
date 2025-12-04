// cartService.js

const API_BASE = "http://localhost:8080/api/customer/cart";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
};

const cartService = {
  /** Lấy toàn bộ cart */
  getCart: async () => {
    try {
      const response = await fetch(API_BASE, {
        headers: getHeaders(),
      });

      const json = await response.json();
      return json.success ? json.data : null;
    } catch (error) {
      console.error("Get cart failed:", error);
      return null;
    }
  },

  /** Lấy tổng số lượng giỏ hàng */
  getCartCount: async () => {
    try {
      const cart = await cartService.getCart();
      if (!cart || !cart.cartItemResponseDTOs) return 0;

      return cart.cartItemResponseDTOs.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    } catch (error) {
      console.error("Get cart count failed:", error);
      return 0;
    }
  },

  /** Thêm sản phẩm vào cart */
  // addToCart: async (productDetailId, quantity = 1) => {
  //   try {
  //     const response = await fetch(`${API_BASE}/items`, {
  //       method: "POST",
  //       headers: getHeaders(),
  //       body: JSON.stringify({ productDetailId, quantity }),
  //     });

  //     const json = await response.json();
  //     return json.success ? json.data : null;
  //   } catch (error) {
  //     console.error("Add to cart failed:", error);
  //     return null;
  //   }
  // },

  /** Cập nhật số lượng */
  updateQuantity: async (cartItemId, quantity) => {
    try {
      const response = await fetch(
        `${API_BASE}/items/${cartItemId}?quantity=${quantity}`,
        {
          method: "PATCH",
          headers: getHeaders(),
        }
      );

      const json = await response.json();
      return json.success ? json.data : null;
    } catch (error) {
      console.error("Update quantity failed:", error);
      return null;
    }
  },

  /** Xóa sản phẩm khỏi cart */
  removeItem: async (cartItemId) => {
    try {
      const response = await fetch(`${API_BASE}/items/${cartItemId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const json = await response.json();
      return json.success ? json.data : null;
    } catch (error) {
      console.error("Remove item failed:", error);
      return null;
    }
  },
};

export default cartService;
