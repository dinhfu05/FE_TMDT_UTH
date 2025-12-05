import React from "react";
import { Search, Bell, MessageSquare } from "lucide-react";

export default function Header({ title, subtitle, user }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
      {/* Title Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 mt-1">{subtitle}</p>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-full shadow-sm pr-6">
        {/* Search */}
        <div className="bg-gray-100 flex items-center px-4 py-2.5 rounded-full w-64">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="bg-transparent outline-none text-sm w-full"
          />
          <span className="text-xs text-gray-400 border border-gray-300 rounded px-1.5 py-0.5">
            ⌘F
          </span>
        </div>

        {/* Icons */}
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 relative transition">
          <MessageSquare size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 relative transition">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-200 ml-2">
          <img
            src={user?.avatar || "https://i.pravatar.cc/150?img=12"}
            alt="User"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="hidden lg:block text-sm">
            <p className="font-bold">{user?.name || "Admin User"}</p>
            <p className="text-gray-400 text-xs">
              {user?.email || "admin@store.com"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
