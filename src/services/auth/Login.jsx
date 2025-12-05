// src/auth/AuthPage.jsx
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import * as toast from "../../components/shared/toast";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/customer/Breadcrumb";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", password: "" });

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleSignupChange = (e) =>
    setSignupData({ ...signupData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password)
      return toast.showError("Vui lòng nhập đầy đủ thông tin");
    setLoading(true);
    try {
      const isAdmin = loginData.username.toLowerCase() === "admin";
      const res = await fetch(
        `http://localhost:8080/api/auth/login?admin=${isAdmin}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );
      if (!res.ok) throw new Error("Sai tên đăng nhập hoặc mật khẩu");
      const response = await res.json();
      const token = response.data.accessToken;
      const role = response.data.role;
      const username = response.data.username;
      const customerId = response.data.customerId;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      localStorage.setItem("customerId", customerId);
      toast.showSuccess("Đăng nhập thành công!");
      setTimeout(() => {
        if (role === "ROLE_ADMIN") navigate("/admin");
        else navigate("/customer");
      }, 1000);
    } catch (err) {
      toast.showError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupData.username || !signupData.password)
      return toast.showError("Vui lòng nhập đầy đủ thông tin");
    if (signupData.password.length < 6)
      return toast.showError("Mật khẩu phải có ít nhất 6 ký tự");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Đăng ký thất bại");
      }
      toast.showSuccess("Đăng ký thành công! Chuyển đến đăng nhập...");
      setTimeout(() => {
        setIsLogin(true);
        setSignupData({ username: "", password: "" });
      }, 1500);
    } catch (err) {
      toast.showError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white ">
      <div className="p-6">
        {/* BREADCRUMB */}
        <Breadcrumb
          paths={[
            { label: "Trang chủ", link: "/" },
            { label: isLogin ? "Đăng nhập" : "Đăng ký" },
          ]}
        />
      </div>

      {/* Form container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-black">
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`flex-1 py-2 text-center ${
                isLogin
                  ? "border-b-2 border-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Đăng nhập
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                !isLogin
                  ? "border-b-2 border-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Đăng ký
            </button>
          </div>

          {/* Form */}
          {isLogin ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Tên đăng nhập*
                </label>
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  placeholder="Nhập tên đăng nhập"
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div className="relative">
                <label className="block mb-1 text-sm font-medium">
                  Mật khẩu*
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Nhập mật khẩu"
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 p-2.5 text-gray-700 hover:text-black transition"
                >
                  {showPass ? (
                    <MdVisibilityOff size={20} />
                  ) : (
                    <MdVisibility size={20} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-md font-semibold"
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </button>

              <div className="text-center mt-4">
                <span className="text-sm text-gray-500">
                  Hoặc đăng nhập qua
                </span>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded-md">
                    Facebook
                  </button>
                  <button className="flex-1 py-2 bg-red-600 text-white rounded-md">
                    Google
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Tên đăng nhập*
                </label>
                <input
                  type="text"
                  name="username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  placeholder="Nhập tên đăng nhập"
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div className="relative">
                <label className="block mb-1 text-sm font-medium">
                  Mật khẩu*
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="Nhập mật khẩu"
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 p-2.5 text-gray-700 hover:text-black transition"
                >
                  {showPass ? (
                    <MdVisibilityOff size={20} />
                  ) : (
                    <MdVisibility size={20} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-md font-semibold"
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
