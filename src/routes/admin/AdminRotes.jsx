import React from 'react';
import { Routes, Route } from 'react-router-dom';


import AdminLayout from '../../layout/admin/AdminLayout';
import TongQuan from '../../pages/admin/TongQuan/TongQuan';
import BanHang from '../../pages/admin/BanHang/BanHang';
import Khach from '../../pages/admin/Khach/Khach';
import Kho from '../../pages/admin/Kho/Kho';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<TongQuan />} /> 
        <Route path="tong-quan" element={<TongQuan />} />
        <Route path="ban-hang" element={<BanHang />} />
        <Route path="khach" element={<Khach />} />
        <Route path="kho" element={<Kho />} />

      </Route>
    </Routes>
  );
};

export default AdminRoutes;