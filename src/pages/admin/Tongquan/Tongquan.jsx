import React from 'react';
import './Tongquan.css'; 

const TongQuan = () => {
  return (
    <main className="noi_dung_chinh">
      <nav className="breadcrumb">
        <a href="index.html">Trang chủ</a> / <span>Tông quan</span>
      </nav>
      <h1>Tổng quan</h1>

      <section className="luoi_thong_ke">
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong"><i className="fas fa-chart-line"></i></div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">1.000.000 VND</span>
            <span className="the_thong_ke__nhan">Doanh thu tháng</span>
            <span className="the_thong_ke__phu_de">+ 15% so với tháng trước</span>
          </div>
        </div>
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong"><i className="fas fa-shopping-cart"></i></div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">45</span>
            <span className="the_thong_ke__nhan">Đơn hàng mới</span>
            <span className="the_thong_ke__phu_de">+ 5 đơn hôm nay</span>
          </div>
        </div>
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong"><i className="fas fa-users"></i></div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">39</span>
            <span className="the_thong_ke__nhan">Khách hàng</span>
            <span className="the_thong_ke__phu_de">+ 1 khách mới</span>
          </div>
        </div>
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong"><i className="fas fa-box"></i></div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">560</span>
            <span className="the_thong_ke__nhan">Sản phẩm</span>
            <span className="the_thong_ke__phu_de">+ 12 sản phẩm mới</span>
          </div>
        </div>
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong"><i className="fas fa-exclamation-triangle"></i></div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">45</span>
            <span className="the_thong_ke__nhan">Sắp hết hàng</span>
            <span className="the_thong_ke__phu_de" style={{ color: 'red' }}>Cần nhập thêm hàng</span>
          </div>
        </div>
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong"><i className="fas fa-star"></i></div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">5.0</span>
            <span className="the_thong_ke__nhan">Đánh giá trung bình</span>
            <span className="the_thong_ke__phu_de">+ 0 Ghi</span>
          </div>
        </div>
      </section>

      <section className="truy_cap_nhanh">
        <h2><i className="fas fa-bolt"></i> Truy cập nhanh</h2>
        <div className="truy_cap_nhanh__luoi">
          <button className="truy_cap_nhanh__nut">
            <i className="fas fa-plus-circle"></i>
            <span>Thêm sản phẩm</span>
          </button>
          <button className="truy_cap_nhanh__nut">
            <i className="fas fa-file-alt"></i>
            <span>Xem đơn hàng</span>
          </button>
          <button className="truy_cap_nhanh__nut">
            <i className="fas fa-warehouse"></i>
            <span>Kiểm kho</span>
          </button>
          <button className="truy_cap_nhanh__nut">
            <i className="fas fa-chart-bar"></i>
            <span>Xem báo cáo</span>
          </button>
          <button className="truy_cap_nhanh__nut">
            <i className="fas fa-tags"></i>
            <span>Tạo khuyến mãi</span>
          </button>
          <button className="truy_cap_nhanh__nut">
            <i className="fas fa-user-cog"></i>
            <span>Quản lý khách</span>
          </button>
        </div>
      </section>
    </main>
  );
};

export default TongQuan;