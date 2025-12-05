import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Tag,
  Percent,
  DollarSign,
  Palette,
} from "lucide-react";
import axios from "axios";

// --- IMPORT COMPONENTS ---
import Sidebar from "../../components/admin/SideBar";
import Header from "../../components/admin/Header";

const API_BASE_URL = "http://localhost:8080/api";

// Helper: Lấy headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const formatMoney = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

const MembershipTierManagement = () => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const defaultFormState = {
    description: "", // Tên hạng (Ví dụ: Vàng, Bạc)
    minimumSpending: 0,
    discountRate: 0,
    color: "#000000",
  };
  const [formData, setFormData] = useState(defaultFormState);

  // --- API CALLS ---
  const fetchTiers = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/membership-tier`, {
        headers,
      });
      if (response.data.success) {
        setTiers(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải hạng thành viên:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = getAuthHeaders();
      if (isEditing) {
        await axios.put(
          `${API_BASE_URL}/membership-tier/${formData.tiedId}`,
          formData,
          { headers }
        );
        alert("Cập nhật thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/membership-tier`, formData, {
          headers,
        });
        alert("Thêm hạng mới thành công!");
      }
      setIsModalOpen(false);
      fetchTiers();
    } catch (error) {
      console.error("Lỗi submit:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa hạng này?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/membership-tier/${id}`, {
        headers: getAuthHeaders(),
      });
      fetchTiers();
      alert("Đã xóa thành công!");
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert("Không thể xóa hạng này (có thể đang được sử dụng).");
    }
  };

  const openCreateModal = () => {
    setFormData(defaultFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (tier) => {
    setFormData(tier);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans text-gray-800">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <Header
          title="Quản lý Hạng thành viên"
          subtitle="Cấu hình các mức hạng và ưu đãi"
          user={{
            name: "Admin",
            email: "admin@tenbrand.com",
            avatar: "https://i.pravatar.cc/150?img=12",
          }}
        />

        <div className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-700">Danh sách hạng</h2>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <Plus size={20} /> Thêm hạng mới
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
                <tr>
                  <th className="p-4 border-b">Tên hạng</th>
                  <th className="p-4 border-b">Chi tiêu tối thiểu</th>
                  <th className="p-4 border-b">Giảm giá (%)</th>
                  <th className="p-4 border-b">Màu sắc</th>
                  <th className="p-4 border-b text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : (
                  tiers.map((tier) => (
                    <tr key={tier.tiedId} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">
                        {tier.description}
                      </td>
                      <td className="p-4">
                        {formatMoney(tier.minimumSpending)}
                      </td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                          {tier.discountRate}%
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: tier.color }}
                          ></div>
                          <span className="text-xs text-gray-500">
                            {tier.color}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(tier)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(tier.tiedId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? "Sửa hạng thành viên" : "Thêm hạng mới"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên hạng
                </label>
                <div className="relative">
                  <Tag
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    required
                    className="w-full border rounded-lg pl-9 p-2.5"
                    placeholder="VD: Vàng, Bạc..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Chi tiêu tối thiểu (VNĐ)
                </label>
                <div className="relative">
                  <DollarSign
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    required
                    type="number"
                    className="w-full border rounded-lg pl-9 p-2.5"
                    value={formData.minimumSpending}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimumSpending: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Giảm giá (%)
                </label>
                <div className="relative">
                  <Percent
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    required
                    type="number"
                    step="0.1"
                    className="w-full border rounded-lg pl-9 p-2.5"
                    value={formData.discountRate}
                    onChange={(e) =>
                      setFormData({ ...formData, discountRate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Màu sắc (Mã Hex)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="h-10 w-12 border rounded cursor-pointer"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="flex-1 border rounded-lg p-2.5 uppercase"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipTierManagement;
