import React, { useState, useEffect, useMemo } from "react";
import {
  productService,
  categoryService,
  cartService,
  IMAGE_BASE_URL,
} from "../../services/api/apiService";
import { showSuccess, showError } from "../../components/shared/toast";
import ProductImageCarousel from "../../components/customer/ProductImageCarousel";
import Breadcrumb from "../../components/customer/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { Star, User } from "lucide-react"; // Import Icon

const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "0₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getImageUrl = (filename) => `${IMAGE_BASE_URL}/${filename}`;

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendProduct, setRecommendProduct] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [categories, setCategories] = useState([]);
  const [setCartCount] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");

  // State cho Reviews và Rating
  const [reviews, setReviews] = useState([]);
  const [ratingData, setRatingData] = useState({ avgRating: 0, count: 0 });

  const [mainImage, setMainImage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  // --- Fetch Product & Reviews ---
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi song song: Product info, All products (cho recommend), Categories, Reviews
        const [productData, productsData, categoryData, reviewsData] =
          await Promise.all([
            productService.getProductById(productId),
            productService.getAllProducts(1, 9999),
            categoryService.getAllCategories(1, 50),
            productService.getProductReviews(productId, 1, 100), // Lấy tối đa 100 review
          ]);

        // Xử lý Category count (như cũ)
        const countByCategory = {};
        productsData.forEach((p) => {
          if (!countByCategory[p.categoryId]) countByCategory[p.categoryId] = 0;
          countByCategory[p.categoryId]++;
        });
        const categoriesWithCount = categoryData.map((c) => ({
          ...c,
          totalItems: countByCategory[c.categoryId] || 0,
        }));

        // Xử lý Rating từ reviewsData
        let avg = 0;
        if (reviewsData && reviewsData.length > 0) {
          const total = reviewsData.reduce(
            (acc, r) => acc + Number(r.rating || 0),
            0
          );
          avg = (total / reviewsData.length).toFixed(1);
        }

        setProduct(productData);
        setReviews(reviewsData || []);
        setRatingData({ avgRating: avg, count: reviewsData?.length || 0 });

        setSelectedColor(productData?.productColors?.[0] || null);
        setMainImage(productData?.productImage || null);
        setRecommendProduct(shuffle([...productsData]).slice(0, 5));
        setCategories(categoriesWithCount);
      } catch (err) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleCartUpdate = () => setCartCount((prev) => prev + 1);
  const navigate = useNavigate();

  const getColorHex = (colorName) => {
    if (!colorName) return "#CCCCCC";
    const normalized = colorName.trim().toLowerCase().replace(/\s+/g, "");

    const colorMap = {
      white: "#FFFFFF",
      black: "#000000",
      gray: "#6B7280",
      grey: "#6B7280",
      blue: "#3B82F6",
      lightblue: "#60A5FA",
      darkblue: "#1E40AF",
      beige: "#F5F5DC",
      brown: "#A0522D",
      navy: "#1E3A8A",
      cream: "#FFFDD0",
      khaki: "#F0E68C",
      olive: "#808000",
      mossgreen: "#353F3A",
      militarygreen: "#3D463B",
      natural: "#F5F5DC",
      mixed: "#C0C0C0",
    };
    return colorMap[normalized] || "#CCCCCC";
  };

  // --- Reset size/quantity and mainImage when color changes ---
  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
    if (selectedColor?.productImage) setMainImage(selectedColor.productImage);
  }, [selectedColor]);

  const selectedProductDetail = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return selectedColor.productDetails.find((d) => d.size === selectedSize);
  }, [selectedColor, selectedSize]);

  const availableQuantity = selectedProductDetail?.quantity || 0;
  const productDetailId = selectedProductDetail?.detailId || null;

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    const discountFactor = 1 - (product.discount || 0) / 100;
    return product.unitPrice * discountFactor;
  }, [product]);

  const originalPrice = useMemo(() => product?.unitPrice || 0, [product]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (newQty > availableQuantity) return availableQuantity;
      return newQty;
    });
  };

  const handleAddToCart = async () => {
    if (!productDetailId) {
      showError("Vui lòng chọn Màu sắc và Kích cỡ.");
      return;
    }
    if (quantity > availableQuantity || availableQuantity === 0) {
      showError(
        `Số lượng không hợp lệ. Chỉ còn ${availableQuantity} sản phẩm.`
      );
      return;
    }
    try {
      const result = await cartService.addToCart(productDetailId, quantity);
      if (result.success) {
        showSuccess(result.message || "Đã thêm sản phẩm vào giỏ hàng!");
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
        let msg = result.message;
        if (msg?.includes("JWT signature")) msg = "Vui lòng đăng nhập!";
        showError(msg || "Không thể thêm sản phẩm vào giỏ hàng!");
      }
    } catch (err) {
      showError("Lỗi hệ thống!", err);
    }
  };

  // Helper render sao
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < Math.round(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 fill-gray-100"
        }`}
      />
    ));
  };

  if (loading)
    return <div className="text-center py-20">Đang tải sản phẩm...</div>;
  if (error)
    return <div className="text-center py-20 text-red-600">Lỗi: {error}</div>;
  if (!product)
    return <div className="text-center py-20">Không tìm thấy sản phẩm.</div>;

  const allImages = [
    product.productImage,
    ...(product.productColors?.map((c) => c.productImage) || []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          paths={[{ label: "Home", link: "/" }, { label: product.productName }]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-xl shadow-lg">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#fafafa] border border-gray-200 flex items-center justify-center">
              <ProductImageCarousel
                images={allImages}
                activeImage={mainImage}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-none scroll-smooth">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border cursor-pointer transition-all duration-300
                    ${
                      mainImage === img
                        ? "border-blue-600 ring-1 ring-blue-300"
                        : "border-gray-300"
                    }
                  `}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain bg-white p-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.productName}
              </h1>
              {/* --- HIỂN THỊ RATING SUMMARY --- */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {renderStars(Number(ratingData.avgRating))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {ratingData.count > 0
                    ? `(${ratingData.avgRating}/5 từ ${ratingData.count} đánh giá)`
                    : "(Chưa có đánh giá)"}
                </span>
                {ratingData.count > 0 && (
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className="text-sm text-blue-600 hover:underline ml-2"
                  >
                    Xem tất cả
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              {product.discount > 0 ? (
                <>
                  <span className="text-3xl font-bold text-red-600">
                    {formatCurrency(currentPrice)}
                  </span>
                  <span className="text-xl font-medium text-gray-400 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>

            <p className="text-gray-600 border-b pb-4">{product.description}</p>

            {/* Color */}
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-800">
                Chọn Màu:{" "}
                <span className="font-bold text-blue-600">
                  {selectedColor?.color || "Vui lòng chọn"}
                </span>
              </p>
              <div className="flex gap-3">
                {product.productColors.map((colorOption) => (
                  <button
                    key={colorOption.colorId}
                    onClick={() => setSelectedColor(colorOption)}
                    className={`w-10 h-10 rounded-full border-2 transition-all
                      ${
                        selectedColor?.colorId === colorOption.colorId
                          ? "border-black ring-2 ring-gray-300"
                          : "border-gray-300"
                      }`}
                    style={{ backgroundColor: getColorHex(colorOption.color) }}
                  ></button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-800">
                Chọn Size:{" "}
                <span className="font-bold text-blue-600">
                  {selectedSize || "Vui lòng chọn"}
                </span>
              </p>
              <div className="flex gap-3">
                {selectedColor?.productDetails.map((detail) => (
                  <button
                    key={detail.detailId}
                    onClick={() => setSelectedSize(detail.size)}
                    disabled={detail.quantity === 0}
                    className={`h-10 w-16 rounded-lg text-sm font-medium border transition-colors 
                      ${
                        detail.quantity === 0
                          ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed"
                          : selectedSize === detail.size
                          ? "border-blue-600 bg-blue-50 text-blue-800 font-bold"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                  >
                    {detail.size}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 pt-1">
                {selectedColor && selectedSize
                  ? `Kho: ${availableQuantity} sản phẩm`
                  : "Vui lòng chọn kích cỡ để kiểm tra kho."}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-gray-800">
                Số lượng:
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity === 1}
                  className="p-3 w-10 text-xl font-medium text-gray-600 disabled:opacity-50"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val) || val < 1) val = 1;
                    if (val > availableQuantity) val = availableQuantity;
                    setQuantity(val);
                  }}
                  className="w-12 text-center text-lg font-semibold border-x border-gray-300 py-2 focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={
                    quantity >= availableQuantity || availableQuantity === 0
                  }
                  className="p-3 w-10 text-xl font-medium text-gray-600 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || availableQuantity === 0}
                className="w-full bg-blue-600 text-white text-lg font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                Thêm vào giỏ hàng
              </button>
              <button
                disabled={!selectedSize || availableQuantity === 0}
                onClick={() => {
                  if (!selectedSize || availableQuantity === 0) return;
                  const productForBuyNow = {
                    productId: product.productId,
                    productDetailId: selectedProductDetail.detailId,
                    productName: product.productName,
                    price: product.unitPrice,
                    discount: product.discount,
                    productImage: mainImage,
                    selectedColor: selectedColor.color,
                    selectedSize,
                    quantity,
                  };
                  navigate("/buy-now", {
                    state: { product: productForBuyNow },
                  });
                }}
                className="w-full bg-gray-800 text-white text-lg font-bold py-3 rounded-xl hover:bg-black transition-colors disabled:bg-gray-400"
              >
                MUA NGAY
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {["details", "reviews", "shipping", "return", "care"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 text-lg font-semibold transition-colors whitespace-nowrap
                  ${
                    activeTab === tab
                      ? "text-gray-900 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab === "details"
                  ? "Thông tin chi tiết"
                  : tab === "reviews"
                  ? `Đánh giá (${ratingData.count})`
                  : tab === "shipping"
                  ? "Hướng dẫn mua hàng"
                  : tab === "return"
                  ? "Chính sách đổi trả"
                  : "Hướng dẫn bảo quản"}
              </button>
            ))}
          </div>
          <div className="py-6 bg-white p-6 rounded-b-xl shadow-md border-x border-b border-gray-200 min-h-[200px]">
            {activeTab === "details" && (
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p className="font-semibold">Chi tiết sản phẩm:</p>
                <p>{product.description}</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Chất liệu: 100% cotton cao cấp</li>
                  <li>Sản xuất tại Việt Nam</li>
                  <li>Đường may tỉ mỉ, không bai nhão khi giặt.</li>
                  <li>Có thể giặt máy ở nhiệt độ thường.</li>
                  <li>Màu sắc bền lâu, không phai sau nhiều lần giặt.</li>
                </ul>
              </div>
            )}

            {/* --- TAB ĐÁNH GIÁ --- */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  <div className="grid gap-6">
                    {reviews.map((review) => (
                      <div
                        key={review.reviewId}
                        className="border-b pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <User size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-gray-900">
                                  {review.userNameCustomer ||
                                    "Người dùng ẩn danh"}
                                </h4>
                                <div className="flex gap-0.5 mt-1">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                              {/* Nếu API có trả về ngày tháng thì hiển thị ở đây */}
                              {/* <span className="text-sm text-gray-400">2 ngày trước</span> */}
                            </div>
                            <p className="mt-2 text-gray-700">
                              {review.reviewContent}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p className="mb-2">
                      Chưa có đánh giá nào cho sản phẩm này.
                    </p>
                    <p className="text-sm">
                      Hãy là người đầu tiên mua và đánh giá sản phẩm!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="text-gray-700 space-y-2">
                <p className="font-semibold">Hướng dẫn mua hàng:</p>
                <p>
                  Đặt hàng trực tuyến, chọn màu sắc, kích thước, số lượng và
                  thanh toán qua ZaloPay, MoMo hoặc chuyển khoản ngân hàng.
                </p>
                <p>Giao hàng nhanh trong 1-3 ngày làm việc.</p>
                <p>Hỗ trợ kiểm tra hàng trước khi nhận.</p>
              </div>
            )}
            {activeTab === "return" && (
              <div className="text-gray-700 space-y-2">
                <p className="font-semibold">Chính sách đổi trả:</p>
                <p>Đổi trả trong vòng 7 ngày kể từ khi nhận hàng.</p>
                <p>
                  Sản phẩm phải còn nguyên tem, chưa qua sử dụng, không dơ bẩn.
                </p>
                <p>
                  Chi phí đổi trả do cửa hàng hỗ trợ trong trường hợp lỗi sản
                  phẩm.
                </p>
              </div>
            )}
            {activeTab === "care" && (
              <div className="text-gray-700 space-y-2">
                <p className="font-semibold">Hướng dẫn bảo quản:</p>
                <p>Giặt ở nhiệt độ thường, không dùng hóa chất tẩy mạnh.</p>
                <p>Ủi ở nhiệt độ trung bình.</p>
                <p>Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            SẢN PHẨM TƯƠNG TỰ
          </h2>
          <p className="text-gray-600 mb-8">
            Khám phá thêm các sản phẩm cùng loại
          </p>
        </div>
      </div>
      <div className=" pb-3">
        <div className="flex gap-5 w-max justify-center mx-auto px-4">
          {recommendProduct.map((p) => (
            <div key={p.productId} className="w-[260px] animate-fade-in-up">
              <ProductCard product={p} onCartUpdate={handleCartUpdate} />
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-gray-900 text-white mt-16 p-10">
        <p className="text-center text-sm">
          © 2025 TenBrand. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ProductDetailPage;
