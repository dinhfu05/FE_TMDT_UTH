import axios from 'axios';

const axiosClient = axios.create({
  // Đường dẫn gốc của Backend
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cấu hình để lấy dữ liệu về dễ hơn
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu BE trả về { success: true, data: [...] }
    // Ta chỉ lấy phần data thôi cho gọn
    if (response && response.data) {
      return response.data; 
    }
    return response;
  },
  (error) => {
    throw error;
  }
);

export default axiosClient;