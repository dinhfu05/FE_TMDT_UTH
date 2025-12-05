import React from "react";
import useDashboard from "../../hook/useDashboard";
import Sidebar from "../../components/admin/SideBar";
import Header from "../../components/admin/Header";
import MonthlyChart from "../../components/admin/MonthlyChart";
import TopProducts from "../../components/admin/TopProducts";
import {
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  MoreHorizontal,
  Plus,
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
          user={{
            name: "Admin",
            email: "a@example",
            avatar: "https://i.pravatar.cc/150?img=11",
          }}
        />

        {/* --- NỘI DUNG DASHBOARD (Giữ nguyên phần content cũ) --- */}

        {/* TOP CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Highlight */}
          <div className="bg-[#1B4DFF] text-white p-6 rounded-[32px] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-blue-100 font-medium">Doanh thu tháng</h3>
                <p className="text-3xl font-bold mt-2">
                  {data.monthlyRevenue.toLocaleString()} ₫
                </p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ArrowUpRight size={20} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-white text-xs">
                +12%
              </span>
              <span>so với tháng trước</span>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white opacity-10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          </div>

          <StatCard
            title="Đơn hàng mới"
            value={data.newOrders}
            trend="+5%"
            icon={<ShoppingCart size={20} className="text-gray-600" />}
          />
          <StatCard
            title="Khách hàng"
            value={data.customers}
            trend="+2.4%"
            icon={<Users size={20} className="text-gray-600" />}
          />
          <StatCard
            title="Sắp hết hàng"
            value={data.lowStock}
            trend="Cần nhập"
            isWarning
            icon={<Package size={20} className="text-gray-600" />}
          />
        </section>

        {/* MIDDLE SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Chart Area */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm xl:col-span-2 flex flex-col">
            {/* Header Biểu đồ */}
            <MonthlyChart data={data} />
          </div>

          {/* Product List */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm flex flex-col">
            <TopProducts />
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Team */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Nhân viên</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div className="space-y-5">
              <MemberItem
                name="Nguyễn Văn A"
                role="Manager"
                status="Online"
                img="1"
              />
              <MemberItem
                name="Trần Thị B"
                role="Support"
                status="Busy"
                img="5"
              />
              <MemberItem name="Lê Văn C" role="Dev" status="Offline" img="3" />
            </div>
          </div>

          {/* Progress Donut */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm flex flex-col items-center justify-center relative">
            <h3 className="text-lg font-bold self-start w-full mb-2">
              Đánh giá
            </h3>
            <div className="relative w-40 h-40 flex items-center justify-center mt-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#E5E7EB"
                  strokeWidth="15"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#1B4DFF"
                  strokeWidth="15"
                  fill="transparent"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * 4.5) / 5}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-bold text-gray-800">
                  {data.avgRating}
                </span>
                <p className="text-xs text-gray-400">Sao</p>
              </div>
            </div>
          </div>

          {/* Time Tracker */}
          <div className="bg-black text-white p-6 rounded-[32px] shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-gray-400 text-sm">Thời gian hoạt động</h3>
              <div className="text-4xl font-mono mt-4 font-bold tracking-widest">
                08:24:12
              </div>
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
                <path
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  d="M0,100 Q50,50 100,100 T200,100"
                />
                <path
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  d="M0,120 Q50,70 100,120 T200,120"
                />
                <path
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  d="M0,140 Q50,90 100,140 T200,140"
                />
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
        <span
          className={`px-2 py-0.5 rounded-md text-xs font-bold ${
            isWarning
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
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
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color}`}
        >
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-sm">{name}</h4>
          <p className="text-xs text-gray-400">Due: {date}</p>
        </div>
      </div>
      <button className="text-gray-300 hover:text-blue-600">
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
}

function MemberItem({ name, role, status, img }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={`https://i.pravatar.cc/150?img=${img}`}
          alt={name}
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
        />
        <div>
          <h4 className="font-bold text-sm text-gray-800">{name}</h4>
          <p className="text-xs text-gray-400">{role}</p>
        </div>
      </div>
      <span
        className={`text-[10px] font-bold px-2 py-1 rounded-full ${
          status === "Online"
            ? "bg-green-100 text-green-600"
            : status === "Busy"
            ? "bg-orange-100 text-orange-600"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {status}
      </span>
    </div>
  );
}
