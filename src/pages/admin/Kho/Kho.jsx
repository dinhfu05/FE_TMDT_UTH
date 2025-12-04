import React, { useState, useEffect } from 'react';
import productApi from '../../../api/admin/productApi'; // Import API
import './Kho.css';

const Kho = () => {
  // 1. Tạo kho chứa dữ liệu (State)
  const [products, setProducts] = useState([]); // Chứa danh sách sản phẩm từ API
  const [loading, setLoading] = useState(true); // Trạng thái đang tải

  // 2. Gọi API khi trang vừa mở lên
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Gọi API lấy sản phẩm
        const response = await productApi.getAll();
        
        // Dựa vào ảnh JSON bạn gửi, dữ liệu nằm trong thuộc tính 'data'
        console.log("Dữ liệu lấy về:", response); // Xem log để kiểm tra
        setProducts(response.data); 

      } catch (error) {
        console.error("Không tải được sản phẩm:", error);
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchProducts();
  }, []);

  // Hàm format tiền tệ (ví dụ: 150000 -> 150.000)
  const formatCurrency = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <main className="noi_dung_chinh">
      <nav className="breadcrumb">
        <a href="/">Trang chủ</a> / <span>Kho</span>
      </nav>
      <h1>Kho</h1>

      {/* ... (Giữ nguyên phần Thống kê và Nút hành động nếu muốn) ... */}
      
      {/* PHẦN LƯỚI SẢN PHẨM ĐỘNG */}
      <section className="luoi_san_pham">
        
        {/* Nếu đang tải thì hiện thông báo */}
        {loading && <p>Đang tải dữ liệu...</p>}

        {/* Nếu tải xong thì lặp qua danh sách và hiển thị */}
        {!loading && products.map((product) => (
          <div className="the_san_pham" key={product.productId}>
            <div className="the_san_pham__anh">
              {/* LƯU Ý: Ảnh từ API (product.productImage) chỉ là tên file (ví dụ: tshirt_001.jpg).
                 Nếu Backend chưa cấu hình phục vụ file tĩnh, ảnh sẽ bị lỗi. 
                 Tạm thời mình dùng ảnh placeholder nếu ảnh lỗi.
              */}
              <img 
                src={`http://localhost:8080/images/${product.productImage}`} 
                alt={product.productName}
               onError={(e) => {e.target.src = 'https://placehold.co/300x300?text=No+Image'}}
              />
              <span className="the_san_pham__tag_moi">New</span>
            </div>
            
            <div className="the_san_pham__thong_tin">
              <span className="the_san_pham__ten">{product.productName}</span>
              <span className="the_san_pham__gia">{formatCurrency(product.unitPrice)}</span>
              
              {/* Mô tả ngắn (cắt bớt nếu dài quá) */}
              <p style={{fontSize: '13px', color: '#666', margin: '5px 0'}}>
                {product.description}
              </p>

              <div className="the_san_pham__chi_tiet_phu">
                <span className="the_san_pham__kho"><i className="fas fa-box"></i> ID: {product.productId}</span>
                <span className="the_san_pham__danh_gia"><i className="fas fa-star"></i> 5.0</span>
              </div>

              <div className="the_san_pham__hanh_dong">
                <button className="nut_hanh_dong nut--phu"><i className="fas fa-pencil-alt"></i> Sửa</button>
                <button className="nut_hanh_dong nut--huy"><i className="fas fa-trash"></i> Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Phân trang (Giữ nguyên) */}
      <nav className="phan_trang">
        <a href="#" className="nut_dieu_huong"><i className="fas fa-chevron-left"></i></a>
        <a href="#" className="trang_hien_tai">1</a>
        <a href="#" className="nut_dieu_huong"><i className="fas fa-chevron-right"></i></a>
      </nav>
    </main>
  );
};

export default Kho;