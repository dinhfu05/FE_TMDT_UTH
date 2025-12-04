import React from "react";
import useDashboard from "../../hook/useDashboard";
import Sidebar from "../../components/admin/SideBar"; // Nhớ import đúng đường dẫn
import Header from "../../components/admin/Header"   // Nhớ import đúng đường dẫn
import {
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  MoreHorizontal,
  Plus
} from "lucide-react";

export default function TongQuan() {
  const { loading, data } = useDashboard();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-blue-600 font-medium">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans text-gray-800">
      
      {/* 1. SIDEBAR Component */}
      <Sidebar newOrdersCount={data?.newOrders || 0} />

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        
        {/* 2. HEADER Component */}
        <Header 
            title="Dashboard" 
            subtitle="Xin chào, xem tình hình kinh doanh hôm nay nhé!"
            user={{ name: "Admin", email: "a@example", avatar: "https://i.pravatar.cc/150?img=11" }} 
        />

        {/* --- NỘI DUNG DASHBOARD (Giữ nguyên phần content cũ) --- */}
        
        {/* TOP CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Highlight */}
          <div className="bg-[#1B4DFF] text-white p-6 rounded-[32px] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-blue-100 font-medium">Doanh thu tháng</h3>
                  <p className="text-3xl font-bold mt-2">{data.monthlyRevenue.toLocaleString()} ₫</p>
               </div>
               <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                 <ArrowUpRight size={20} />
               </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-100">
               <span className="bg-white/20 px-1.5 py-0.5 rounded text-white text-xs">+12%</span>
               <span>so với tháng trước</span>
            </div>
             <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white opacity-10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          </div>

          <StatCard 
            title="Đơn hàng mới" value={data.newOrders} trend="+5%" 
            icon={<ShoppingCart size={20} className="text-gray-600" />} 
          />
          <StatCard 
            title="Khách hàng" value={data.customers} trend="+2.4%" 
            icon={<Users size={20} className="text-gray-600" />} 
          />
          <StatCard 
            title="Sắp hết hàng" value={data.lowStock} trend="Cần nhập" isWarning
            icon={<Package size={20} className="text-gray-600" />} 
          />
        </section>

        {/* MIDDLE SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            
            {/* Chart Area */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm xl:col-span-2 flex flex-col">
                
                {/* Header Biểu đồ */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Phân tích bán hàng</h3>
                        <p className="text-sm text-gray-400 mt-1">Dữ liệu cập nhật theo thời gian thực</p>
                    </div>
                    {/* Toggle Button */}
                    <div className="bg-gray-100 p-1 rounded-full flex text-sm font-medium">
                        <button className="px-4 py-1.5 rounded-full text-gray-500 hover:text-gray-700 transition">Tháng</button>
                        <button className="px-4 py-1.5 bg-white text-blue-600 shadow-sm rounded-full transition">Tuần này</button>
                    </div>
                </div>

                {/* Main Chart Container */}
                <div className="flex-1 relative min-h-[250px] flex items-end gap-2 pr-2">
                    <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 font-medium pointer-events-none z-0">
                        {[100, 75, 50, 25, 0].map((val) => (
                            <div key={val} className="flex items-center w-full gap-3">
                                <span className="w-6 text-right">{val}</span>
                                <div className="h-[1px] flex-1 bg-gray-100 border-b border-dashed border-gray-200"></div>
                            </div>
                        ))}
                    </div>
                    <div className="relative z-10 flex items-end justify-between w-full h-full pl-9 pb-6 pt-2">
                        {[40, 65, 30, 85, 55, 95, 45].map((h, i) => (
                            <div key={i} className="group relative flex flex-col items-center flex-1 h-full justify-end gap-2">
                                
                                {/* TOOLTIP (Hiện khi Hover) */}
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg shadow-xl mb-2 z-20 whitespace-nowrap">
                                    {h}.000.000 ₫
                                    {/* Mũi tên tooltip */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>

                                {/* CỘT (THE BAR) */}
                                <div className="w-full max-w-[32px] sm:max-w-[44px] relative h-full flex items-end rounded-t-xl group-hover:bg-gray-50 transition-colors">
                                    <div 
                                        style={{ height: `${h}%` }} 
                                        className={`w-full rounded-t-xl transition-all duration-500 relative overflow-hidden group-hover:shadow-lg group-hover:scale-y-105 origin-bottom
                                            ${i === 5 
                                                ? 'bg-gradient-to-t from-blue-700 to-blue-500' // Cột cao nhất
                                                : 'bg-gradient-to-t from-blue-100 to-blue-50 hover:from-blue-400 hover:to-blue-300' // Các cột khác
                                            }`}
                                    >
                                        {/* Hiệu ứng bóng nhẹ trên đầu cột */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-20"></div>
                                    </div>
                                </div>

                                {/* Nhãn trục hoành (X-Axis Label) */}
                                <span className={`text-xs font-medium transition-colors absolute -bottom-6
                                    ${i === 5 ? 'text-blue-600 font-bold' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                    T{i + 2}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product List */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Sản phẩm top</h3>
                    <button className="flex items-center gap-1 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100">
                        <Plus size={14} /> <span>Thêm</span>
                    </button>
                </div>
                <div className="space-y-4 flex-1">
                    <ProductItem name="iPhone 15 Pro" date="26 Nov, 2024" icon="📱" color="bg-blue-100 text-blue-600" />
                    <ProductItem name="MacBook Air" date="28 Nov, 2024" icon="💻" color="bg-indigo-100 text-indigo-600" />
                    <ProductItem name="AirPods Max" date="30 Nov, 2024" icon="🎧" color="bg-orange-100 text-orange-600" />
                </div>
            </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Team */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-bold">Nhân viên</h3>
                     <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20}/></button>
                </div>
                <div className="space-y-5">
                    <MemberItem name="Nguyễn Văn A" role="Manager" status="Online" img="1" />
                    <MemberItem name="Trần Thị B" role="Support" status="Busy" img="5" />
                    <MemberItem name="Lê Văn C" role="Dev" status="Offline" img="3" />
                </div>
            </div>

            {/* Progress Donut */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm flex flex-col items-center justify-center relative">
                 <h3 className="text-lg font-bold self-start w-full mb-2">Đánh giá</h3>
                 <div className="relative w-40 h-40 flex items-center justify-center mt-2">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="#E5E7EB" strokeWidth="15" fill="transparent" />
                        <circle cx="80" cy="80" r="70" stroke="#1B4DFF" strokeWidth="15" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * 4.5) / 5} strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-center">
                        <span className="text-3xl font-bold text-gray-800">{data.avgRating}</span>
                        <p className="text-xs text-gray-400">Sao</p>
                    </div>
                 </div>
            </div>

            {/* Time Tracker */}
            <div className="bg-black text-white p-6 rounded-[32px] shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div>
                    <h3 className="text-gray-400 text-sm">Thời gian hoạt động</h3>
                    <div className="text-4xl font-mono mt-4 font-bold tracking-widest">08:24:12</div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform">
                        <div className="w-3 h-3 bg-black rounded-sm"></div>
                    </button>
                    <button className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </button>
                </div>
                 {/* Abstract Waves */}
                 <div className="absolute right-0 bottom-0 opacity-20">
                     <svg width="200" height="150" viewBox="0 0 200 150">
                        <path fill="none" stroke="white" strokeWidth="2" d="M0,100 Q50,50 100,100 T200,100" />
                        <path fill="none" stroke="white" strokeWidth="2" d="M0,120 Q50,70 100,120 T200,120" />
                        <path fill="none" stroke="white" strokeWidth="2" d="M0,140 Q50,90 100,140 T200,140" />
                     </svg>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}

// Helper Components (Giữ nguyên trong file này hoặc tách ra file utils/UIComponents.js)
function StatCard({ title, value, trend, icon, isWarning }) {
  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center">
            {icon}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${isWarning ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {trend}
        </span>
        <span className="text-gray-400 text-xs">so với hôm qua</span>
      </div>
    </div>
  );
}

function ProductItem({ name, date, icon, color }) {
    return (
        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color}`}>
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 text-sm">{name}</h4>
                    <p className="text-xs text-gray-400">Due: {date}</p>
                </div>
            </div>
            <button className="text-gray-300 hover:text-blue-600"><MoreHorizontal size={18}/></button>
        </div>
    )
}

function MemberItem({ name, role, status, img }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={`https://i.pravatar.cc/150?img=${img}`} alt={name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                <div>
                    <h4 className="font-bold text-sm text-gray-800">{name}</h4>
                    <p className="text-xs text-gray-400">{role}</p>
                </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                status === 'Online' ? 'bg-green-100 text-green-600' : 
                status === 'Busy' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
            }`}>
                {status}
            </span>
        </div>
    )
}