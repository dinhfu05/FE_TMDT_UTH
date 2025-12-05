import React, { useEffect, useState } from "react";
import orderApi from "../../services/api/orderApi";
// Import đúng đường dẫn file api.js
import { productService } from "../../services/api/apiService";
import { showError, showSuccess } from "../../components/shared/toast";
import Breadcrumb from "../../components/customer/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const statusFilters = [
  "ALL",
  "PLACED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
  "RETURNED",
];

const statusStyles = {
  PLACED: "bg-blue-100 text-blue-600",
  PREPARING: "bg-yellow-100 text-yellow-700",
  SHIPPED: "bg-orange-100 text-orange-600",
  DELIVERED: "bg-green-100 text-green-600",
  CANCELED: "bg-red-300 text-gray-800",
  RETURNED: "bg-gray-100 text-red-600",
};

const statusTextMap = {
  PLACED: "Đã xác nhận",
  PREPARING: "Đang chuẩn bị",
  SHIPPED: "Đang giao hàng",
  DELIVERED: "Đã nhận hàng",
  CANCELED: "Đã hủy",
  RETURNED: "Đã trả hàng",
};

const getImageByColor = (item) => {
  if (item.color && item.productColors?.length > 0) {
    const colorOption = item.productColors.find(
      (c) => c.color.toLowerCase() === item.color.toLowerCase()
    );
    return colorOption?.productImage || item.productImage;
  }
  return item.productImage;
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // số đơn mỗi trang

  // --- STATE CHO REVIEW ---
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewItem, setReviewItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const navigate = useNavigate();

  const handleConfirmReturn = () => {
    setShowReturnModal(false);
    showSuccess("Trả hàng thành công");
  };

  const handleApiError = (err, defaultMsg) => {
    const message = err?.response?.data?.message || err?.message || defaultMsg;
    showError(message);
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await orderApi.getMyOrders({ page: 1, size: 1000 });
      if (res.success) setOrders(res.data || []);
    } catch (err) {
      handleApiError(err, "Không thể tải danh sách đơn hàng");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchOrderDetail = async (orderId) => {
    try {
      setLoadingDetail(true);
      const res = await orderApi.getById(orderId);
      if (res.success) setSelectedOrder(res.data || null);
    } catch (err) {
      handleApiError(err, "Không thể tải chi tiết đơn hàng");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setLoadingDetail(true);
      const res = await orderApi.cancelOrder(orderId);
      if (res.success) {
        setSelectedOrder(res.data);
        showSuccess("Đơn hàng đã được hủy thành công.");

        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId ? { ...o, status: "CANCELED" } : o
          )
        );
      }
    } catch (err) {
      handleApiError(err, "Không thể hủy đơn hàng");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOpenReview = (item) => {
    setReviewItem(item);
    setReviewRating(5);
    setReviewContent("");
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewContent.trim()) {
      showError("Vui lòng nhập nội dung đánh giá");
      return;
    }

    if (!reviewItem || !reviewItem.orderDetailId) {
      showError("Lỗi: Không tìm thấy thông tin đơn hàng chi tiết.");
      return;
    }

    try {
      setSubmittingReview(true);

      const payload = {
        rating: parseInt(reviewRating),
        reviewContent: reviewContent,
      };

      const res = await productService.createReview(
        reviewItem.productId,
        reviewItem.orderDetailId,
        payload
      );

      if (res.success) {
        showSuccess("Đánh giá sản phẩm thành công!");
        setShowReviewModal(false);

        // --- OPTIMISTIC UPDATE: Cập nhật UI ngay lập tức ---
        if (selectedOrder) {
          // 1. Cập nhật chi tiết đơn hàng đang mở
          // Tìm đúng item vừa đánh giá và set isReview = true (Boolean)
          const updatedDetails = selectedOrder.orderDetails.map((d) =>
            d.orderDetailId === reviewItem.orderDetailId
              ? { ...d, isReview: true } // Dùng true để khớp với kiểu Boolean từ Backend
              : d
          );

          setSelectedOrder({
            ...selectedOrder,
            orderDetails: updatedDetails,
          });

          // 2. Cập nhật danh sách đơn hàng bên ngoài
          // Đánh dấu order này là "Đã đánh giá" (isReview = true)
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.orderId === selectedOrder.orderId
                ? { ...order, isReview: true } // Dùng true để khớp với kiểu Boolean từ Backend
                : order
            )
          );
        }
      } else {
        showError(res.message || "Lỗi khi gửi đánh giá");
      }
    } catch (err) {
      console.error(err);
      showError("Lỗi hệ thống khi gửi đánh giá");
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    filterStatus === "ALL"
      ? orders
      : orders.filter((o) => o.status?.toUpperCase() === filterStatus);
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  // eslint-disable-next-line no-unused-vars
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // eslint-disable-next-line no-unused-vars
  const totalPaymentPerOrder = orders.reduce((acc, order) => {
    acc[order.orderId] = (order.totalAmount || 0) + (order.shippingFee || 0);
    return acc;
  }, {});
  // --- VIEW 1: DANH SÁCH ĐƠN HÀNG (List View) ---
  if (!selectedOrder) {
    const totalPaymentPerOrder = orders.reduce((acc, order) => {
      acc[order.orderId] = (order.totalAmount || 0) + (order.shippingFee || 0);
      return acc;
    }, {});
    if (!selectedOrder) {
      return (
        <div className="max-w-7xl mx-auto py-6 px-4">
          <Breadcrumb
            paths={[{ label: "Home", link: "/" }, { label: "My Orders" }]}
          />
          <h2 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h2>

          {/* Filter trạng thái */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setCurrentPage(1); // reset trang khi đổi filter
                }}
                className={`px-4 py-2 rounded-full font-medium border transition ${
                  filterStatus === status
                    ? `bg-blue-600 text-white border-blue-600`
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                {statusTextMap[status] || status}
              </button>
            ))}
          </div>

          {/* Danh sách đơn hàng */}
          <div className="space-y-3">
            {loadingOrders ? (
              <p className="text-center py-8 text-gray-500">Đang tải...</p>
            ) : paginatedOrders.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                Không có đơn hàng nào.
              </p>
            ) : (
              paginatedOrders.map((order) => (
                <div
                  key={order.orderId}
                  onClick={() => fetchOrderDetail(order.orderId)}
                  className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>
                          Đơn hàng:{" "}
                          <strong className="text-gray-900">
                            #{order.orderId}
                          </strong>
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>
                          Ngày giao dự kiến:{" "}
                          <strong className="text-gray-900">
                            {order.deliveryDate
                              ? new Date(order.deliveryDate).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "-"}
                          </strong>
                        </span>
                      </div>
                      {order.status && (
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded ${
                            statusStyles[order.status.toUpperCase()] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {statusTextMap[order.status.toUpperCase()] ||
                            order.status}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                          {order.orderFirstImage ? (
                            <img
                              src={`http://localhost:8080/api/image/${order.orderFirstImage}`}
                              alt={order.orderFirstName}
                              className="w-20 h-20 object-cover rounded"
                            />
                          ) : (
                            <svg
                              className="w-10 h-10 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-base text-gray-900 mb-1">
                            {order.orderFirstName}
                          </p>
                          {order.orderQuantity > 1 && (
                            <p className="text-sm text-gray-500">
                              Cùng với {order.orderQuantity - 1} sản phẩm khác
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-500 text-lg mb-1">
                          {totalPaymentPerOrder[order.orderId]?.toLocaleString(
                            "vi-VN"
                          ) + "đ" || "0đ"}
                        </p>
                        {order.status === "DELIVERED" && (
                          <p className="text-sm mb-2">
                            {order.isReview ? (
                              <span className="text-green-600 font-medium">
                                Đã đánh giá
                              </span>
                            ) : (
                              <span className="text-gray-500 font-medium">
                                Chưa đánh giá
                              </span>
                            )}
                          </p>
                        )}
                        <button className="text-blue-600 text-sm font-medium hover:underline">
                          Xem chi tiết →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Nút phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${
                      page === currentPage ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      );
    }
  }
  {
    totalPages > 1 && (
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded ${
              page === currentPage ? "bg-blue-600 text-white" : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  }
  // --- VIEW 2: CHI TIẾT ĐƠN HÀNG (Detail View) ---
  const detail = selectedOrder;

  return (
    <div className="w-full bg-gray-200 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <button
          onClick={() => setSelectedOrder(null)}
          className="mb-4 text-blue-600 hover:underline flex items-center gap-1"
        >
          ← Quay lại danh sách
        </button>

        {loadingDetail ? (
          <p className="text-center py-8">Đang tải chi tiết...</p>
        ) : (
          <div className="space-y-4">
            {/* Tổng quan */}
            <div className="bg-white border border-gray-200 rounded-3xl p-4">
              <h3 className="font-bold text-lg mb-3">Tổng quan</h3>
              <div className="flex justify-between items-start mb-3">
                <div className="text-sm text-gray-600">
                  <span>
                    Đơn hàng:{" "}
                    <strong className="text-gray-900">#{detail.orderId}</strong>
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span>
                    Ngày giao dự kiến:{" "}
                    <strong className="text-gray-900">
                      {detail.deliveryDate
                        ? new Date(detail.deliveryDate).toLocaleDateString(
                            "vi-VN"
                          )
                        : "-"}
                    </strong>
                  </span>
                </div>
                {detail.status && (
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded ${
                      statusStyles[detail.status.toUpperCase()] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {statusTextMap[detail.status.toUpperCase()] ||
                      detail.status}
                  </span>
                )}
              </div>

              <div className="border-t pt-4 space-y-6">
                {detail.orderDetails?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          getImageByColor(item)
                            ? `http://localhost:8080/api/image/${getImageByColor(
                                item
                              )}`
                            : "https://via.placeholder.com/80"
                        }
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <div>
                        <p className="font-semibold text-base">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.price
                            ? Number(item.price).toLocaleString("vi-VN") + "đ"
                            : ""}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.color ? item.color : ""}
                          {item.color && item.size ? ", " : ""}
                          {item.size ? item.size : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-sm text-gray-600 mr-2">
                        SL:{" "}
                        <span className="font-semibold">{item.quantity}</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/product/${item.productId}`, {
                              state: { product: item },
                            })
                          }
                          className="border border-green-500 text-green-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-50 transition whitespace-nowrap"
                        >
                          Mua lại
                        </button>

                        {/* Nút Đánh giá: Chỉ hiện khi Đã giao & isReview không phải là true */}
                        {detail.status === "DELIVERED" && !item.isReview && (
                          <button
                            onClick={() => handleOpenReview(item)}
                            className="border border-yellow-500 text-yellow-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-yellow-50 transition whitespace-nowrap"
                          >
                            Đánh giá
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tiến trình đơn hàng */}
            <div className="bg-white border border-gray-200 rounded-3xl p-4">
              {detail.status === "CANCELED" ? (
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <p className="font-bold text-red-600 text-lg">Đã hủy</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Đơn hàng này đã được hủy.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-6">
                  {/* Step 1 */}
                  <div className="flex-1 text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-2">
                      ✓
                    </div>
                    <p className="text-sm font-medium text-blue-600">
                      Đặt hàng thành công
                    </p>
                    <p className="text-xs text-gray-500">
                      {detail.orderDate
                        ? new Date(detail.orderDate).toLocaleString("vi-VN")
                        : ""}
                    </p>
                  </div>
                  <div className="flex-1 h-0.5 bg-blue-500"></div>
                  {/* Step 2 */}
                  <div className="flex-1 text-center">
                    <div
                      className={`w-8 h-8 rounded-full ${
                        detail.status === "SHIPPED" ||
                        detail.status === "DELIVERED"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300"
                      } flex items-center justify-center mx-auto mb-2`}
                    >
                      {detail.status === "SHIPPED" ||
                      detail.status === "DELIVERED"
                        ? "✓"
                        : "2"}
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        detail.status === "SHIPPED" ||
                        detail.status === "DELIVERED"
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      Đang giao hàng
                    </p>
                    <p className="text-xs text-gray-500">
                      {detail.shippedDate
                        ? new Date(detail.shippedDate).toLocaleString("vi-VN")
                        : ""}
                    </p>
                  </div>
                  <div
                    className={`flex-1 h-0.5 ${
                      detail.status === "DELIVERED"
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  {/* Step 3 */}
                  <div className="flex-1 text-center">
                    <div
                      className={`w-8 h-8 rounded-full ${
                        detail.status === "DELIVERED"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300"
                      } flex items-center justify-center mx-auto mb-2`}
                    >
                      {detail.status === "DELIVERED" ? "✓" : "3"}
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        detail.status === "DELIVERED"
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      Đã nhận hàng
                    </p>
                    <p className="text-xs text-gray-500">
                      {detail.deliveredDate
                        ? new Date(detail.deliveredDate).toLocaleString("vi-VN")
                        : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Thông tin khách hàng */}
              <div className="bg-white border border-gray-200 rounded-3xl p-4">
                <h3 className="font-bold text-base mb-3">
                  Thông tin khách hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Họ và tên:</span>
                    <span className="font-medium text-right">
                      {detail.recipientName || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số điện thoại:</span>
                    <span className="font-medium">
                      {detail.phoneNumber || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Địa chỉ:</span>
                    <span className="font-medium text-right">
                      {detail.detailedAddress
                        ? `${detail.detailedAddress}, ${detail.ward || ""}, ${
                            detail.province || ""
                          }`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ghi chú:</span>
                    <span className="font-medium text-right">
                      {detail.note || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thông tin thanh toán */}
              <div className="bg-white border border-gray-200 rounded-3xl p-4">
                <h3 className="font-bold text-base mb-3">
                  Thông tin thanh toán
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số lượng sản phẩm:</span>
                    <span className="font-medium">
                      {detail.orderDetails?.reduce(
                        (sum, item) => sum + (item.quantity || 0),
                        0
                      ) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền hàng:</span>
                    <span className="font-medium">
                      {detail.orderDetails
                        ? detail.orderDetails
                            .reduce(
                              (sum, item) =>
                                sum + (item.price || 0) * (item.quantity || 0),
                              0
                            )
                            .toLocaleString("vi-VN") + "đ"
                        : "0đ"}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span className="font-medium">
                      {detail.discountAmount && detail.discountAmount > 0
                        ? `-${Number(detail.discountAmount).toLocaleString(
                            "vi-VN"
                          )}đ`
                        : "0đ"}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Phí vận chuyển:</span>
                    <span className="font-medium">
                      {detail.shippingFee === 0
                        ? "Miễn phí"
                        : detail.shippingFee
                        ? Number(detail.shippingFee).toLocaleString("vi-VN") +
                          "đ"
                        : "0đ"}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Thanh toán</span>
                      <span></span>
                    </div>
                    <div className="flex justify-between text-red-500 text-lg font-bold">
                      <span>Tổng số tiền</span>
                      <span>
                        {(
                          (detail.orderDetails
                            ? detail.orderDetails.reduce(
                                (sum, item) =>
                                  sum +
                                  (item.price || 0) * (item.quantity || 0),
                                0
                              )
                            : 0) +
                          (detail.shippingFee || 0) -
                          (detail.discountAmount || 0)
                        ).toLocaleString("vi-VN") + "đ"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-1">
                      (Đã bao gồm VAT và được làm tròn)
                    </p>
                  </div>

                  {detail.status === "PLACED" ||
                  detail.status === "PREPARING" ? (
                    <div>
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full mt-3"
                      >
                        Hủy đơn hàng
                      </button>
                      {showCancelModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                          <div className="bg-white rounded-lg p-6 w-96">
                            <h3 className="text-lg font-bold mb-4">
                              Xác nhận hủy đơn hàng
                            </h3>
                            <p className="mb-6">
                              Bạn có chắc muốn hủy đơn hàng này không?
                            </p>
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                              >
                                Hủy
                              </button>
                              <button
                                onClick={() =>
                                  handleCancelOrder(detail.orderId)
                                }
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-800 transition"
                              >
                                Xác nhận
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : detail.status === "DELIVERED" ? (
                    <div>
                      <button
                        onClick={() => setShowReturnModal(true)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition w-full mt-3"
                      >
                        Trả hàng
                      </button>
                      {showReturnModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                          <div className="bg-white rounded-lg p-6 w-96">
                            <h3 className="text-lg font-bold mb-4">
                              Xác nhận trả hàng
                            </h3>
                            <p className="mb-6">
                              Bạn có chắc muốn trả hàng cho đơn hàng này không?
                            </p>
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => setShowReturnModal(false)}
                                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                              >
                                Hủy
                              </button>
                              <button
                                onClick={handleConfirmReturn}
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-800 transition"
                              >
                                Xác nhận
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Thông tin hỗ trợ */}
            <div className="bg-white border border-gray-200 rounded-3xl p-4">
              <h3 className="font-bold text-base mb-3">Thông tin hỗ trợ</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-red-500">📍</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Địa chỉ cửa hàng:</p>
                    <p className="text-sm font-medium">
                      536 Xô Viết Nghệ Tĩnh, P. 25, Q. Bình Thạnh, TP. HCM
                    </p>
                    <button className="text-xs text-red-500 mt-1 border border-red-200 px-2 py-1 rounded">
                      Chỉ đường
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500">📞</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Hotline hỗ trợ:</p>
                    <p className="text-sm font-medium">1900 636 622</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- POPUP ĐÁNH GIÁ (NEW) --- */}
        {showReviewModal && reviewItem && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 shadow-2xl animate-scaleIn">
              <h3 className="text-xl font-bold mb-4 text-center">
                Đánh giá sản phẩm
              </h3>
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
                <img
                  src={
                    getImageByColor(reviewItem)
                      ? `http://localhost:8080/api/image/${getImageByColor(
                          reviewItem
                        )}`
                      : ""
                  }
                  className="w-14 h-14 rounded-lg object-cover"
                  alt=""
                />
                <div>
                  <p className="font-semibold text-sm line-clamp-1">
                    {reviewItem.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {reviewItem.color}, {reviewItem.size}
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="transition hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={
                        star <= reviewRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm font-medium text-yellow-600 mb-4">
                {reviewRating === 5
                  ? "Tuyệt vời"
                  : reviewRating === 4
                  ? "Hài lòng"
                  : reviewRating === 3
                  ? "Bình thường"
                  : reviewRating === 2
                  ? "Không hài lòng"
                  : "Tệ"}
              </p>
              <textarea
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                rows={4}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:opacity-70"
                >
                  {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
