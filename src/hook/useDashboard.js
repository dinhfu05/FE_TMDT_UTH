/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import dashboardApi from "../services/api/dashboardApi"; // Đảm bảo đường dẫn import đúng

export default function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    monthlyRevenue: 0,
    monthlyRevenueByMonth: Array(12).fill(0),
    newOrders: 0,
    customers: 0,
    products: 0,
    lowStock: 0,
    avgRating: 0,
    weeklyChart: Array(7).fill(0),
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Gọi song song các API để tiết kiệm thời gian
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        dashboardApi.getOrders(),
        dashboardApi.getCustomers(),
        dashboardApi.getProducts(),
      ]);

      const orders = ordersRes.data || [];
      const customers = customersRes.data || [];
      const products = productsRes.data || [];

      const now = new Date();
      const currentYear = now.getFullYear();

      /** ================================
       * 1) DOANH THU THÁNG HIỆN TẠI
       * Logic: Chỉ cộng đơn hàng trạng thái DELIVERED
       * ================================= */
      const monthlyRevenue = orders
        .filter((o) => {
          // --- FIX: Kiểm tra trạng thái DELIVERED ---
          if (o.status !== "DELIVERED") return false;

          // Kiểm tra ngày giao hàng (nếu không có ngày giao thì bỏ qua hoặc dùng ngày tạo tuỳ logic)
          if (!o.deliveryDate) return false;

          const d = new Date(o.deliveryDate);
          return (
            d.getFullYear() === currentYear && d.getMonth() === now.getMonth()
          );
        })
        .reduce((sum, o) => sum + o.totalAmount, 0);

      /** ================================
       * 2) DOANH THU 12 THÁNG (BIỂU ĐỒ)
       * Logic: Chỉ cộng đơn hàng trạng thái DELIVERED
       * ================================= */
      const revenue12Months = Array(12).fill(0);

      orders.forEach((o) => {
        // --- FIX: Kiểm tra trạng thái DELIVERED ---
        if (o.status !== "DELIVERED") return;
        if (!o.deliveryDate) return;

        const d = new Date(o.deliveryDate);

        // Chỉ lấy đơn của NĂM HIỆN TẠI
        if (d.getFullYear() !== currentYear) return;

        const monthIndex = d.getMonth(); // 0 → 11
        revenue12Months[monthIndex] += o.totalAmount;
      });

      /** ================================
       * 3) SỐ ĐƠN HÀNG (Tổng số đơn)
       * ================================= */
      const newOrders = orders.length;

      /** ================================
       * 4) SỐ KHÁCH HÀNG
       * ================================= */
      const customersCount = customers.length;

      /** ================================
       * 5) SỐ SẢN PHẨM
       * ================================= */
      const productsCount = products.length;

      /** ================================
       * 6) SẢN PHẨM SẮP HẾT HÀNG (< 5)
       * ================================= */
      let lowStock = 0;
      products.forEach((p) => {
        p.productColors?.forEach((c) => {
          c.productDetails?.forEach((d) => {
            if (d.quantity < 5) lowStock++;
          });
        });
      });

      /** ================================
       * 7) RATING TRUNG BÌNH
       * ================================= */
      let totalStars = 0;
      let totalReviews = 0;

      // Sử dụng Promise.all để gọi API review nhanh hơn thay vì vòng lặp for tuần tự
      await Promise.all(
        products.map(async (p) => {
          try {
            const reviewRes = await dashboardApi.getReviews(p.productId);
            const reviews = reviewRes.data || [];
            if (reviews.length > 0) {
              reviews.forEach((r) => {
                totalStars += r.rating;
                totalReviews++;
              });
            }
          } catch (error) {
            console.warn(`Không lấy được review cho sản phẩm ${p.productId}`);
          }
        })
      );

      const avgRating =
        totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : 0;

      /** ================================
       * 8) WEEKLY CHART (7 NGÀY GẦN NHẤT)
       * Logic: Chỉ cộng đơn hàng trạng thái DELIVERED
       * ================================= */
      const last7daysRevenue = [];

      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);

        const dailyRevenue = orders
          .filter((o) => {
            // --- FIX: Kiểm tra trạng thái DELIVERED ---
            if (o.status !== "DELIVERED") return false;
            if (!o.deliveryDate) return false;

            const d = new Date(o.deliveryDate);
            return (
              d.getDate() === day.getDate() &&
              d.getMonth() === day.getMonth() &&
              d.getFullYear() === day.getFullYear()
            );
          })
          .reduce((sum, o) => sum + o.totalAmount, 0);

        last7daysRevenue.push(dailyRevenue);
      }

      // Tính % cho biểu đồ (nếu biểu đồ yêu cầu %)
      const maxRevenue = Math.max(...last7daysRevenue) || 1;
      const weeklyChart = last7daysRevenue.map((v) =>
        Math.round((v / maxRevenue) * 100)
      );

      /** ================================
       * SET STATE
       * ================================= */
      setData({
        monthlyRevenue,
        monthlyRevenueByMonth: revenue12Months,
        newOrders,
        customers: customersCount,
        products: productsCount,
        lowStock,
        avgRating,
        weeklyChart,
      });

      setLoading(false);
    } catch (err) {
      console.error("Lỗi Dashboard: ", err);
      setLoading(false);
    }
  };

  return { loading, data };
}
