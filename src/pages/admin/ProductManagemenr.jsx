import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Upload,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Layers,
  Tag,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Star,
} from "lucide-react";
import axios from "axios";

// --- IMPORT COMPONENTS ---
import Sidebar from "../../components/admin/SideBar";
import Header from "../../components/admin/Header";

// --- CẤU HÌNH ---
const API_BASE_URL = "http://localhost:8080/api";
const IMAGE_BASE_URL = "http://localhost:8080/api/image";

// DANH MỤC CỐ ĐỊNH (6 ID)
const CATEGORIES = [
  { id: 1, name: "Tee" },
  { id: 2, name: "Hoodie & Sweater" },
  { id: 3, name: "Pants" },
  { id: 4, name: "Shorts" },
  { id: 5, name: "Jacket" },
  { id: 6, name: "Accessory" },
];

// Helper: Lấy headers + Token
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
  };
};

const formatMoney = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State cho review modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] =
    useState(null);

  // State cho bộ lọc danh mục bên ngoài (Mặc định là 1)
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(1);

  // State Sort
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // State Form: Cấu trúc lồng nhau Product -> Colors -> Details
  const defaultFormState = {
    productName: "",
    unitPrice: 0,
    discount: 0,
    description: "",
    productImage: "", // Tên file ảnh chính
    categoryId: [1], // Mặc định là mảng chứa ID category
    productColors: [],
  };
  const [formData, setFormData] = useState(defaultFormState);

  // --- 1. API GỌI DANH SÁCH & TÍNH RATING ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        window.location.href = "/login";
        return;
      }

      // Gọi API lấy danh sách (có lọc theo category)
      const params = { page, size: pageSize };
      if (selectedCategoryFilter) {
        params.categoryId = selectedCategoryFilter;
      }

      const response = await axios.get(`${API_BASE_URL}/product`, {
        params: params,
        headers: headers,
      });

      if (response.data.success) {
        const rawProducts = response.data.data;

        // --- TÍNH RATING TRUNG BÌNH CHO TỪNG SẢN PHẨM ---
        // Gọi API lấy review song song cho các sản phẩm trong danh sách
        const enrichedProducts = await Promise.all(
          rawProducts.map(async (product) => {
            try {
              // Lấy tối đa 100 review để tính trung bình
              const reviewRes = await axios.get(
                `${API_BASE_URL}/product/${product.productId}/reviews`,
                {
                  params: { page: 1, size: 100 },
                  headers: headers,
                }
              );
              const reviews = reviewRes.data.data || [];

              let avgRating = 0;
              if (reviews.length > 0) {
                const totalStars = reviews.reduce(
                  (acc, r) => acc + r.rating,
                  0
                );
                avgRating = totalStars / reviews.length;
              }

              return {
                ...product,
                avgRating: avgRating,
                reviewCount: reviews.length,
              };
              // eslint-disable-next-line no-unused-vars
            } catch (err) {
              // Nếu lỗi lấy review thì mặc định 0 sao
              return { ...product, avgRating: 0, reviewCount: 0 };
            }
          })
        );

        setProducts(enrichedProducts);
      }
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      if (error.response?.status === 401) window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  // --- 2. API UPLOAD ẢNH (SINGLE FILE) ---
  const handleFileUpload = async (file) => {
    if (!file) return null;

    const uploadData = new FormData();
    // API yêu cầu key là 'file'
    uploadData.append("file", file);

    try {
      setUploading(true);
      const headers = getAuthHeaders(true); // Header multipart

      // Gọi POST /file-upload/image
      const res = await axios.post(
        `${API_BASE_URL}/file-upload/image`,
        uploadData,
        { headers }
      );

      if (res.data.success) {
        // API có thể trả về full path hoặc tên file đã đổi tên (có timestamp)
        const rawPath = res.data.data.fileName;

        // 1. Lấy tên file từ đường dẫn (loại bỏ src/main/...)
        let cleanFileName = rawPath.split(/[/\\]/).pop();

        // 2. YÊU CẦU: Xóa prefix timestamp để lấy tên gốc ngắn gọn
        cleanFileName = cleanFileName.replace(/^(Upload)?\d+_/, "");

        return cleanFileName;
      }
    } catch (error) {
      console.error("Upload thất bại:", error);
      alert("Lỗi khi upload ảnh, vui lòng thử lại!");
    } finally {
      setUploading(false);
    }
    return null;
  };

  // --- 3. XỬ LÝ FORM & INPUT ---

  // Upload ảnh chính sản phẩm
  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = await handleFileUpload(file);
      if (fileName) {
        setFormData((prev) => ({ ...prev, productImage: fileName }));
      }
    }
  };

  // Upload ảnh cho biến thể màu sắc
  const handleColorImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = await handleFileUpload(file);
      if (fileName) {
        const newColors = [...formData.productColors];
        newColors[index].productImage = fileName;
        setFormData({ ...formData, productColors: newColors });
      }
    }
  };

  // Submit (Tạo mới / Cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return alert("Vui lòng đợi ảnh upload xong!");

    try {
      const headers = getAuthHeaders();
      if (isEditing) {
        // PUT /product/{id}
        await axios.put(
          `${API_BASE_URL}/product/${formData.productId}`,
          formData,
          { headers }
        );
        alert("Cập nhật thành công!");
      } else {
        // POST /product
        await axios.post(`${API_BASE_URL}/product`, formData, { headers });
        alert("Thêm mới thành công!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi submit:", error);
      alert("Có lỗi xảy ra khi lưu sản phẩm.");
    }
  };

  // Xóa sản phẩm
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      // DELETE /product/{id}
      await axios.delete(`${API_BASE_URL}/product/${id}`, {
        headers: getAuthHeaders(),
      });
      fetchProducts();
      alert("Đã xóa thành công!");
    } catch (error) {
      console.error(error);
      alert("Lỗi xóa!");
    }
  };

  // --- LOGIC SORT ---
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = useMemo(() => {
    let sortableItems = [...products];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Xử lý chuỗi để sort không phân biệt hoa thường
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [products, sortConfig]);

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

  // --- HELPERS CHO FORM NESTED ---
  const addColor = () => {
    setFormData({
      ...formData,
      productColors: [
        ...formData.productColors,
        {
          color: "",
          productImage: "",
          productDetails: [{ size: "S", quantity: 0 }],
        },
      ],
    });
  };
  const removeColor = (index) => {
    const newColors = [...formData.productColors];
    newColors.splice(index, 1);
    setFormData({ ...formData, productColors: newColors });
  };
  const handleColorChange = (index, val) => {
    const newColors = [...formData.productColors];
    newColors[index].color = val;
    setFormData({ ...formData, productColors: newColors });
  };
  const addSize = (cIndex) => {
    const newColors = [...formData.productColors];
    newColors[cIndex].productDetails.push({ size: "M", quantity: 0 });
    setFormData({ ...formData, productColors: newColors });
  };
  const removeSize = (cIndex, dIndex) => {
    const newColors = [...formData.productColors];
    newColors[cIndex].productDetails.splice(dIndex, 1);
    setFormData({ ...formData, productColors: newColors });
  };
  const handleDetailChange = (cIndex, dIndex, field, val) => {
    const newColors = [...formData.productColors];
    newColors[cIndex].productDetails[dIndex][field] = val;
    setFormData({ ...formData, productColors: newColors });
  };

  const openCreateModal = () => {
    setFormData(defaultFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    // Đảm bảo có categoryId là mảng để API không lỗi
    setFormData({ ...product, categoryId: product.categoryId || [1] });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openReviewModal = (product) => {
    setSelectedProductForReview(product);
    setIsReviewModalOpen(true);
  };

  // Reload khi đổi trang hoặc đổi bộ lọc category
  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategoryFilter]);

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans text-gray-800">
      {/* 1. SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        {/* 3. HEADER */}
        <Header
          title="Quản lý Sản phẩm"
          subtitle="Danh sách và tồn kho sản phẩm"
          user={{
            name: "Admin",
            email: "admin@tenbrand.com",
            avatar: "https://i.pravatar.cc/150?img=12",
          }}
        />

        <div className="mt-6">
          <div className="flex justify-between items-center mb-6">
            {/* Bộ lọc và Tìm kiếm */}
            <div className="flex items-center gap-3">
              {/* Filter Dropdown */}
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-100 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm"
                  value={selectedCategoryFilter}
                  onChange={(e) =>
                    setSelectedCategoryFilter(Number(e.target.value))
                  }
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Filter
                  size={14}
                  className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                />
              </div>

              <div className="hidden md:flex bg-white rounded-xl shadow-sm px-4 py-2 border border-gray-100 w-64">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <Plus size={20} /> Thêm sản phẩm
            </button>
          </div>

          {/* --- TABLE DANH SÁCH --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
                <tr>
                  {renderSortHeader("Sản phẩm", "productName")}
                  {renderSortHeader("Giá bán", "unitPrice")}
                  <th className="p-4 border-b">Biến thể</th>
                  <th className="p-4 border-b text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : sortedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      Trống
                    </td>
                  </tr>
                ) : (
                  sortedProducts.map((item) => (
                    <tr key={item.productId} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`${IMAGE_BASE_URL}/${item.productImage}`}
                            alt=""
                            className="w-12 h-12 rounded-lg border object-cover bg-gray-100"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/50")
                            }
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.productName}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {item.description}
                            </div>

                            {/* HIỂN THỊ RATING STAR */}
                            <div className="flex items-center mt-1">
                              <span className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={10}
                                    fill={
                                      star <= Math.round(item.avgRating || 0)
                                        ? "currentColor"
                                        : "none"
                                    }
                                    className={
                                      star <= Math.round(item.avgRating || 0)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }
                                  />
                                ))}
                              </span>
                              <span className="text-[10px] text-gray-400 ml-1">
                                ({item.reviewCount || 0})
                              </span>
                            </div>

                            {/* Hiển thị badge danh mục */}
                            {item.categoryId && item.categoryId[0] && (
                              <span className="inline-block mt-1 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                {CATEGORIES.find(
                                  (c) => c.id === item.categoryId[0]
                                )?.name || `Category ${item.categoryId[0]}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium">
                        {formatMoney(item.unitPrice)}
                        {item.discount > 0 && (
                          <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">
                            -{item.discount}%
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Layers size={14} /> {item.productColors?.length || 0}{" "}
                          màu
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {/* Nút Xem Đánh Giá */}
                        <button
                          onClick={() => openReviewModal(item)}
                          className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Xem đánh giá"
                        >
                          <MessageSquare size={18} />
                        </button>

                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.productId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* --- MODAL FORM THÊM/SỬA --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-gray-100 p-1 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Thông tin cơ bản */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Tên sản phẩm
                    </label>
                    <input
                      required
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productName: e.target.value,
                        })
                      }
                      placeholder="Nhập tên sản phẩm..."
                    />
                  </div>

                  {/* Giá và Giảm giá */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Giá (VNĐ)
                      </label>
                      <input
                        required
                        type="number"
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.unitPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            unitPrice: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="w-1/3">
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Giảm (%)
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.discount}
                        onChange={(e) =>
                          setFormData({ ...formData, discount: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Category Dropdown (SỬA Ở ĐÂY) */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Danh mục
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={formData.categoryId[0] || 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categoryId: [parseInt(e.target.value)],
                        })
                      }
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upload Ảnh Chính */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Ảnh đại diện
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                      {formData.productImage ? (
                        <div className="relative group">
                          <img
                            src={`${IMAGE_BASE_URL}/${formData.productImage}`}
                            alt="Preview"
                            className="h-32 rounded-lg object-contain"
                          />
                          <label className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white cursor-pointer rounded-lg">
                            Thay đổi
                            <input
                              type="file"
                              hidden
                              onChange={handleMainImageChange}
                              accept="image/*"
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center py-4">
                          {uploading ? (
                            <Loader2
                              className="animate-spin text-blue-500"
                              size={32}
                            />
                          ) : (
                            <Upload className="text-gray-400" size={32} />
                          )}
                          <span className="text-sm text-gray-500 font-medium">
                            Nhấn để tải ảnh lên
                          </span>
                          <input
                            type="file"
                            hidden
                            onChange={handleMainImageChange}
                            accept="image/*"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    rows={12}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Mô tả chi tiết sản phẩm..."
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Khu vực Biến thể (Màu sắc & Size) */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                    <Layers size={20} className="text-blue-600" /> Biến thể sản
                    phẩm
                  </h3>
                  <button
                    type="button"
                    onClick={addColor}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                  >
                    + Thêm màu
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.productColors.map((color, cIndex) => (
                    <div
                      key={cIndex}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeColor(cIndex)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 bg-white rounded-full p-1 border hover:border-red-200"
                      >
                        <X size={16} />
                      </button>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        {/* Tên màu */}
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Tên màu
                          </label>
                          <input
                            type="text"
                            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ví dụ: Đen, Trắng..."
                            value={color.color}
                            onChange={(e) =>
                              handleColorChange(cIndex, e.target.value)
                            }
                          />
                        </div>

                        {/* Upload ảnh màu */}
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Ảnh biến thể
                          </label>
                          <div className="flex items-center gap-3 mt-1">
                            {color.productImage && (
                              <img
                                src={`${IMAGE_BASE_URL}/${color.productImage}`}
                                className="w-10 h-10 rounded-lg border object-cover bg-white"
                                alt=""
                              />
                            )}
                            <label className="cursor-pointer bg-white border hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-gray-600 shadow-sm">
                              <Upload size={16} /> Upload
                              <input
                                type="file"
                                hidden
                                onChange={(e) =>
                                  handleColorImageChange(cIndex, e)
                                }
                                accept="image/*"
                              />
                            </label>
                            <span className="text-xs text-gray-400 truncate">
                              {color.productImage || "Chưa có ảnh"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Danh sách Size */}
                      <div className="bg-white border rounded-lg p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Tag size={14} className="text-gray-400" />{" "}
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Size & Số lượng
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {color.productDetails.map((detail, dIndex) => (
                            <div
                              key={dIndex}
                              className="flex gap-1 items-center bg-gray-50 border rounded-lg p-1"
                            >
                              <input
                                type="text"
                                className="w-16 border rounded p-1 text-sm text-center font-medium uppercase"
                                placeholder="Size"
                                value={detail.size}
                                onChange={(e) =>
                                  handleDetailChange(
                                    cIndex,
                                    dIndex,
                                    "size",
                                    e.target.value
                                  )
                                }
                              />
                              <input
                                type="number"
                                className="w-20 border rounded p-1 text-sm text-center"
                                placeholder="SL"
                                value={detail.quantity}
                                onChange={(e) =>
                                  handleDetailChange(
                                    cIndex,
                                    dIndex,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                              />
                              <button
                                type="button"
                                onClick={() => removeSize(cIndex, dIndex)}
                                className="text-gray-400 hover:text-red-500 px-1"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addSize(cIndex)}
                            className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded font-medium border border-blue-100 border-dashed"
                          >
                            + Thêm size
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Form */}
              <div className="sticky bottom-0 bg-white pt-4 border-t flex justify-end gap-3 z-10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {uploading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  {isEditing ? "Lưu thay đổi" : "Tạo sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL QUẢN LÝ ĐÁNH GIÁ (REVIEWS) --- */}
      {isReviewModalOpen && selectedProductForReview && (
        <ReviewManagementModal
          product={selectedProductForReview}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </div>
  );
};

// --- COMPONENT CON: REVIEW MODAL ---
const ReviewManagementModal = ({ product, isOpen, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      // Lấy 100 review mới nhất (có thể thêm phân trang sau)
      const response = await axios.get(
        `${API_BASE_URL}/product/${product.productId}/reviews`,
        {
          params: { page: 1, size: 100 },
          headers: headers,
        }
      );
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải đánh giá:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      const headers = getAuthHeaders();
      await axios.delete(
        `${API_BASE_URL}/product/${product.productId}/reviews/${reviewId}`,
        { headers }
      );
      // Cập nhật lại danh sách sau khi xóa
      fetchReviews();
    } catch (error) {
      console.error("Lỗi xóa đánh giá:", error);
      alert("Không thể xóa đánh giá này.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, product]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header Modal */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Đánh giá sản phẩm
            </h2>
            <p className="text-sm text-gray-500 line-clamp-1">
              {product.productName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Modal (Danh sách Reviews) */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              <Loader2 className="animate-spin mr-2" size={20} /> Đang tải đánh
              giá...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <MessageSquare size={48} className="mx-auto mb-2 opacity-20" />
              <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors flex gap-4"
                >
                  {/* Avatar (Placeholder) */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {review.userNameCustomer
                        ? review.userNameCustomer.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-gray-800">
                          {review.userNameCustomer || "Khách hàng ẩn danh"}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review.reviewId)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                        title="Xóa đánh giá"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {review.reviewContent}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
