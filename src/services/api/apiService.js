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

  // Lấy chi tiết sản phẩm
  getProductById: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${productId}`);
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  // Lấy reviews theo productId
  getProductReviews: async (productId, page = 1, size = 10) => {
    try {
      const token = getToken();
      const headers = { "Content-Type": "application/json" };
      if (token && token !== "MOCK_TOKEN") {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(
        `${API_BASE_URL}/product/${productId}/reviews?page=${page}&size=${size}`,
        { headers }
      );
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      return [];
    }
  },

  // --- SỬA LẠI: Gửi data qua Query Params (URL) ---
  // Swagger ghi là (query) nên ta phải append vào URL thay vì body
  createReview: async (productId, orderDetailId, reviewData) => {
    try {
      const token = getToken();
      if (!token) return { success: false, message: "Vui lòng đăng nhập" };

      // Chuyển object data thành query params
      const params = new URLSearchParams();
      if (reviewData.rating) params.append("rating", reviewData.rating);
      if (reviewData.reviewContent)
        params.append("reviewContent", reviewData.reviewContent);

      const response = await fetch(
        `${API_BASE_URL}/product/${productId}/reviews/${orderDetailId}?${params.toString()}`,
        {
          method: "POST",
          headers: {
            // Không cần Content-Type application/json vì không gửi body
            Authorization: `Bearer ${token}`,
          },
          // Body để trống
        }
      );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating review:", error);
      return { success: false, message: "Lỗi kết nối" };
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
