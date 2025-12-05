import React, { useState, useEffect } from "react";
import cartService from "../../services/api/cartService";
import Breadcrumb from "../../components/customer/Breadcrumb";
import { Minus, Plus, Trash2, X } from "lucide-react";

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const fetchCart = async () => {
    const data = await cartService.getCart();
    if (data?.cartItemResponseDTOs) {
      setItems(data.cartItemResponseDTOs);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCart();
  }, []);

  const handleIncrease = async (item) => {
    if (loadingId) return;
    setLoadingId(item.cartItemId);

    const newQty = item.quantity + 1;
    await cartService.updateQuantity(item.cartItemId, newQty);

    await fetchCart();

    // Emit sự kiện cartUpdated
    const totalCount = items.reduce(
      (sum, i) =>
        i.cartItemId === item.cartItemId ? sum + newQty : sum + i.quantity,
      0
    );
    window.dispatchEvent(
      new CustomEvent("cartUpdated", { detail: totalCount })
    );

    setLoadingId(null);
  };

  const handleDecrease = async (item) => {
    if (loadingId || item.quantity <= 1) return;
    setLoadingId(item.cartItemId);

    const newQty = item.quantity - 1;
    await cartService.updateQuantity(item.cartItemId, newQty);

    await fetchCart();

    const totalCount = items.reduce(
      (sum, i) =>
        i.cartItemId === item.cartItemId ? sum + newQty : sum + i.quantity,
      0
    );
    window.dispatchEvent(
      new CustomEvent("cartUpdated", { detail: totalCount })
    );

    setLoadingId(null);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    await cartService.removeItem(confirmDelete.cartItemId);
    await fetchCart();

    // Emit tổng số lượng mới
    const totalCount = items
      .filter((i) => i.cartItemId !== confirmDelete.cartItemId)
      .reduce((sum, i) => sum + i.quantity, 0);

    window.dispatchEvent(
      new CustomEvent("cartUpdated", { detail: totalCount })
    );

    setConfirmDelete(null);
  };

  // Hàm lấy ảnh theo màu giống ProductCard nhưng URL theo API mới
  const getImageByColor = (item) => {
    if (item.color && item.productColors?.length > 0) {
      const colorOption = item.productColors.find(
        (c) => c.color.toLowerCase() === item.color.toLowerCase()
      );
      return colorOption?.productImage || item.productImage;
    }
    return item.productImage;
  };

  // Tính tổng tiền
  const totalPrice = items.reduce((sum, item) => {
    const price = item.price || 0; // tránh undefined
    const discount = item.discount || 0;
    const finalPrice = price * (1 - discount / 100);
    return sum + finalPrice * item.quantity;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Breadcrumb paths={[{ label: "Home", link: "/" }, { label: "Cart" }]} />

      <h1 className="text-2xl font-bold mb-2">Giỏ hàng của bạn</h1>
      <p className="text-gray-500 mb-6">Xem lại các sản phẩm bạn đã chọn</p>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Sản phẩm</th>
              <th className="p-3 text-center">Đơn giá</th>
              <th className="p-3 text-center">Số lượng</th>
              <th className="p-3 text-center">Thành tiền</th>
              <th className="p-3 text-center">Xóa</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const price = item.price || 0;
              const discount = item.discount || 0;
              const hasDiscount = discount > 0;

              const finalPrice = price * (1 - discount / 100);
              const totalItemPrice = finalPrice * item.quantity;

              return (
                <tr key={item.cartItemId} className="border-b last:border-none">
                  {/* PRODUCT */}
                  <td className="p-3">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={`http://localhost:8080/api/image/${getImageByColor(
                            item
                          )}`}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-lg"
                        />

                        {hasDiscount && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            -{discount}%
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-gray-500 text-sm">
                          Size {item.productDetailsize}, Màu {item.color}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* UNIT PRICE */}
                  <td className="text-center">
                    {hasDiscount ? (
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-400 line-through">
                          {price.toLocaleString()}đ
                        </span>
                        <span className="font-semibold text-red-600">
                          {finalPrice.toLocaleString()}đ
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold">
                        {price.toLocaleString()}đ
                      </span>
                    )}
                  </td>

                  {/* QUANTITY */}
                  <td className="p-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleDecrease(item)}
                        disabled={loadingId === item.cartItemId}
                        className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>

                      <input
                        type="text"
                        readOnly
                        value={item.quantity}
                        className="w-12 text-center border rounded-lg py-1 pointer-events-none"
                      />

                      <button
                        onClick={() => handleIncrease(item)}
                        disabled={loadingId === item.cartItemId}
                        className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>

                  {/* TOTAL PRICE */}
                  <td className="text-center">
                    <span
                      className={`font-bold ${
                        hasDiscount ? "text-red-600" : ""
                      }`}
                    >
                      {totalItemPrice.toLocaleString()}đ
                    </span>
                  </td>

                  {/* DELETE */}
                  <td className="text-center">
                    <button
                      onClick={() => setConfirmDelete(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-2 rounded-lg border hover:bg-black hover:text-white transition"
          onClick={() => (window.location.href = "/products")}
        >
          Tiếp tục mua hàng
        </button>

        <div className="text-lg font-semibold">
          Tổng tiền thanh toán:{" "}
          <span className="text-red-600 text-xl">
            {totalPrice.toLocaleString()}đ
          </span>
        </div>

        <button
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-white hover:text-black border border-black transition"
          onClick={() => (window.location.href = "/checkout")}
        >
          Tiến hành thanh toán
        </button>
      </div>

      {/* POPUP DELETE */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[360px] shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setConfirmDelete(null)}
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-2">Xóa sản phẩm?</h2>
            <p className="text-gray-600 text-sm">
              Bạn có chắc muốn xóa <b>{confirmDelete.productName}</b> khỏi giỏ
              hàng không?
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => setConfirmDelete(null)}
              >
                Hủy
              </button>

              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
