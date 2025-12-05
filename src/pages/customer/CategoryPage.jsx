import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { productService  } from "../../services/api/apiService";
import Breadcrumb from "../../components/customer/Breadcrumb";

const CategoryPage = () => {
  const { categoryId } = useParams(); 
;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setCurrentPage(1); 
  }, [categoryId]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0); 
  }, [currentPage, categoryId]);
  

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts(
        currentPage,
        pageSize,
        categoryId 
      );
      setProducts(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
   

  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumb
          paths={[{ label: "Home", link: "/" }, { label: "Categories" }]}
        />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <h1 className="text-4xl font-bold mb-3">CATEGORIES</h1>
        <p className="text-gray-600 text-lg">
          Explore a Wide Range of Products Organized by Category
        </p>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : products.length === 0 ? (
          <div className="text-center">Không có sản phẩm</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1 border rounded">{currentPage}</span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={products.length < pageSize}
            className="px-3 py-1 border rounded disabled:opacity-50" 
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
