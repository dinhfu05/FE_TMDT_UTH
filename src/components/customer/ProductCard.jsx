import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { cartService, IMAGE_BASE_URL } from '../../services/api/apiService'; 
import { showError, showSuccess } from '../shared/toast';
import Button from './Button';

const ProductCard = ({ product }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isColorSelected, setIsColorSelected] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isAdding, setIsAdding] = useState(false);
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState(null);

  const navigate = useNavigate(); 

  const availableColors = product?.productColors || [];
  const safeSelectedColorIndex =
    availableColors.length > 0
      ? Math.min(selectedColorIndex, availableColors.length - 1)
      : 0;

  const currentColorOption =
    availableColors.length > 0
      ? availableColors[safeSelectedColorIndex]
      : undefined;

  const availableSizes = currentColorOption?.productDetails || [];

  const firstDetailId =
    (currentColorOption &&
      currentColorOption.productDetails &&
      currentColorOption.productDetails[0]?.detailId) ||
    product?.productDetailId ||
    null;

  const unitPrice = product.unitPrice || 0;
  const discount = product.discount || 0;
  const finalPrice = unitPrice * (1 - discount / 100);
  const hasDiscount = discount > 0;

  const getColorHex = (colorName) => {
  if (!colorName) return '#CCCCCC';
  const normalized = colorName.trim().toLowerCase().replace(/\s+/g, '');
  
  const colorMap = {
    // Cơ bản
    white: '#FFFFFF',
    black: '#000000',
    gray: '#6B7280',
    grey: '#6B7280',
    blue: '#3B82F6',
    lightblue: '#60A5FA',
    darkblue: '#1E40AF',
    beige: '#F5F5DC',
    brown: '#A0522D',
    navy: '#1E3A8A',
    cream: '#FFFDD0',
    khaki: '#F0E68C',
    olive: '#808000',
    mossgreen: '#353F3A',
    militarygreen:'#3D463B',
    natural: '#F5F5DC',
    mixed: '#C0C0C0',
  };

  return colorMap[normalized] || '#CCCCCC';
};


  const getImageUrl = (filename) => `${IMAGE_BASE_URL}/${filename}`;

  const handleAddToCart = async (e) => {
    const detailId = e?.detailId || firstDetailId;
    e?.stopPropagation?.();

    const token = localStorage.getItem("token");
    if (!token) {
      showError("Vui lòng đăng nhập!");
      return;
    }

    if (!detailId) {
      showError("Vui lòng chọn size!");
      return;
    }

    setIsAdding(true);
    try {
      const result = await cartService.addToCart(detailId, 1);

      if (result.success) {
        showSuccess("Đã thêm vào giỏ!");
        const cartData = await cartService.getCart();
        const cartItems = cartData?.cartItemResponseDTOs || [];
        const newCartCount = cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        window.dispatchEvent(
          new CustomEvent("cartUpdated", { detail: newCartCount })
        );
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError("Lỗi hệ thống!", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCardClick = () => {
    if (product?.productId) {
      navigate(`/product/${product.productId}`);
    }
  };

  const handleColorSelect = (e, index) => {
    e.stopPropagation();
    setSelectedColorIndex(index);
    setSelectedDetailId(null);
    setIsColorSelected(true); // Người dùng đã chọn màu
  };

  const currentImage = isColorSelected
    ? currentColorOption?.productImage || product.productImage
    : product.productImage; // Mặc định hiển thị ảnh chung

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={getImageUrl(currentImage)}
            alt={product.productName}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{discount}%
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-base mb-2 line-clamp-2 min-h-[48px]">
            {product.productName}
          </h3>

          <div className="flex gap-2 mb-3">
            {availableColors.map((c, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColorIndex === i && isColorSelected
                    ? "border-black ring-2 ring-gray-300"
                    : ""
                }`}
                style={{ backgroundColor: getColorHex(c.color) }}
                onClick={(e) => handleColorSelect(e, i)}
              />
            ))}
          </div>

          <div className="flex-grow" />

          <div className="text-right mb-2">
            {hasDiscount && (
              <div className="text-xs line-through text-gray-400">
                {unitPrice.toLocaleString()}₫
              </div>
            )}

            <div
              className={`text-xl font-bold ${
                hasDiscount ? "text-red-600" : "text-black"
              }`}
            >
              {finalPrice.toLocaleString()}₫
            </div>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              setShowSizePopup(true);
            }}
            className="w-full"
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>

      {/* POPUP CHỌN SIZE */}
      {showSizePopup && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setShowSizePopup(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[320px] p-6 rounded-xl shadow-xl animate-scaleIn"
          >
            <h3 className="text-lg font-semibold text-center mb-4">
              Chọn size
            </h3>

            <div className="flex flex-wrap gap-3 justify-center mb-5">
              {availableSizes.map((s) => (
                <button
                  key={s.detailId}
                  onClick={() => setSelectedDetailId(s.detailId)}
                  className={`px-4 py-2 border rounded ${
                    selectedDetailId === s.detailId
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {s.size}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-2 border rounded"
                onClick={() => setShowSizePopup(false)}
              >
                Hủy
              </button>

              <button
                className="flex-1 py-2 bg-black text-white rounded"
                onClick={async () => {
                  if (!selectedDetailId) {
                    showError("Vui lòng chọn size!");
                    return;
                  }

                  await handleAddToCart({
                    stopPropagation: () => {},
                    detailId: selectedDetailId,
                  });

                  setShowSizePopup(false);
                  setSelectedDetailId(null);
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
