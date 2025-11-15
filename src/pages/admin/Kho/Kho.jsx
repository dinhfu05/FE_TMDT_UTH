import React from 'react';
import './Kho.css'; 


const Kho = () => {
  return (
    <main className="noi_dung_chinh">
      <nav className="breadcrumb">
        <a href="index.html">Trang chủ</a> / <span>Kho</span>
      </nav>
      <h1>Kho</h1>

      <section className="luoi_thong_ke">
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong"><i className="fas fa-boxes"></i></div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">567</span>
            <span className="the_thong_ke__nhan">Tổng sản phẩm</span>
          </div>
        </div>
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong"><i className="fas fa-check-circle" style={{ color: '#27ae60' }}></i></div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">500</span>
            <span className="the_thong_ke__nhan">Đang bán</span>
          </div>
        </div>
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong"><i className="fas fa-exclamation-triangle" style={{ color: '#f39c12' }}></i></div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">45</span>
            <span className="the_thong_ke__nhan">Sắp hết hàng</span>
          </div>
        </div>
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong"><i className="fas fa-times-circle" style={{ color: '#e74c3c' }}></i></div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">7</span>
            <span className="the_thong_ke__nhan">Hết hàng</span>
          </div>
        </div>
      </section>

      <section className="khu_vuc_hanh_dong_lon">
        <button className="nut_hanh_dong_lon nut--xanh_duong">
          <i className="fas fa-plus"></i> Thêm sản phẩm mới
        </button>
        <button className="nut_hanh_dong_lon nut--xanh_la">
          <i className="fas fa-plus"></i> Thêm thư mục mới
        </button>
      </section>

      <section className="khu_vuc_tabs">
        <button className="tab_item tab_dang_chon">Áo</button>
        <button className="tab_item">Quần</button>
      </section>

      <section className="bo_loc_don_hang">
        <div className="thanh_tim_kiem_lon">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm sản phẩm..." />
        </div>
        <div className="nhom_bo_loc">
          <select className="bo_loc_dropdown">
            <option value="">Tất cả danh mục</option>
          </select>
          <select className="bo_loc_dropdown">
            <option value="">Trạng thái</option>
          </select>
          <select className="bo_loc_dropdown">
            <option value="">Sắp xếp</option>
          </select>
        </div>
      </section>

      <section className="luoi_san_pham">

        {/* Thẻ sản phẩm 1 */}
        <div className="the_san_pham">
          <div className="the_san_pham__anh">
            <img src="./Picture/ao(2).webp" alt="Áo" /> 
            <span className="the_san_pham__tag_moi">New</span>
          </div>
          <div className="the_san_pham__thong_tin">
            <span className="the_san_pham__ten">Áo</span>
            <span className="the_san_pham__gia">100.000đ</span>
            <div className="the_san_pham__mau_sac">
              <span className="mau_sac_swatch" style={{ backgroundColor: '#000' }}></span>
              <span className="mau_sac_swatch" style={{ backgroundColor: '#eee' }}></span>
              <span className="mau_sac_swatch" style={{ backgroundColor: '#c0392b' }}></span>
              <span className="mau_sac_swatch" style={{ backgroundColor: '#2980b9' }}></span>
            </div>
            <div className="the_san_pham__chi_tiet_phu">
              <span className="the_san_pham__kho"><i className="fas fa-box"></i> Kho: 10</span>
              <span className="the_san_pham__danh_gia"><i className="fas fa-star"></i> 4.5</span>
            </div>
            <div className="the_san_pham__hanh_dong">
              <button className="nut_hanh_dong nut--phu"><i className="fas fa-pencil-alt"></i> Sửa</button>
              <button className="nut_hanh_dong nut--huy"><i className="fas fa-trash"></i> Xóa</button>
            </div>
          </div>
        </div>

        {/* Thẻ sản phẩm 2 */}
        <div className="the_san_pham">
          <div className="the_san_pham__anh">
            <img src="./Picture/Ao.webp" alt="Quần Jean" />
          </div>
          <div className="the_san_pham__thong_tin">
            <span className="the_san_pham__ten">Áo</span>
            <span className="the_san_pham__gia">100.000đ</span>
            <div className="the_san_pham__mau_sac">
              <span className="mau_sac_swatch" style={{ backgroundColor: '#000' }}></span>
              <span className="mau_sac_swatch" style={{ backgroundColor: '#c0392b' }}></span>
            </div>
            <div className="the_san_pham__chi_tiet_phu">
              <span className="the_san_pham__kho"><i className="fas fa-box"></i> Kho: 10</span>
              <span className="the_san_pham__danh_gia"><i className="fas fa-star"></i> 4.5</span>
            </div>
            <div className="the_san_pham__hanh_dong">
              <button className="nut_hanh_dong nut--phu"><i className="fas fa-pencil-alt"></i> Sửa</button>
              <button className="nut_hanh_dong nut--huy"><i className="fas fa-trash"></i> Xóa</button>
            </div>
          </div>
        </div>
        
        {/* Thẻ sản phẩm 3 */}
        <div className="the_san_pham">
          <div className="the_san_pham__anh">
            <img src="./Picture/ao(3).webp" alt="Sản phẩm" /> 
            <span className="the_san_pham__tag_moi">New</span>
          </div>
          <div className="the_san_pham__thong_tin">
             <span className="the_san_pham__ten">Áo</span>
             <span className="the_san_pham__gia">100.000đ</span>
             <div className="the_san_pham__mau_sac">
                <span className="mau_sac_swatch" style={{ backgroundColor: '#000' }}></span>
                <span className="mau_sac_swatch" style={{ backgroundColor: '#eee' }}></span>
             </div>
             <div className="the_san_pham__chi_tiet_phu">
                <span className="the_san_pham__kho"><i className="fas fa-box"></i> Kho: 10</span>
                <span className="the_san_pham__danh_gia"><i className="fas fa-star"></i> 4.5</span>
             </div>
             <div className="the_san_pham__hanh_dong">
                <button className="nut_hanh_dong nut--phu"><i className="fas fa-pencil-alt"></i> Sửa</button>
                <button className="nut_hanh_dong nut--huy"><i className="fas fa-trash"></i> Xóa</button>
             </div>
          </div>
        </div>

        {/* Thẻ sản phẩm 4 */}
        <div className="the_san_pham">
          <div className="the_san_pham__anh">
            <img src="./Picture/ao(3).webp" alt="Áo" /> 
            <span className="the_san_pham__tag_moi">New</span>
          </div>
          <div className="the_san_pham__thong_tin">
             <span className="the_san_pham__ten">Áo</span>
             <span className="the_san_pham__gia">100.000đ</span>
             <div className="the_san_pham__hanh_dong">
                <button className="nut_hanh_dong nut--phu"><i className="fas fa-pencil-alt"></i> Sửa</button>
                <button className="nut_hanh_dong nut--huy"><i className="fas fa-trash"></i> Xóa</button>
             </div>
          </div>
        </div>

        {/* Thẻ sản phẩm 5 */}
        <div className="the_san_pham">
          <div className="the_san_pham__anh">
            <img src="./Picture/ao(4).webp" alt="Áo" /> 
            <span className="the_san_pham__tag_moi">New</span>
          </div>
          <div className="the_san_pham__thong_tin">
             <span className="the_san_pham__ten">Áo</span>
             <span className="the_san_pham__gia">100.000đ</span>
             <div className="the_san_pham__hanh_dong">
                <button className="nut_hanh_dong nut--phu"><i className="fas fa-pencil-alt"></i> Sửa</button>
                <button className="nut_hanh_dong nut--huy"><i className="fas fa-trash"></i> Xóa</button>
             </div>
          </div>
        </div>

        {/* Thẻ sản phẩm 6 */}
        <div className="the_san_pham">
          <div className="the_san_pham__anh">
            <img src="./Picture/ao(5).webp" alt="Áo" /> 
            <span className="the_san_pham__tag_moi">New</span>
          </div>
          <div className="the_san_pham__thong_tin">
             <span className="the_san_pham__ten">Áo</span>
             <span className="the_san_pham__gia">100.000đ</span>
             <div className="the_san_pham__hanh_dong">
                <button className="nut_hanh_dong nut--phu"><i className="fas fa-pencil-alt"></i> Sửa</button>
                <button className="nut_hanh_dong nut--huy"><i className="fas fa-trash"></i> Xóa</button>
             </div>
          </div>
        </div>

        {/* Thẻ sản phẩm 7 */}
        <div className="the_san_pham">
          <div className="the_san_pham__anh">
            <img src="./Picture/ao(6).png" alt="Áo" /> 
            <span className="the_san_pham__tag_moi">New</span>
          </div>
          <div className="the_san_pham__thong_tin">
             <span className="the_san_pham__ten">Áo</span>
             <span className="the_san_pham__gia">100.000đ</span>
             <div className="the_san_pham__hanh_dong">
                <button className="nut_hanh_dong nut--phu"><i className="fas fa-pencil-alt"></i> Sửa</button>
                <button className="nut_hanh_dong nut--huy"><i className="fas fa-trash"></i> Xóa</button>
             </div>
          </div>
        </div>

        {/* Thẻ sản phẩm 8 */}
        <div className="the_san_pham">
          <div className="the_san_pham__anh">
            <img src="./Picture/ao(7).png" alt="Áo" /> {/* Sẽ lỗi */}
            <span className="the_san_pham__tag_moi">New</span>
          </div>
          <div className="the_san_pham__thong_tin">
             <span className="the_san_pham__ten">Áo</span>
             <span className="the_san_pham__gia">100.000đ</span>
             <div className="the_san_pham__hanh_dong">
                <button className="nut_hanh_dong nut--phu"><i className="fas fa-pencil-alt"></i> Sửa</button>
                <button className="nut_hanh_dong nut--huy"><i className="fas fa-trash"></i> Xóa</button>
             </div>
          </div>
        </div>
        
      </section>

      <nav className="phan_trang">
        <a href="#" className="nut_dieu_huong"><i className="fas fa-chevron-left"></i></a>
        <a href="#" className="trang_hien_tai">1</a>
        <a href="#">2</a>
        <a href="#">3</a>
        <a href="#">4</a>
        <a href="#">5</a>
        <a href="#" className="nut_dieu_huong"><i className="fas fa-chevron-right"></i></a>
      </nav>
    </main>
  );
};

export default Kho;