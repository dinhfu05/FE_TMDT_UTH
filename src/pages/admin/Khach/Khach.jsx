import React from 'react';
import './Khach.css';

const Khach = () => {
  return (
    <main className="noi_dung_chinh">
      <nav className="breadcrumb">
        <a href="index.html">Trang chủ</a> / <span>Khách</span>
      </nav>
      <h1>Quản lý khách</h1>

      <section className="luoi_thong_ke">
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong"><i className="fas fa-users"></i></div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">1212</span>
            <span className="the_thong_ke__nhan">Tổng số khách hàng</span>
          </div>
        </div>
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong">
            <i className="fas fa-user-check" style={{ color: '#27ae60' }}></i>
          </div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">300</span>
            <span className="the_thong_ke__nhan">Đang hoạt động</span>
          </div>
        </div>
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong">
            <i className="fas fa-crown" style={{ color: '#f39c12' }}></i>
          </div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">5</span>
            <span className="the_thong_ke__nhan">Khách VIP</span>
          </div>
        </div>
        <div className="the_thong_ke">
          <div className="the_thong_ke__bieu_tuong"><i className="fas fa-user-plus"></i></div>
          <div className="the_thong_ke__thong_tin">
            <span className="the_thong_ke__gia_tri">212</span>
            <span className="the_thong_ke__nhan">Khách mới tháng này</span>
          </div>
        </div>
      </section>

      <section className="bo_loc_don_hang">
        <div className="thanh_tim_kiem_lon">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm tên, SĐT, Email..." />
        </div>
        <div className="nhom_bo_loc">
          <select className="bo_loc_dropdown">
            <option value="">Tất cả cấp độ</option>
            <option value="vip">VIP</option>
            <option value="vang">Vàng</option>
            <option value="bac">Bạc</option>
          </select>
          <select className="bo_loc_dropdown">
            <option value="">Trạng thái</option>
            <option value="hoat_dong">Hoạt động</option>
            <option value="khong_hoat_dong">Không hoạt động</option>
          </select>
          <select className="bo_loc_dropdown">
            <option value="">Sắp xếp</option>
            <option value="moi_nhat">Mới nhất</option>
            <option value="cu_nhat">Cũ nhất</option>
          </select>
        </div>
      </section>

      <section className="khu_vuc_bang">
        <table className="bang_khach_hang">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Cấp độ</th>
              <th>Đơn hàng</th>
              <th>Tổng chi tiêu</th>
              <th>Ngày tham gia</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vũ Quốc Huy</td>
              <td>0708123456</td>
              <td><span className="cap_do cap_do--bac">Bạc</span></td>
              <td>20 đơn</td>
              <td>1.500.000đ</td>
              <td>12/12/2005</td>
              <td><span className="trang_thai_khach trang_thai_khach--hoat_dong">Hoạt động</span></td>
            </tr>
            <tr>
              <td>Trần Nhật Đông</td>
              <td>0909123456</td>
              <td><span className="cap_do cap_do--vang">Vàng</span></td>
              <td>107 đơn</td>
              <td>15.000.000đ</td>
              <td>12/12/2005</td>
              <td><span className="trang_thai_khach trang_thai_khach--hoat_dong">Hoạt động</span></td>
            </tr>
            <tr>
              <td>Phó Hà Nguyên Binh</td>
              <td>0808123456</td>
              <td><span className="cap_do cap_do--thuong">Thường</span></td>
              <td>1 đơn</td>
              <td>100.000đ</td>
              <td>12/12/2005</td>
              <td><span className="trang_thai_khach trang_thai_khach--khong_hoat_dong">Không HĐ</span></td>
            </tr>
            <tr>
              <td>Nguyễn Khuyên</td>
              <td>0606123456</td>
              <td><span className="cap_do cap_do--vip">VIP</span></td>
              <td>700 đơn</td>
              <td>50.000.000đ</td>
              <td>12/12/2005</td>
              <td><span className="trang_thai_khach trang_thai_khach--hoat_dong">Hoạt động</span></td>
            </tr>
            <tr>
              <td>Khang DZ</td>
              <td>0505123456</td>
              <td><span className="cap_do cap_do--thuong">Thường</span></td>
              <td>2 đơn</td>
              <td>250.000đ</td>
              <td>12/12/2005</td>
              <td><span className="trang_thai_khach trang_thai_khach--khong_hoat_dong">Không HĐ</span></td>
            </tr>
          </tbody>
        </table>
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

export default Khach;