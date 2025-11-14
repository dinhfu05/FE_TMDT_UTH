import React from 'react';
import './BanHang.css'; // Import file CSS riêng của trang này

// GIẢ SỬ bạn đã chép ảnh vào thư mục 'src/assets/images/'
// Bạn sẽ cần import chúng như thế này:
// import aoImg from '../../../assets/images/ao(8).png';
// import quanJeanImg from '../../../assets/images/Quan_jean.png';

const BanHang = () => {
  return (
    <main className="noi_dung_chinh"> {/* <-- Chỉ lấy từ <main> */}
      <nav className="breadcrumb">
        <a href="index.html">Trang chủ</a> / <span>Bán hàng</span>
      </nav>
      <h1>Đơn hàng</h1>

      <section className="tom_tat_don_hang">
        <div className="tom_tat_item">
          <i className="fas fa-box-open icon-trang-thai"></i>
          <div className="tom_tat_chi_tiet">
            <strong>156</strong>
            <span>Tất cả</span>
          </div>
        </div>
        <div className="tom_tat_item">
          <i className="fas fa-check-circle icon-trang-thai" style={{ color: '#27ae60' }}></i>
          <div className="tom_tat_chi_tiet">
            <strong>90</strong>
            <span>Hoàn thành</span>
          </div>
        </div>
        <div className="tom_tat_item">
          <i className="fas fa-clock icon-trang-thai" style={{ color: '#f39c12' }}></i>
          <div className="tom_tat_chi_tiet">
            <strong>40</strong>
            <span>Chờ xử lý</span>
          </div>
        </div>
        <div className="tom_tat_item">
          <i className="fas fa-spinner icon-trang-thai" style={{ color: '#3498db' }}></i>
          <div className="tom_tat_chi_tiet">
            <strong>20</strong>
            <span>Đang xử lý</span>
          </div>
        </div>
        <div className="tom_tat_item">
          <i className="fas fa-truck icon-trang-thai" style={{ color: '#e74c3c' }}></i>
          <div className="tom_tat_chi_tiet">
            <strong>1</strong>
            <span>Đang giao</span>
          </div>
        </div>
        <div className="tom_tat_item">
          <i className="fas fa-times-circle icon-trang-thai" style={{ color: '#999' }}></i>
          <div className="tom_tat_chi_tiet">
            <strong>5</strong>
            <span>Đã hủy</span>
          </div>
        </div>
      </section>

      <section className="bo_loc_don_hang">
        <div className="thanh_tim_kiem_lon">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm đơn hàng theo mã, tên khách hàng..." />
        </div>
        <div className="nhom_bo_loc">
          <select className="bo_loc_dropdown">
            <option value="">Trạng thái</option>
            <option value="cho_xu_ly">Chờ xử lý</option>
            <option value="dang_xu_ly">Đang xử lý</option>
            <option value="dang_giao">Đang giao</option>
          </select>
          <select className="bo_loc_dropdown">
            <option value="">Sắp xếp</option>
            <option value="moi_nhat">Mới nhất</option>
            <option value="cu_nhat">Cũ nhất</option>
          </select>
        </div>
      </section>

      <section className="danh_sach_don_hang">

        <div className="the_don_hang">
          <div className="don_hang__dau_the">
            <h3>#QH121205</h3>
            <span className="trang_thai trang_thai--cho_xu_ly">Chờ xử lý</span>
          </div>
          <div className="don_hang__thong_tin">
            <div>
              <span>Khách hàng: <strong>Vũ Quốc Huy</strong></span>
              <span>Ngày đặt: <strong>2/2/2025 - 3:00</strong></span>
            </div>
            <div>
              <span>SĐT: <strong>0708123456</strong></span>
              <span>Tổng tiền: <strong className="gia_tien">550.000đ</strong></span>
            </div>
          </div>
          <div className="don_hang__san_pham_list">
            <div className="san_pham_item">
              {/* <img src={aoImg} alt="Sản phẩm" /> */}
              <img src={"./Picture/ao(8).png"} alt="Sản phẩm" /> {/* Tạm thời để link cũ, nhưng nó sẽ lỗi */}
              <div className="san_pham_item__chi_tiet">
                <span>Áo</span>
                <span>Số lượng: 1 x 250.000đ</span>
              </div>
            </div>
            <div className="san_pham_item">
              {/* <img src={quanJeanImg} alt="Sản phẩm" /> */}
              <img src={"./Picture/Quan_jean.png"} alt="Sản phẩm" /> {/* Tạm thời để link cũ */}
              <div className="san_pham_item__chi_tiet">
                <span>Quần jean</span>
                <span>Số lượng: 1 x 300.000đ</span>
              </div>
            </div>
          </div>
          <div className="don_hang__hanh_dong">
            <button className="nut_hanh_dong nut--phu"><i className="fas fa-eye"></i> Chi tiết</button>
            <button className="nut_hanh_dong nut--chinh"><i className="fas fa-check"></i> Xác nhận</button>
            <button className="nut_hanh_dong nut--huy"><i className="fas fa-times"></i> Hủy đơn</button>
            <button className="nut_hanh_dong nut--phu"><i className="fas fa-print"></i> In đơn</button>
          </div>
        </div>

        <div className="the_don_hang">
          <div className="don_hang__dau_the">
            <h3>#QH121206</h3>
            <span className="trang_thai trang_thai--dang_xu_ly">Đang xử lý</span>
          </div>
          <div className="don_hang__thong_tin">
            <div>
              <span>Khách hàng: <strong>Vũ Quốc Huy</strong></span>
              <span>Ngày đặt: <strong>2/2/2025 - 3:00</strong></span>
            </div>
            <div>
              <span>SĐT: <strong>0708123456</strong></span>
              <span>Tổng tiền: <strong className="gia_tien">550.000đ</strong></span>
            </div>
          </div>
          <div className="don_hang__hanh_dong">
            <button className="nut_hanh_dong nut--phu"><i className="fas fa-eye"></i> Chi tiết</button>
            <button className="nut_hanh_dong nut--chinh"><i className="fas fa-truck"></i> Giao hàng</button>
            <button className="nut_hanh_dong nut--phu"><i className="fas fa-comment"></i> Nhắn tin</button>
            <button className="nut_hanh_dong nut--phu"><i className="fas fa-print"></i> In đơn</button>
          </div>
        </div>

        <div className="the_don_hang">
          <div className="don_hang__dau_the">
            <h3>#QH121207</h3>
            <span className="trang_thai trang_thai--dang_giao">Đang giao</span>
          </div>
          <div className="don_hang__thong_tin">
            <div>
              <span>Khách hàng: <strong>Vũ Quốc Huy</strong></span>
              <span>Ngày đặt: <strong>2/2/2025 - 3:00</strong></span>
            </div>
            <div>
              <span>SĐT: <strong>0708123456</strong></span>
              <span>Tổng tiền: <strong className="gia_tien">550.000đ</strong></span>
            </div>
          </div>
          <div className="don_hang__hanh_dong">
            <button className="nut_hanh_dong nut--phu"><i className="fas fa-eye"></i> Chi tiết</button>
            <button className="nut_hanh_dong nut--chinh"><i className="fas fa-check-double"></i> Đã giao</button>
            <button className="nut_hanh_dong nut--phu"><i className="fas fa-comment"></i> Nhắn tin</button>
            <button className="nut_hanh_dong nut--phu"><i className="fas fa-map-marker-alt"></i> Theo dõi</button>
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

export default BanHang;