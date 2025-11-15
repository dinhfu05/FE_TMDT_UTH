import React from 'react';
import './BaoCao.css'; 

const BaoCao = () => {
  return (
    <main className="noi_dung_chinh">
      <nav className="breadcrumb">
        <a href="index.html">Trang chủ</a> / <span>Báo cáo</span>
      </nav>
      <h1>Báo cáo</h1>

      <section className="luoi_bao_cao">

        <div className="the_bao_cao the_bao_cao--doanh_thu">
          <div className="the_bao_cao__dau_the">
            <h3><i className="fas fa-chart-bar"></i> Doanh thu tuần qua</h3>
            <a href="#" className="xem_them">Chi tiết <i className="fas fa-chevron-right"></i></a>
          </div>
          <div className="the_bao_cao__noi_dung">
            <div className="khu_vuc_bieu_do">
              <div className="bieu_do__cot_wrapper">
                <div className="bieu_do__cot" style={{ height: '60%' }}></div>
                <span className="bieu_do__nhan">T2</span>
              </div>
              <div className="bieu_do__cot_wrapper">
                <div className="bieu_do__cot" style={{ height: '70%' }}></div>
                <span className="bieu_do__nhan">T3</span>
              </div>
              <div className="bieu_do__cot_wrapper">
                <div className="bieu_do__cot" style={{ height: '45%' }}></div>
                <span className="bieu_do__nhan">T4</span>
              </div>
              <div className="bieu_do__cot_wrapper">
                <div className="bieu_do__cot" style={{ height: '80%' }}></div>
                <span className="bieu_do__nhan">T5</span>
              </div>
              <div className="bieu_do__cot_wrapper">
                <div className="bieu_do__cot" style={{ height: '90%' }}></div>
                <span className="bieu_do__nhan">T6</span>
              </div>
              <div className="bieu_do__cot_wrapper">
                <div className="bieu_do__cot" style={{ height: '75%' }}></div>
                <span className="bieu_do__nhan">T7</span>
              </div>
              <div className="bieu_do__cot_wrapper">
                <div className="bieu_do__cot" style={{ height: '65%' }}></div>
                <span className="bieu_do__nhan">CN</span>
              </div>
            </div>
          </div>
        </div>

        <div className="the_bao_cao the_bao_cao--ban_chay">
          <div className="the_bao_cao__dau_the">
            <h3><i className="fas fa-fire" style={{ color: '#f39c12' }}></i> Sản phẩm bán chạy</h3>
            <a href="#" className="xem_them">Xem thêm <i className="fas fa-chevron-right"></i></a>
          </div>
          <div className="the_bao_cao__noi_dung">
            <ul className="danh_sach_ban_chay">
              <li className="san_pham_item_nho">
                <img src="https://via.placeholder.com/45/333333" alt="Áo khoác" />
                <div className="san_pham_item_nho__thong_tin">
                  <span>Áo khoác</span>
                  <span className="phu_de">Đã bán: 23</span>
                </div>
              </li>
              <li className="san_pham_item_nho">
                <img src="https://via.placeholder.com/45/333333" alt="Quần Jean" />
                <div className="san_pham_item_nho__thong_tin">
                  <span>Quần Jean</span>
                  <span className="phu_de">Đã bán: 18</span>
                </div>
              </li>
              <li className="san_pham_item_nho">
                <img src="https://via.placeholder.com/45/333333" alt="Quần kaki" />
                <div className="san_pham_item_nho__thong_tin">
                  <span>Quần kaki</span>
                  <span className="phu_de">Đã bán: 15</span>
                </div>
              </li>
              <li className="san_pham_item_nho">
                <img src="https://via.placeholder.com/45/333333" alt="Áo Tee" />
                <div className="san_pham_item_nho__thong_tin">
                  <span>Áo Tee</span>
                  <span className="phu_de">Đã bán: 12</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </section>
    </main>
  );
};

export default BaoCao;