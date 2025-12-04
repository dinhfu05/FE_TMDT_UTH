import { useEffect, useState } from "react";
import dashboardApi from "../services/api/dashboardApi";

export default function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    monthlyRevenue: 0,
    newOrders: 0,
    customers: 0,
    products: 0,
    lowStock: 0,
    avgRating: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        dashboardApi.getOrders(),
        dashboardApi.getCustomers(),
        dashboardApi.getProducts(),
      ]);

      const orders = ordersRes.data || [];
      const customers = customersRes.data || [];
      const products = productsRes.data || [];

      /** --- 1. Doanh thu tháng --- */
      const now = new Date();

      const monthlyRevenue = orders
        .filter(o => {
          const d = new Date(o.deliveryDate);
          return o.status === "DELIVERED" &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, o) => sum + o.totalAmount, 0);

      /** --- 2. Tổng đơn hàng --- */
      const newOrders = orders.length;

      /** --- 3. Khách hàng --- */
      const customersCount = customers.length;

      /** --- 4. Tổng sản phẩm --- */
      const productsCount = products.length;

      /** --- 5. Sản phẩm sắp hết hàng (<5) --- */
      let lowStock = 0;
      products.forEach(p => {
        p.productColors?.forEach(c => {
          c.productDetails?.forEach(d => {
            if (d.quantity < 5) lowStock++;
          });
        });
      });

      /** --- 6. Rating trung bình --- */
      let totalStars = 0;
      let totalReviews = 0;

      for (const p of products) {
        const reviewRes = await dashboardApi.getReviews(p.productId);
        const reviews = reviewRes.data || [];

        reviews.forEach(r => {
          totalStars += r.rating;
          totalReviews++;
        });
      }

      const avgRating = totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : 0;

      /** SET STATE */
      setData({
        monthlyRevenue,
        newOrders,
        customers: customersCount,
        products: productsCount,
        lowStock,
        avgRating,
      });

      setLoading(false);
    } catch (err) {
      console.error("Lỗi Dashboard: ", err);
      setLoading(false);
    }
  };

  return { loading, data };
}
