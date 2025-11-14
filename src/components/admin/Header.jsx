import React from 'react';
import './Header.css'; 

const Header = () => {
  return (
    <header className="header">
      <div className="header__logo">Tenbrand</div>
      <nav className="header__dieu_huong">
        <ul>
          <li className="dang_chon"><a href="index.html">Tổng quan</a></li>
          <li><a href="Ban_hang.html">Bán hàng</a></li>
          <li><a href="Khach.html">Khách</a></li>
          <li><a href="Kho.html">Kho</a></li>
          <li><a href="Marketing.html">Marketing</a></li>
          <li><a href="BaoCao.html">Báo cáo</a></li>
        </ul>
      </nav>
      <div className="header__hanh_dong">
        <div className="thanh_tim_kiem">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
        <i className="fas fa-user-circle icon_hanh_dong"></i>
        <i className="fas fa-bell icon_hanh_dong"></i>
      </div>
    </header>
  );
};

export default Header;