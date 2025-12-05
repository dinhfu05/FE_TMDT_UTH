import React, { useEffect, useState } from "react";
import shippingAddressApi from "../../services/api/shippingAddressApi";
import orderApi from "../../services/api/orderApi";
import { showError, showSuccess } from "../../components/shared/toast";
import Breadcrumb from "../../components/customer/Breadcrumb";
import PaymentMethods from "../../components/customer/PaymentMethods";
import { useLocation, useNavigate } from "react-router-dom";

const BuyNowPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  if (!product) {
    return <div className="text-center py-20">Không có sản phẩm để mua.</div>;
  }

  const finalPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  const subtotal = finalPrice * product.quantity;

  const FREE_SHIP_THRESHOLD = 1000000;
  const SHIPPING_FEE = 30000;

  const shippingFee = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await shippingAddressApi.getAll();
        const data = res?.data || [];

        setAddresses(data);
        if (data.length > 0) setSelectedAddressId(data[0].addressId);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        showError("Không thể tải địa chỉ!");
      }
    };

    loadAddresses();
  }, []);

  const handleOrder = async () => {
    if (!selectedAddressId) {
      showError("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    setLoading(true);

    try {
      const orderResult = await orderApi.create({
        addressShippingId: selectedAddressId,
        paymentMethod,
        orderDetailRequestDTOs: [
          {
            productDetailId: product.productDetailId,
            quantity: product.quantity,
          },
        ],
      });

      if (!orderResult?.success) {
        showError(orderResult?.message || "Đặt hàng thất bại!");
        return;
      }

      const orderInfo = orderResult.data;
      showSuccess(`Đặt hàng thành công! Mã đơn: ${orderInfo.orderId}`);

      if (paymentMethod === "ZALOPAY") {
        const res = await fetch(
          "http://localhost:8080/api/zalopay/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              orderId: orderInfo.orderId,
              description: `THANH TOAN DON HANG #${orderInfo.orderId}`,
            }),
          }
        );

        const data = await res.json();

        if (data.success && data.data?.order_url) {
          window.location.href = data.data.order_url;
          return;
        } else {
          showError("Không lấy được link ZaloPay!");
        }
      }

      navigate("/my-orders");
    } catch (err) {
      console.error(err);
      showError("Đặt hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Breadcrumb
          paths={[{ label: "Home", link: "/" }, { label: "Buy now" }]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Địa chỉ giao hàng</h2>

              {addresses.length === 0 && (
                <p className="text-gray-500">Bạn chưa có địa chỉ giao hàng.</p>
              )}

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.addressId}
                    className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.addressId}
                      onChange={() => setSelectedAddressId(addr.addressId)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{addr.recipientName}</p>
                      <p className="text-sm">{addr.phoneNumber}</p>
                      <p className="text-sm text-gray-600">
                        {addr.detailedAdress}, {addr.ward}, {addr.province}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* THANH TOÁN */}
            <PaymentMethods
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <h2 className="text-xl font-bold">Đơn hàng</h2>

            {/*  SẢN PHẨM */}
            <div className="flex gap-4">
              <div>
                <p className="font-semibold">{product.productName}</p>
                <p className="text-sm text-gray-500">
                  Màu: {product.selectedColor}
                </p>
                <p className="text-sm text-gray-500">
                  Size: {product.selectedSize}
                </p>
                <p className="text-sm mt-1">Số lượng: {product.quantity}</p>

                {/* GIÁ GỐC + GIÁ GIẢM */}
                <div className="flex flex-col mt-2">
                  {product.discount > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.price.toLocaleString("vi-VN")}₫
                    </span>
                  )}

                  <span className="text-red-600 font-bold text-lg">
                    {finalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>

            {/*  TỔNG TIỀN + SHIP */}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString("vi-VN")}₫</span>
              </div>

              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span
                  className={
                    shippingFee === 0 ? "text-green-600 font-semibold" : ""
                  }
                >
                  {shippingFee === 0
                    ? "Miễn phí"
                    : `${shippingFee.toLocaleString("vi-VN")}₫`}
                </span>
              </div>

              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Tổng cộng</span>
                <span className="text-red-600">
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>

              {shippingFee > 0 && (
                <p className="text-xs text-gray-500">
                  Mua thêm{" "}
                  {(FREE_SHIP_THRESHOLD - subtotal).toLocaleString("vi-VN")}₫ để
                  được miễn phí vận chuyển 🎁
                </p>
              )}
            </div>

            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-bold hover:bg-blue-700"
            >
              {loading ? "Đang xử lý..." : "ĐẶT HÀNG"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowPage;
