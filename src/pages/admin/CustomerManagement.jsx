import React, { useState, useEffect, useMemo } from "react";
import {
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Star,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  X,
  User,
  Calendar,
} from "lucide-react";
import axios from "axios";

// --- IMPORT COMPONENTS ---
import Sidebar from "../../components/admin/SideBar";
import Header from "../../components/admin/Header";

// --- CẤU HÌNH ---
const API_BASE_URL = "http://localhost:8080/api";
const IMAGE_BASE_URL = "http://localhost:8080/api/image";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Helper format ngày hiển thị
const formatDateDisplay = (dateString) => {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // State cho Modal Xem Chi Tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // STATE SORT: Lưu key và direction ('asc' | 'desc')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/customer`, {
        params: { page, size: pageSize },
        headers,
      });

      if (response.data.success) {
        setCustomers(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      if (error.response?.status === 401) window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  // --- VIEW DETAIL ---
  const handleViewDetail = async (id) => {
    try {
      const headers = getAuthHeaders();
      // Gọi API lấy chi tiết 1 khách hàng
      const res = await axios.get(`${API_BASE_URL}/customer/${id}`, {
        headers,
      });
      if (res.data.success) {
        setSelectedCustomer(res.data.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      alert("Không thể xem chi tiết khách hàng này.");
    }
  };

  // --- DELETE CUSTOMER ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/customer/${id}`, {
        headers: getAuthHeaders(),
      });
      fetchData(); // Reload lại danh sách sau khi xóa
      alert("Đã xóa thành công!");
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert(
        "Không thể xóa khách hàng này (Có thể do ràng buộc dữ liệu đơn hàng)."
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  // --- LOGIC SORT ---
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomers = useMemo(() => {
    let sortableItems = [...customers];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key] || "";
        let bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [customers, sortConfig]);

  const renderSortHeader = (label, key) => {
    return (
      <th
        className="p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors select-none"
        onClick={() => handleSort(key)}
      >
        <div className="flex items-center gap-1">
          {label}
          <span className="ml-1">
            {sortConfig.key === key ? (
              sortConfig.direction === "asc" ? (
                <ArrowUp size={14} className="text-blue-600" />
              ) : (
                <ArrowDown size={14} className="text-blue-600" />
              )
            ) : (
              <ArrowUpDown size={14} className="text-gray-400" />
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans text-gray-800">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <Header
          title="Quản lý Thành viên"
          subtitle="Xem và quản lý danh sách khách hàng"
          user={{
            name: "Admin",
            email: "admin@tenbrand.com",
            avatar: "https://i.pravatar.cc/150?img=12",
          }}
        />

        <div className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="hidden md:flex bg-white rounded-xl shadow-sm px-4 py-2.5 border border-gray-100 w-96 items-center gap-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
                <tr>
                  {renderSortHeader("Thành viên", "fullName")}
                  {renderSortHeader("Email", "email")}
                  {renderSortHeader("Hạng", "membership")}
                  {renderSortHeader("Trạng thái", "status")}
                  <th className="p-4 border-b text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : sortedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      Chưa có khách hàng nào
                    </td>
                  </tr>
                ) : (
                  sortedCustomers.map((customer) => (
                    <tr
                      key={customer.customerId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              customer.image
                                ? `${IMAGE_BASE_URL}/${customer.image}`
                                : `https://ui-avatars.com/api/?name=${customer.userName}&background=random`
                            }
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/40")
                            }
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {customer.fullName || customer.userName}
                            </div>
                            <div className="text-xs text-gray-500">
                              @{customer.userName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2">
                            <Mail size={14} /> {customer.email}
                          </span>
                          <span className="flex items-center gap-2">
                            <Phone size={14} /> {customer.phone || "---"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border"
                          style={{
                            backgroundColor: customer.colorMembership
                              ? `${customer.colorMembership}20`
                              : "#F3F4F6",
                            color: customer.colorMembership || "#6B7280",
                            borderColor: customer.colorMembership || "#E5E7EB",
                          }}
                        >
                          <Star size={12} fill="currentColor" />
                          {customer.membership || "Thành viên"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            customer.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Nút Xem Chi Tiết */}
                          <button
                            onClick={() =>
                              handleViewDetail(customer.customerId)
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>

                          {/* Nút Xóa */}
                          <button
                            onClick={() => handleDelete(customer.customerId)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa thành viên"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="p-4 flex justify-end gap-2 mt-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={customers.length < pageSize}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>

      {/* --- MODAL CHI TIẾT KHÁCH HÀNG --- */}
      {isDetailModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            {/* Header Modal */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex flex-col items-center">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <img
                src={
                  selectedCustomer.image
                    ? `${IMAGE_BASE_URL}/${selectedCustomer.image}`
                    : `https://ui-avatars.com/api/?name=${selectedCustomer.userName}&background=random`
                }
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-3"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/100")
                }
              />
              <h2 className="text-xl font-bold text-white">
                {selectedCustomer.fullName}
              </h2>
              <p className="text-blue-100 text-sm">
                @{selectedCustomer.userName}
              </p>

              <div className="mt-4 flex gap-2">
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium backdrop-blur-sm border border-white/30 flex items-center gap-1">
                  <Star size={12} fill="currentColor" />{" "}
                  {selectedCustomer.membership}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/30 ${
                    selectedCustomer.status === "ACTIVE"
                      ? "bg-green-500/20 text-green-100"
                      : "bg-red-500/20 text-red-100"
                  }`}
                >
                  {selectedCustomer.status}
                </span>
              </div>
            </div>

            {/* Body Modal */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase font-semibold">
                    Email
                  </p>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <Mail size={14} className="text-blue-500" />{" "}
                    {selectedCustomer.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase font-semibold">
                    Số điện thoại
                  </p>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <Phone size={14} className="text-blue-500" />{" "}
                    {selectedCustomer.phone || "---"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase font-semibold">
                    Giới tính
                  </p>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <User size={14} className="text-blue-500" />{" "}
                    {selectedCustomer.gender === "MALE" ? "Nam" : "Nữ"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase font-semibold">
                    Ngày sinh
                  </p>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" />{" "}
                    {formatDateDisplay(selectedCustomer.date)}
                  </p>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="pt-4 mt-2 border-t flex justify-end">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-sm transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
