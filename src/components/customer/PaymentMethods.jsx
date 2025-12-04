const PaymentMethods = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6 uppercase">Chọn cách thanh toán</h2>

      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg hover:border-blue-500 transition">
          <input
            type="radio"
            name="payment"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
            className="mt-1"
          />
          <div className="flex-1 font-semibold">COD – Tiền mặt</div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg hover:border-blue-500 transition">
          <input
            type="radio"
            name="payment"
            value="ZALOPAY"
            checked={paymentMethod === "ZALOPAY"}
            onChange={() => setPaymentMethod("ZALOPAY")}
            className="mt-1"
          />
          <div className="flex-1 font-semibold">Thanh toán ZaloPay</div>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethods;
