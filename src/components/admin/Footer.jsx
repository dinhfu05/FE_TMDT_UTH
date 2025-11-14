import React from 'react';
import './Footer.css'; // <-- Import file CSS của Footer

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__noi_dung">
        <div className="footer__cot">
          <h4>Tenbrand</h4>
          <p>Thương hiệu thời trang hàng đầu Việt Nam, mang đến những sản phẩm chất lượng cao với thiết kế hiện
            đại và phong cách.</p>
        </div>
        <div className="footer__cot">
          <h4>Về chúng tôi</h4>
          <ul>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Cửa hàng</a></li>
            <li><a href="#">Sản phẩm</a></li>
            <li><a href="#">Tin tức</a></li>
          </ul>
        </div>
        <div className="footer__cot">
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li><a href="#">Tìm kiếm</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </div>
        <div className="footer__cot">
          <h4>Chính sách</h4>
          <ul>
            <li><a href="#">Thanh toán</a></li>
            <li><a href="#">Bảo mật</a></li>
            <li><a href="#">Điều khoản</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__chan_trang">
        <p>© 2025 Tenbrand - All rights reserved.</p>
        <div className="icon_mang_xa_hoi">
          {/* <spanp> không phải là thẻ HTML hợp lệ, tôi đã sửa thành <span> */}
          <span>Theo dõi chúng tôi:</span>
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;