// apiService.js
const API_BASE_URL = 'http://localhost:8080/api';

export const customerService = {
  getCustomerById: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/customer/me`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error fetching customer:', error);
      return null;
    }
  },

  updateCustomer: async ( data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/customer/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return {
        success: result.success,
        data: result.data || null,
        message: result.message || ''
      };
    } catch (error) {
      console.error('Error updating customer:', error);
      return { success: false, message: 'Đã có lỗi xảy ra khi cập nhật thông tin' };
    }
  }
};
