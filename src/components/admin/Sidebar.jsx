import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar({ newOrdersCount = 0 }) {
  return (
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
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Tổng quan" active />
          <SidebarItem 
            icon={<ShoppingCart size={20} />} 
            label="Đơn hàng" 
            badge={newOrdersCount} 
          />
          <SidebarItem icon={<Users size={20} />} label="Khách hàng" />
          <SidebarItem icon={<Package size={20} />} label="Sản phẩm" />
        </div>

        <div className="space-y-2 pt-4">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Cài đặt
          </p>
          <SidebarItem icon={<Settings size={20} />} label="Thiết lập" />
          <SidebarItem icon={<LogOut size={20} />} label="Đăng xuất" />
        </div>
      </nav>
    </aside>
  );
}

// Sub-component nội bộ của Sidebar
function SidebarItem({ icon, label, active, badge }) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
        active
          ? "bg-white text-gray-900 shadow-sm border-l-4 border-blue-600"
          : "text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? "text-blue-600" : ""}>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      {badge > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </div>
  );
}