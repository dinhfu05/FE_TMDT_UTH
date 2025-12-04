import React from "react";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, Users, MessageSquare, BarChart3, Settings } from "lucide-react";
import Footer from "../components/customer/Footer";
// import SharedSidebar from "../components/shared/SharedSidebar";
// import SharedHeader from "../components/shared/SharedHeader";
// import Sidebar from "../components/admin/Sidebar";
// import Header from "../components/admin/Header"

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
         <Header /> 
        <main className="flex-0 overflow-y-auto bg-white p-6">
          <Outlet />
        </main>
      <Footer />
      </div>
  );
};

export default AdminLayout;