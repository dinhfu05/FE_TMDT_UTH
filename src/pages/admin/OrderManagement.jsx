import React, { useState, useEffect, useMemo } from "react";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpDown, // Icon sort mặc định
  ArrowUp, // Icon sort tăng dần
  ArrowDown, // Icon sort giảm dần
} from "lucide-react";
import axios from "axios";

// --- IMPORT COMPONENTS ---
import Sidebar from "../../components/admin/SideBar";
import Header from "../../components/admin/Header";

// --- CẤU HÌNH ---
const API_BASE_URL = "http://localhost:8080/api";
const IMAGE_BASE_URL = "http://localhost:8080/api/image";

// Danh sách trạng thái và màu sắc hiển thị
const STATUS_OPTS = [
  {
    value: "PLACED",
    label: "Mới đặt",
    color: "bg-blue-100 text-blue-700",
    icon: Clock,
  },
  {
    value: "PREPARING",
    label: "Đang chuẩn bị",
    color: "bg-yellow-100 text-yellow-700",
    icon: Package,
  },
  {
    value: "SHIPPED",
    label: "Đang giao",
    color: "bg-indigo-100 text-indigo-700",
    icon: Truck,
  },
  {
    value: "DELIVERED",
    label: "Đã giao",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  {
    value: "CANCELED",
    label: "Đã hủy",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
  {
    value: "RETURNED",
    label: "Trả hàng",
    color: "bg-gray-100 text-gray-700",
    icon: AlertCircle,
  },
];

// --- HELPERS ---

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const formatMoney = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusInfo = (status) =>
  STATUS_OPTS.find((s) => s.value === status) || STATUS_OPTS[0];

// --- COMPONENT CHÍNH ---

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // STATE SORT: Lưu key và direction ('asc' | 'desc')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        console.warn("Không tìm thấy token, chuyển hướng về trang login...");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/orders`, {
        params: { page, size: pageSize },
        headers: headers,
      });

      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách đơn hàng:", error);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 500)
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (
      !window.confirm(
        `Xác nhận đổi trạng thái đơn hàng #${orderId} sang ${newStatus}?`
      )
    )
      return;

    try {
      await axios.patch(`${API_BASE_URL}/orders/${orderId}`, null, {
        params: { status: newStatus },
        headers: getAuthHeaders(),
      });
      fetchOrders();
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái.");
      if (error.response?.status === 401) window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  // --- LOGIC SORT ---
  const handleSort = (key) => {
    let direction = "asc";
    // Nếu đang sort cột này rồi thì đảo chiều
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Tính toán danh sách đã sort (Client-side Sort trên trang hiện tại)
  const sortedOrders = useMemo(() => {
    let sortableItems = [...orders];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Xử lý null/undefined (đưa xuống cuối)
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

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
  }, [orders, sortConfig]);

  // Helper render icon sort
  const renderSortHeader = (label, key) => {
    return (
      <th
        className="p-4 font-semibold border-b cursor-pointer hover:bg-gray-100 transition-colors select-none"
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
      <Sidebar newOrdersCount={0} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <Header
          title="Quản lý đơn hàng"
          subtitle="Theo dõi và xử lý danh sách đơn hàng"
          user={{
            name: "Admin",
            email: "admin@tenbrand.com",
            avatar: "https://i.pravatar.cc/150?img=11",
          }}
        />

        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    {/* Áp dụng Sort cho các cột */}
                    {renderSortHeader("Mã ĐH", "orderId")}
                    {renderSortHeader("Sản phẩm chính", "orderFirstName")}
                    {renderSortHeader("Tổng tiền", "totalAmount")}
                    {renderSortHeader("Ngày giao", "deliveryDate")}
                    {renderSortHeader("Trạng thái", "status")}

                    <th className="p-4 font-semibold border-b text-right">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : sortedOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  ) : (
                    // Render sortedOrders thay vì orders gốc
                    sortedOrders.map((order) => {
                      const statusInfo = getStatusInfo(order.status);
                      return (
                        <tr
                          key={order.orderId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 font-medium text-gray-900">
                            #{order.orderId}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={`${IMAGE_BASE_URL}/${order.orderFirstImage}`}
                                alt="Product"
                                className="w-10 h-10 rounded-lg object-cover bg-gray-200"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/40")
                                }
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {order.orderFirstName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {order.orderQuantity > 1
                                    ? `+${
                                        order.orderQuantity - 1
                                      } sản phẩm khác`
                                    : "Số lượng: 1"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-gray-700">
                            {formatMoney(order.totalAmount)}
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {formatDate(order.deliveryDate)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
                            >
                              <statusInfo.icon size={12} />
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrderId(order.orderId)}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* PHÂN TRANG */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Trang {page}</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={orders.length < pageSize}
                  className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL CHI TIẾT */}
        {selectedOrderId && (
          <OrderDetailModal
            orderId={selectedOrderId}
            onClose={() => setSelectedOrderId(null)}
            onUpdateStatus={updateOrderStatus}
          />
        )}
      </main>
    </div>
  );
};

// --- COMPONENT CON: MODAL CHI TIẾT ---
const OrderDetailModal = ({ orderId, onClose, onUpdateStatus }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
          headers: getAuthHeaders(),
        });
        if (res.data.success) {
          setDetail(res.data.data);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [orderId]);

  if (!detail && !loading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">
            Chi tiết đơn hàng #{orderId}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Đang tải thông tin chi tiết...
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-900 border-b pb-2 mb-2">
                    Thông tin nhận hàng
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-800">
                        Người nhận:
                      </span>{" "}
                      <span>{detail.recipientName}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-800">SĐT:</span>{" "}
                      <span>{detail.phoneNumber}</span>
                    </p>
                    <p className="flex flex-col gap-1">
                      <span className="font-medium text-gray-800">
                        Địa chỉ:
                      </span>
                      <span className="text-gray-600 pl-2 border-l-2 border-gray-300">
                        {detail.detailedAddress}, {detail.ward},{" "}
                        {detail.province}
                      </span>
                    </p>
                    <div className="flex justify-between items-start pt-2 border-t border-gray-200 mt-2">
                      <span className="font-medium text-gray-800 mt-1">
                        Thanh toán:
                      </span>
                      <div className="text-right">
                        {(() => {
                          const hasZaloId =
                            detail.zaloAppTransId !== null &&
                            detail.zaloAppTransId !== undefined;

                          return (
                            <>
                              <span
                                className={
                                  hasZaloId
                                    ? "text-green-600 font-bold"
                                    : "text-orange-500 font-bold"
                                }
                              >
                                {hasZaloId
                                  ? "Đã thanh toán"
                                  : "Chưa thanh toán"}
                              </span>
                              <div className="text-xs text-gray-400 font-normal mt-0.5">
                                {hasZaloId
                                  ? `Qua ZaloPay`
                                  : "Thanh toán khi nhận hàng (COD)"}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b pb-2 mb-2">
                    Cập nhật trạng thái
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="text-sm text-gray-500">
                      Trạng thái hiện tại:{" "}
                      <span className="font-bold text-gray-800 bg-gray-200 px-2 py-0.5 rounded">
                        {detail.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => onUpdateStatus(orderId, opt.value)}
                          disabled={detail.status === opt.value}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200
                                                        ${
                                                          detail.status ===
                                                          opt.value
                                                            ? "bg-gray-800 text-white border-gray-800 cursor-default shadow-sm"
                                                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm"
                                                        }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={18} /> Sản phẩm ({detail.orderDetails.length})
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-3">Sản phẩm</th>
                        <th className="p-3">Phân loại</th>
                        <th className="p-3 text-right">Đơn giá</th>
                        <th className="p-3 text-center">SL</th>
                        <th className="p-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {detail.orderDetails.map((item) => (
                        <tr
                          key={item.orderDetailId}
                          className="hover:bg-gray-50"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={`${IMAGE_BASE_URL}/${item.productImage}`}
                                className="w-10 h-10 object-cover rounded bg-gray-100 border border-gray-200"
                                alt=""
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/40")
                                }
                              />
                              <span className="font-medium text-gray-800 line-clamp-1">
                                {item.productName}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-gray-500">
                            {item.color} / {item.size}
                          </td>
                          <td className="p-3 text-right">
                            {formatMoney(item.price)}
                          </td>
                          <td className="p-3 text-center font-medium">
                            {item.quantity}
                          </td>
                          <td className="p-3 text-right font-medium text-gray-900">
                            {formatMoney(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <div className="w-full md:w-1/3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tổng tiền hàng:</span>
                    <span>
                      {formatMoney(
                        detail.totalAmount -
                          detail.shippingFee +
                          detail.discountAmount
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span>{formatMoney(detail.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatMoney(detail.discountAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-300 pt-3 mt-2">
                    <span>Tổng thanh toán:</span>
                    <span className="text-blue-600">
                      {formatMoney(detail.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
