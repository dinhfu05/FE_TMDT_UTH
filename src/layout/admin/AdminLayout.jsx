import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- QUAN TRỌNG

// Import Header/Footer theo đúng cấu trúc của bạn
import Header from '../../components/admin/Header/Header';
import Footer from '../../components/admin/Footer/Footer';

const AdminLayout = () => {
  return (
    <div className="admin-layout-wrapper">
      <Header />

      {/* <Outlet /> là "lỗ hổng"
        Nơi mà router sẽ "nhét" các trang con
        (như TongQuan, BanHang...) vào.
      */}
      <main className="admin-content-area">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default AdminLayout;