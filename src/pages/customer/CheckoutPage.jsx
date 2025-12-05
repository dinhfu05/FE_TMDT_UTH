import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import shippingAddressApi from "../../services/api/shippingAddressApi";
import orderApi from "../../services/api/orderApi";
import cartApi from "../../services/api/cartService";
import { showError, showSuccess } from "../../components/shared/toast";
import Breadcrumb from "../../components/customer/Breadcrumb";
import PaymentMethods from "../../components/customer/PaymentMethods";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: "",
    phoneNumber: "",
    detailedAdress: "",
    ward: "",
    province: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State xóa địa chỉ
  const [deleteAddressId, setDeleteAddressId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    fetchAddresses();
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setError(null);
      const data = await cartApi.getCart();
      const cartData = data?.cartItemResponseDTOs || [];
      setCartItems(cartData);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Không thể tải giỏ hàng. Vui lòng thử lại.");
      setCartItems([]);
    }
  };

  const fetchAddresses = async () => {
    try {
      setError(null);
      const res = await shippingAddressApi.getAll();
      const addressData = res?.data || [];
      setAddresses(addressData);

      if (addressData.length > 0 && selectedAddressId === null) {
        setSelectedAddressId(addressData[0].addressId);
        setNewAddress({
          recipientName: addressData[0].recipientName,
          phoneNumber: addressData[0].phoneNumber,
          detailedAdress: addressData[0].detailedAdress,
          ward: addressData[0].ward,
          province: addressData[0].province,
        });
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Không thể tải danh sách địa chỉ. Vui lòng thử lại.");
      setAddresses([]);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (selectedAddressId === "new") {
        // Create mới
        await shippingAddressApi.create(newAddress);
        showSuccess("Thêm địa chỉ mới thành công!");
      } else {
        // Update địa chỉ hiện có
        await shippingAddressApi.update(selectedAddressId, newAddress);
        showSuccess("Cập nhật địa chỉ thành công!");
      }

      setNewAddress({
        recipientName: "",
        phoneNumber: "",
        detailedAdress: "",
        ward: "",
        province: "",
      });

      await fetchAddresses();
      setSelectedAddressId(null);
      setShowAddressPopup(false);
    } catch (err) {
      console.error("Error saving address:", err);
      setError("Không thể lưu địa chỉ. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!selectedAddressId || selectedAddressId === "new") {
      showError("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    if (cartItems.length === 0) {
      showError("Giỏ hàng trống! Vui lòng thêm sản phẩm vào giỏ hàng.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderDetailRequestDTOs = cartItems.map((item) => ({
        productDetailId: item.productDetailId,
        quantity: item.quantity,
      }));

      const orderResult = await orderApi.create({
        addressShippingId: selectedAddressId,
        paymentMethod,
        orderDetailRequestDTOs,
      });

      if (!orderResult?.success) {
        showSuccess(orderResult?.message || "Đặt hàng thành công!");
        return;
      }

      const orderInfo = orderResult.data;
      showSuccess(`Đặt hàng thành công! Mã đơn hàng: ${orderInfo.orderId}`);

      if (paymentMethod === "ZALOPAY") {
        const zalopayResponse = await fetch(
          "http://localhost:8080/api/zalopay/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              Accept: "*/*",
            },
            body: JSON.stringify({
              orderId: orderInfo.orderId,
              description: `THANH TOAN DON HANG #${orderInfo.orderId}`,
            }),
          }
        );

        const zalopayData = await zalopayResponse.json();

        if (zalopayData.success && zalopayData.data?.order_url) {
          console.log("Redirect URL:", zalopayData.data.order_url);
          window.open(zalopayData.data.order_url, "_self");
        } else {
          showError("Không lấy được link ZaloPay từ server!");
        }
      } else {
        // COD
        navigate("/my-orders");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Đặt hàng thất bại. Vui lòng thử lại.");
      showError("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.price || 0;
    const discount = item.discount || 0;
    const finalPrice = price * (1 - discount / 100);
    return sum + finalPrice * item.quantity;
  }, 0);
  const freeShipThreshold = 1000000;
  const baseShippingFee = 30000;
  const shippingFee = subtotal >= freeShipThreshold ? 0 : baseShippingFee;
  const amountToFreeShip =
    subtotal < freeShipThreshold ? freeShipThreshold - subtotal : 0;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* BREADCRUMB */}
        <Breadcrumb
          paths={[{ label: "Home", link: "/" }, { label: "Payment" }]}
        />
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDE - FORM */}
          <div className="flex-1 space-y-6">
            {/* THÔNG TIN NHẬN HÀNG */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6 uppercase">
                Thông tin nhận hàng
              </h2>

              {/* Card hiển thị địa chỉ đã chọn */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  📍 Địa chỉ giao hàng
                </label>

                {selectedAddressId && selectedAddressId !== "new" ? (
                  <div className="border-2 border-blue-400 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {
                              addresses.find(
                                (a) => a.addressId === selectedAddressId
                              )?.recipientName
                            }
                          </span>
                          <span className="text-sm text-gray-500">|</span>
                          <span className="text-sm text-gray-600">
                            {
                              addresses.find(
                                (a) => a.addressId === selectedAddressId
                              )?.phoneNumber
                            }
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {
                            addresses.find(
                              (a) => a.addressId === selectedAddressId
                            )?.detailedAdress
                          }
                          ,{" "}
                          {
                            addresses.find(
                              (a) => a.addressId === selectedAddressId
                            )?.ward
                          }
                          ,{" "}
                          {
                            addresses.find(
                              (a) => a.addressId === selectedAddressId
                            )?.province
                          }
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddressPopup(true)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
                      >
                        Chọn địa chỉ khác
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddressPopup(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition font-medium"
                  >
                    + Chọn địa chỉ giao hàng
                  </button>
                )}
              </div>

              {/* Form nhập/Update địa chỉ */}
              <form onSubmit={handleSaveAddress}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập họ và tên"
                      required
                      value={newAddress.recipientName}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          recipientName: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="tel"
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập số điện thoại"
                      required
                      pattern="[0-9]{10,11}"
                      value={newAddress.phoneNumber}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tỉnh/thành phố"
                      required
                      value={newAddress.province}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          province: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Xã/phường/thị trấn"
                      required
                      value={newAddress.ward}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          ward: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tòa nhà, số nhà, tên đường"
                    rows="3"
                    required
                    value={newAddress.detailedAdress}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        detailedAdress: e.target.value,
                      }))
                    }
                  />

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
                    disabled={loading || selectedAddressId === null}
                  >
                    {loading
                      ? "Đang lưu..."
                      : selectedAddressId === "new"
                      ? "Lưu địa chỉ"
                      : "Cập nhật"}
                  </button>
                </div>
              </form>
            </div>

            {/* CÁCH THANH TOÁN */}
            <PaymentMethods
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          {/* RIGHT SIDE - ORDER SUMMARY */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6 uppercase">
                Tóm tắt đơn hàng
              </h2>
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Giỏ hàng trống</p>
                  <a
                    href="/shop"
                    className="text-blue-600 underline mt-2 inline-block"
                  >
                    Tiếp tục mua sắm
                  </a>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">SẢN PHẨM</h3>
                    <div className="space-y-3">
                      {cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 pb-3 border-b"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.color && `${item.color}, `}
                              {item.productDetailsize &&
                                `${item.productDetailsize}`}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm text-gray-600">
                                Số lượng: {item.quantity}
                              </span>
                              <span className="text-sm text-gray-600 line-through">
                                {item.price}
                              </span>
                              <span className="font-semibold">
                                {(
                                  item.price *
                                  (1 - (item.discount || 0) / 100) *
                                  item.quantity
                                ).toLocaleString("vi-VN")}
                                ₫
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 pb-4 border-b">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span className="font-semibold">
                        {subtotal.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vận chuyển:</span>
                      <span
                        className={
                          shippingFee === 0
                            ? "text-green-600 font-semibold"
                            : ""
                        }
                      >
                        {shippingFee === 0
                          ? "Miễn phí"
                          : `${shippingFee.toLocaleString("vi-VN")}₫`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-lg font-bold mb-4">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">
                      {total.toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  {amountToFreeShip > 0 ? (
                    <p className="text-sm text-gray-600 mb-4">
                      Chỉ còn{" "}
                      <span className="font-semibold text-red-600">
                        {amountToFreeShip.toLocaleString("vi-VN")}₫
                      </span>{" "}
                      nữa là được free ship 🎁
                    </p>
                  ) : (
                    <p className="text-sm text-green-600 font-semibold mb-4">
                      🎉 Bạn đã được miễn phí vận chuyển!
                    </p>
                  )}

                  <button
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    onClick={handleOrder}
                    disabled={
                      loading || !selectedAddressId || cartItems.length === 0
                    }
                  >
                    {loading ? "Đang đặt hàng..." : "ĐẶT HÀNG"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* POPUP CHỌN ĐỊA CHỈ */}
        {showAddressPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold">Chọn địa chỉ giao hàng</h3>
                <button
                  onClick={() => setShowAddressPopup(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
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
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.addressId}
                      className={`flex items-center justify-between gap-3 p-4 border-2 rounded-lg transition-all hover:border-blue-400 hover:bg-blue-50 ${
                        selectedAddressId === addr.addressId
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <label className="flex-1 flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="savedAddress"
                          value={addr.addressId}
                          checked={selectedAddressId === addr.addressId}
                          onChange={() => {
                            setSelectedAddressId(addr.addressId);
                            setNewAddress({
                              recipientName: addr.recipientName,
                              phoneNumber: addr.phoneNumber,
                              detailedAdress: addr.detailedAdress,
                              ward: addr.ward,
                              province: addr.province,
                            });
                          }}
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {addr.recipientName}
                            </span>
                            <span className="text-sm text-gray-500">|</span>
                            <span className="text-sm text-gray-600">
                              {addr.phoneNumber}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {addr.detailedAdress}, {addr.ward}, {addr.province}
                          </p>
                        </div>
                      </label>

                      {/* Nút xóa */}
                      <button
                        onClick={() => setDeleteAddressId(addr.addressId)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ))}

                  {/* Option Thêm địa chỉ mới */}
                  <div
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 ${
                      selectedAddressId === "new"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => {
                      setSelectedAddressId("new");
                      setNewAddress({
                        recipientName: "",
                        phoneNumber: "",
                        detailedAdress: "",
                        ward: "",
                        province: "",
                      });
                    }}
                  >
                    <FaPlus className="text-blue-600" />
                    <span className="font-semibold text-blue-600">
                      Thêm địa chỉ mới
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50">
                {selectedAddressId === "new" ? (
                  <button
                    onClick={() => setShowAddressPopup(false)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Nhập địa chỉ mới
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAddressPopup(false)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Xác nhận
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL XÓA ĐỊA CHỈ */}
        {deleteAddressId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
              <p className="text-sm text-gray-700 mb-6">
                Bạn có chắc muốn xóa địa chỉ này? Hành động này không thể hoàn
                tác.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteAddressId(null)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={async () => {
                    setLoadingDelete(true);
                    try {
                      await shippingAddressApi.delete(deleteAddressId);
                      showSuccess("Xóa địa chỉ thành công!");
                      fetchAddresses();
                      if (selectedAddressId === deleteAddressId)
                        setSelectedAddressId(null);
                      setDeleteAddressId(null);
                    } catch (error) {
                      const msg =
                        error?.response?.data?.message ||
                        "Xóa địa chỉ thất bại!";
                      showError(msg);
                    } finally {
                      setLoadingDelete(false);
                    }
                  }}
                  className={`px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition ${
                    loadingDelete ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loadingDelete}
                >
                  {loadingDelete ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
