import React, { useState } from "react"; // 1. Import useState
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  LogOut,
  X, // Thêm icon X cho nút đóng modal
} from "lucide-react";

export default function Sidebar({ newOrdersCount = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Thêm state để quản lý trạng thái của Modal xác nhận đăng xuất
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm xử lý mở Modal khi bấm nút Đăng xuất
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Hàm xử lý đóng Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Hàm xử lý Đăng xuất THỰC SỰ
  const handleConfirmLogout = () => {
    // 1. Xóa token lưu trong máy
    localStorage.removeItem("accessToken");
    // 2. Chuyển hướng về trang login
    navigate("/login");
    // 3. Đóng Modal sau khi đăng xuất (tùy chọn)
    setIsModalOpen(false);
  };

  // Hàm kiểm tra xem mục này có đang active không
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <aside className="w-64 flex-shrink-0 px-6 py-8 hidden md:block bg-[#F4F7FE] h-screen sticky top-0 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <span className="text-2xl font-bold text-gray-800">TenBrand</span>
        </div>

        {/* Menu */}
        <nav className="space-y-6">
          <div className="space-y-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu
            </p>

            {/* Tổng quan */}
            <SidebarItem
              to="/admin/dashboard"
              icon={<LayoutDashboard size={20} />}
              label="Tổng quan"
              active={isActive("/admin")}
            />

            <SidebarItem
              to="/admin/products"
              icon={<Package size={20} />}
              label="Sản phẩm"
              active={isActive("/admin/products")}
            />

            {/* Đơn hàng -> Link tới /admin/orders */}
            <SidebarItem
              to="/admin/orders"
              icon={<ShoppingCart size={20} />}
              label="Đơn hàng"
              badge={newOrdersCount}
              active={isActive("/admin/orders")}
            />

            {/* Khách hàng (Ví dụ link) */}
            <SidebarItem
              to="/admin/customers"
              icon={<Users size={20} />}
              label="Khách hàng"
              active={isActive("/admin/customers")}
            />

            <SidebarItem
              to="/admin/membership-tiers"
              icon={<Users size={20} />}
              label="Hạng thành viên"
              active={isActive("/admin/membership-tiers")}
            />
          </div>

          <div className="space-y-2 pt-4">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Cài đặt
            </p>
            <SidebarItem
              to="/admin/settings"
              icon={<Settings size={20} />}
              label="Thiết lập"
              active={isActive("/admin/settings")}
            />

            {/* Nút Đăng xuất - Sử dụng onClick để mở Modal */}
            <SidebarItem
              onClick={handleOpenModal} // Thay vì đăng xuất trực tiếp, ta mở Modal
              icon={<LogOut size={20} />}
              label="Đăng xuất"
            />
          </div>
        </nav>
      </aside>

      {/* Component Modal Xác nhận Đăng xuất */}
      <LogoutConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}

// Sub-component SidebarItem (giữ nguyên)
function SidebarItem({ icon, label, active, badge, to, onClick }) {
  const commonClasses = `flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
    active
      ? "bg-white text-gray-900 shadow-sm border-l-4 border-blue-600"
      : "text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm"
  }`;

  // Nội dung bên trong giống nhau
  const content = (
    <>
      <div className="flex items-center gap-3">
        <span className={active ? "text-blue-600" : ""}>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      {badge > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </>
  );

  // Nếu có prop 'to', render thẻ Link (để chuyển trang)
  if (to) {
    return (
      <Link to={to} className={commonClasses}>
        {content}
      </Link>
    );
  }

  // Nếu không có 'to' (ví dụ nút Logout), render thẻ div với sự kiện onClick
  return (
    <div onClick={onClick} className={commonClasses}>
      {content}
    </div>
  );
}

// Component Modal Xác nhận Đăng xuất (Thêm mới)
function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  // Nếu Modal không mở thì không render gì cả
  if (!isOpen) return null;

  return (
    // Backdrop - Lớp nền mờ bao phủ toàn màn hình
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      {/* Modal Box */}
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm mx-4 transform transition-all duration-300 scale-100 opacity-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <LogOut size={24} className="text-red-500" />
            Xác nhận Đăng xuất
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700">
            Bạn có chắc chắn muốn{" "}
            <span className="font-semibold text-red-600">đăng xuất</span> khỏi
            hệ thống quản trị không?
          </p>
        </div>

        {/* Actions (Buttons) */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
