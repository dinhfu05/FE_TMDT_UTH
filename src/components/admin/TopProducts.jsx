import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";

// CẤU HÌNH ĐƯỜNG DẪN ẢNH
const IMAGE_BASE_URL = "http://localhost:8080/api/image";

// Component con hiển thị từng dòng sản phẩm
const ProductItem = ({ name, subtitle, image }) => {
  return (
    <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
      {/* Container chứa ảnh */}
      <div className="w-12 h-12 rounded-lg border border-gray-100 bg-white overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            // Nếu ảnh lỗi thì hiện ảnh placeholder màu xám
            e.target.src = "https://via.placeholder.com/48?text=IMG";
          }}
        />
      </div>

      <div className="flex-1">
        <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{name}</h4>
        <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
      </div>

      <button className="text-gray-300 hover:text-blue-600 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </button>
    </div>
  );
};

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm format tiền tệ VNĐ
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Lấy token từ localStorage (thay vì hardcode) để đảm bảo bảo mật và luôn mới
        const token = localStorage.getItem("token");

        // Gọi API lấy danh sách sản phẩm (categoryId=3, page 1, size 5)
        const response = await fetch(
          "http://localhost:8080/api/product?page=1&size=5&categoryId=2",
          {
            method: "GET",
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success && data.data) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Sản phẩm top</h3>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex flex-col gap-3">
            {/* Skeleton loading effect */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-2 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          products.map((product) => {
            return (
              <ProductItem
                key={product.productId}
                name={product.productName}
                // Hiển thị giá tiền
                subtitle={formatMoney(product.unitPrice)}
                // Ghép đường dẫn ảnh API + tên ảnh từ DB
                image={`${IMAGE_BASE_URL}/${product.productImage}`}
              />
            );
          })
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">
            Không có sản phẩm nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
