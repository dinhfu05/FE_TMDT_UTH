import axiosClient from '../axiosClient';

const productApi = {
  getAll: () => {
    // Gọi vào đường dẫn /product (ghép với baseURL sẽ thành http://localhost:8080/api/product)
    const url = '/product'; 
    return axiosClient.get(url);
  },
  
  // Sau này thêm các hàm khác (thêm, sửa, xóa) ở đây
};

export default productApi;