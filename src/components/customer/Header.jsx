import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, ChevronDown } from 'lucide-react';
import { Package, LogOut, LogIn } from "lucide-react";

import { categoryService } from '../../services/api/apiService';
import cartApi from '../../services/api/cartService';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const categoryDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!token);

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories(1, 50);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetch cart count
    const fetchCartCount = async () => {
      if (!token) {
        setCartCount(0);
        return;
      }
      try {
        const data = await cartApi.getCart();
        const totalCount = data?.cartItemResponseDTOs?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalCount);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartCount(0);
      }
    };

    fetchCategories();
    fetchCartCount();

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen to cartUpdated event
  useEffect(() => {
    const onCartUpdated = (e) => setCartCount(e.detail);
    window.addEventListener("cartUpdated", onCartUpdated);
    return () => window.removeEventListener("cartUpdated", onCartUpdated);
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
    setShowCategoryDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCartCount(0);
    setShowUserDropdown(false);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded"></div>
            <span className="font-bold text-xl">Tenbrand</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Home
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Shop
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition"
              >
                <span>Categories</span>
                <ChevronDown 
                  size={16}
                  className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fade-in">
                  {categories.map((category) => (
                    <button
                      key={category.categoryId}
                      onMouseDown={() => handleCategoryClick(category.categoryId)}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-between"
                    >
                      <span>{category.categoryName}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {category.productCount}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition">
              About
            </Link>


           <Link to="/news" className="text-gray-700 hover:text-blue-600 font-medium transition">
              News
            </Link>
          </nav>


          {/* Right side - Cart & User */}
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="text-gray-700 hover:text-blue-600 transition mt-2"
              >
                <User size={22} />
              </button>

              {showUserDropdown && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fade-in">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <User size={18} /> Thông tin tài khoản
                      </Link>

                      <Link
                        to="/my-orders"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <Package size={18} /> Lịch sử đơn hàng
                      </Link>

                      <hr className="my-2" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={18} /> Đăng xuất
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <LogIn size={18} /> Đăng nhập
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </header>
  );
};

export default Header;
