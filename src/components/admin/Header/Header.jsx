import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';


const getNavLinkClass = ({ isActive }) => {
  return isActive ? 'dang_chon' : '';
};

const Header = () => {
  return (
    <header className="header">
      <div className="header__logo">Tenbrand</div>
      <nav className="header__dieu_huong">
        <ul>
          <li >
            <NavLink to="/tong-quan" className={getNavLinkClass}>
              Tổng quan
            </NavLink>
          </li>

          <li>
            <NavLink to="/ban-hang" className={getNavLinkClass}>
              Bán hàng
            </NavLink>
          </li>

          <li>
            <NavLink to="/khach" className={getNavLinkClass}>
              Khách
            </NavLink>
          </li>

          <li>
            <NavLink to="/kho" className={getNavLinkClass}>
              Kho
            </NavLink>
          </li>

          <li>
            <NavLink to="/marketing" className={getNavLinkClass}>
              Marketing
            </NavLink>
          </li>

          <li>
            <a href="#" style={{ opacity: 0.5, cursor: 'not-allowed' }}>Báo cáo</a>
          </li>


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