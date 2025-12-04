import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/customer/Header";
import Footer from "../components/customer/Footer";

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer luôn nằm cuối */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;
