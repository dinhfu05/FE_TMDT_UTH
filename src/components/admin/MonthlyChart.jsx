const months = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
];

const MonthlyChart = ({ data }) => {
  if (!data || !data.monthlyRevenueByMonth) return null;

  // Chuyển đổi dữ liệu sang số an toàn
  const revenue = data.monthlyRevenueByMonth.map((num) => Number(num) || 0);

  /** ===========================
   * YÊU CẦU: Cố định Max là 4 triệu
   * =========================== */
  const MAX_REVENUE = 4000000;

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Doanh thu 12 tháng</h2>

      {/* Container giữ nguyên h-64 để biểu đồ thoáng */}
      <div className="flex items-end justify-between gap-2 h-64">
        {revenue.map((value, index) => {
          // Tính % chiều cao so với 4 triệu
          let percent = (value / MAX_REVENUE) * 100;

          // Giới hạn max là 100% để không bị tràn ra ngoài nếu lỡ doanh thu vượt 4tr
          if (percent > 100) percent = 100;

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-end w-full h-full group"
            >
              {/* Tooltip hiển thị số tiền chính xác khi hover */}
              <div className="mb-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-600 whitespace-nowrap">
                {new Intl.NumberFormat("vi-VN").format(value)} đ
              </div>

              <div
                // Nếu giá trị = 0 thì làm mờ màu đi một chút (bg-indigo-300) cho đẹp, còn có tiền thì đậm (bg-indigo-500)
                // Hoặc bạn có thể để chung 1 màu bg-indigo-500 cũng được
                className={`w-full rounded-t-md transition-all duration-500 relative ${
                  value > 0 ? "bg-indigo-500" : "bg-indigo-200"
                }`}
                style={{
                  height: `${percent}%`,
                  // YÊU CẦU: Luôn hiển thị tối thiểu 6px dù là 0đ
                  minHeight: "6px",
                }}
              ></div>

              <span className="text-xs mt-2 font-medium text-gray-500">
                {months[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyChart;
