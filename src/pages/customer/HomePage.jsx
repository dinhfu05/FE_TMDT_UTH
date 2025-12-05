import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductCard from "../../components/customer/ProductCard";
import HeroCarousel from "../../components/customer/HeroCarousel";
import { productService, categoryService } from "../../services/api/apiService";

const Homepage = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [setCartCount] = useState(0);

  const navigate = useNavigate();

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoryData] = await Promise.all([
          productService.getAllProducts(1, 9999),
          categoryService.getAllCategories(1, 50),
        ]);

        // count products by categoryId
        const countByCategory = {};
        productsData.forEach((p) => {
          if (!countByCategory[p.categoryId]) countByCategory[p.categoryId] = 0;
          countByCategory[p.categoryId]++;
        });

        const categoriesWithCount = categoryData.map((c) => ({
          ...c,
          totalItems: countByCategory[c.categoryId] || 0,
        }));

        setNewProducts(productsData.slice(0, 10));
        setBestSellers(shuffle([...productsData]).slice(0, 10));
        setCategories(categoriesWithCount);
      } catch (err) {
        console.error("Error loading:", err);
      }
    };

    fetchData();
  }, []);

  const handleCartUpdate = () => setCartCount((prev) => prev + 1);

  // Dynamic goToCategory
  const goToCategory = (cat) => {
    navigate(`/category/${cat.categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="w-full">
        <HeroCarousel />
      </section>

      {/* NEW ARRIVALS */}
      <section className="container mx-auto py-14 px-4">
        <h2 className="text-center text-2xl font-bold mb-1">New Arrivals</h2>
        <p className="text-center text-gray-600 mb-6">
          Discover our latest fashion pieces
        </p>

        <div className="overflow-x-auto pb-3">
          <div className="flex gap-5 w-max">
            {newProducts.map((p) => (
              <div key={p.productId} className="w-[260px] animate-fade-in-up">
                <ProductCard product={p} onCartUpdate={handleCartUpdate} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="container mx-auto py-14 px-4">
        <h2 className="text-center text-2xl font-bold mb-1">Best Sellers</h2>
        <p className="text-center text-gray-600 mb-6">
          Our most popular items loved by customers
        </p>

        <div className="overflow-x-auto pb-3">
          <div className="flex gap-5 w-max">
            {bestSellers.map((p) => (
              <div key={p.productId} className="w-[260px] animate-fade-in-up">
                <ProductCard product={p} onCartUpdate={handleCartUpdate} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="container mx-auto py-14 px-4">
        <h2 className="text-center text-2xl font-bold mb-1">
          Featured Categories
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Discover our latest collections
        </p>

        <div className="overflow-x-auto pb-3">
          <div className="flex gap-6 w-max mx-auto">
            {categories.map((cat) => (
              <div
                key={cat.categoryId}
                onClick={() => goToCategory(cat)}
                className="w-[240px] h-[180px] bg-black text-white flex flex-col items-center justify-center rounded-xl hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
              >
                <h3 className="text-lg font-semibold">{cat.categoryName}</h3>
                <p className="text-gray-300 text-sm mt-1">
                  {cat.productCount} items
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-2xl font-bold mb-2">Why Choose Tênbrand?</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          We deliver more than fashion — we offer a premium local brand
          experience crafted with passion, precision, and a strong sense of
          identity.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {/* Free Shipping */}
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-500 text-3xl">📦</span>
            </div>
            <h3 className="font-semibold mt-4">Free Shipping</h3>
            <p className="text-gray-600 text-sm mt-2">
              Enjoy complimentary shipping on all orders over{" "}
              <b>1,000,000 VND</b>, making your premium shopping experience
              smooth and worry-free.
            </p>
          </div>

          {/* Quality Guarantee */}
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-500 text-3xl">🛡️</span>
            </div>
            <h3 className="font-semibold mt-4">Premium Quality Guarantee</h3>
            <p className="text-gray-600 text-sm mt-2">
              Every product is crafted with carefully selected materials and
              strict quality control, backed by a flexible 30-day return policy.
            </p>
          </div>

          {/* 24/7 Support */}
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-500 text-3xl">⏰</span>
            </div>
            <h3 className="font-semibold mt-4">24/7 Customer Support</h3>
            <p className="text-gray-600 text-sm mt-2">
              Our dedicated support team is always ready to assist you anytime,
              ensuring a seamless and satisfying shopping journey.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
