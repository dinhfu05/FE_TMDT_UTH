import React from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
//customer pages
import Login from "../services/auth/login";
import CustomerLayout from "../layout/CustomerLayout";
import AdminLayout from "../layout/AdminLayout";
import HomePage from "../pages/customer/HomePage";
import CartPage from "../pages/customer/cartPage";
import ProfilePage from "../pages/customer/ProfilePage";
import CheckoutPage from "../pages/customer/CheckoutPage";
import MyOrdersPage from "../pages/customer/MyOrdersPage";
import ProductDetailPage from "../pages/customer/ProductDetailPage";
import BuyNowPage from "../pages/customer/BuyNowPage";
import NewsPage from "../pages/customer/NewsPage";
import AboutPage from "../pages/customer/AboutPage";
import CategoryPage from "../pages/customer/CategoryPage";

//admin pages
import TongQuan from "../pages/admin/Tongquan";
import OrderManagement from "../pages/admin/OrderManagement";
import ProductManagemenr from "../pages/admin/ProductManagemenr";
import CustomerManagement from "../pages/admin/CustomerManagement";
import MembershipTierManagement from "../pages/admin/MembershipTierManagement";

const routes = [
  // Admin route (bắt buộc login + role admin)
  {
    path: "/admin",
    element: (
      <ProtectedRoute element={<AdminLayout />} allowedUsers={["ROLE_ADMIN"]} />
    ),
    children: [
      { index: true, element: <TongQuan /> },
      { path: "orders", element: <OrderManagement /> },
      { path: "products", element: <ProductManagemenr /> },
      { path: "customers", element: <CustomerManagement /> },
      { path: "membership-tiers", element: <MembershipTierManagement /> },
      { path: "*", element: <Navigate to="/admin" replace /> },
    ],
  },

  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "cart", element: <CartPage /> },
      { path: "login", element: <Login /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "my-orders", element: <MyOrdersPage /> },
      { path: "category/:categoryId", element: <CategoryPage /> },
      { path: "/product/:productId", element: <ProductDetailPage /> },
      { path: "buy-now", element: <BuyNowPage /> },
      { path: "news", element: <NewsPage /> },
      { path: "about", element: <AboutPage /> },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export default routes;
