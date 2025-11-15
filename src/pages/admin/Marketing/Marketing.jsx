import React from 'react';
import './Marketing.css'; 



const Marketing = () => {
  return (
    <main className="noi_dung_chinh">
      <nav className="breadcrumb">
        <a href="index.html">Trang chủ</a> / <span>Marketing</span>
      </nav>
      <h1>Tin tức & Khuyến mãi</h1>

      <section className="danh_sach_bai_viet">
        <article className="the_bai_viet">
          <div className="the_bai_viet__anh">

            <img src="./Picture/Marketing.png" alt="Spring Collection" /> 
          </div>
          <div className="the_bai_viet__noi_dung">
            <span className="the_bai_viet__ngay_dang">
              <i className="fas fa-calendar-alt"></i> 25/10/2025
            </span>
            <h3>SPRING COLLECTION 2025 - BỘ SƯU TẬP XUÂN MỚI</h3>
            <p>Chào đón mùa xuân mới với bộ sưu tập thời trang cao cấp từ Tenbrand. Mang đến cho bạn những xu hướng thời trang mới nhất cho phong cách hiện đại...</p>
            <a href="#" className="xem_them">
              Xem thêm <i className="fas fa-chevron-right"></i>
            </a>
          </div>
        </article>



      </section>

      <section className="khu_vuc_them_moi">
        <button className="nut_them_moi">
          <i className="fas fa-plus"></i>
        </button>
      </section>
    </main>
  );
};

export default Marketing;