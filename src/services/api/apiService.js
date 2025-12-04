// apiService.js

const API_BASE_URL = "http://localhost:8080/api";
export const IMAGE_BASE_URL = `http://localhost:8080/api/image`;

// Helper: Lấy token từ localStorage
const getToken = () => localStorage.getItem("token") || "MOCK_TOKEN";

// Product Service
export const productService = {
  getAllProducts: async (page = 1, size = 10, categoryId = null) => {
    try {
      const params = new URLSearchParams({ page, size });
      if (categoryId) params.append("categoryId", categoryId);
      const response = await fetch(`${API_BASE_URL}/product?${params}`);
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  // Lấy chi tiết sản phẩm (Cập nhật để thêm Authorization Header)
  getProductById: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
      });
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },
};

// Category Service
export const categoryService = {
  getAllCategories: async (page = 1, size = 20) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/category?page=${page}&size=${size}`
      );
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
};

// Cart Service
export const cartService = {
  addToCart: async (productDetailId, quantity) => {
    try {
      const token = getToken();
      if (!token || token === "MOCK_TOKEN")
        return {
          success: false,
          message: "Chưa đăng nhập. Vui lòng đăng nhập để thêm sản phẩm.",
        };

      const response = await fetch(`${API_BASE_URL}/customer/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productDetailId, quantity }),
      });

      const result = await response.json();
      return {
        success: result.success,
        data: result.data || null,
        message:
          result.message || result.error || "Đã thêm vào giỏ hàng thành công",
      };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { success: false, message: "Lỗi kết nối hoặc xử lý" };
    }
  },

  getCart: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/customer/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return null;
    }
  },
};
