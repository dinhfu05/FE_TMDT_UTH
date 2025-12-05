import { useEffect, useState } from "react";
import { customerService } from "../../services/api/customerService";
import Breadcrumb from "../../components/customer/Breadcrumb";
import { showError, showSuccess } from "../../components/shared/toast";
import { IMAGE_BASE_URL } from "../../services/api/apiService";

const getImageUrl = (filename) => {
  if (!filename) return "/default-avatar.png";
  return `${IMAGE_BASE_URL}/${filename}`;
};

const ProfilePage = () => {
  const [formData, setFormData] = useState({});
  const [originalUserName, setOriginalUserName] = useState("");
  const [membership, setMembership] = useState("Không có thành viên");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch customer profile
  useEffect(() => {
    const fetchCustomer = async () => {
      const data = await customerService.getCustomerById();
      if (data) {
        setFormData({
          fullName: data.fullName || "",
          userName: data.userName || "",
          email: data.email || "",
          phone: data.phone || "",
          date: data.date ? data.date.split("T")[0] : "",
          gender: data.gender || "MALE",
          image: data.image || "",
        });

        setOriginalUserName(data.userName);
        setMembership(data.membership || "Không có thành viên");
      }
      setLoading(false);
    };

    fetchCustomer();
  }, []);

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // SAVE UPDATE
  const handleSave = async () => {
    setSaving(true);

    const payload = {
      userName: formData.userName?.trim() || originalUserName,
      fullName: formData.fullName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      gender: formData.gender || "MALE",
      date: formData.date ? `${formData.date}T00:00:00.000Z` : null,
    };

    const result = await customerService.updateCustomer(payload);

    if (result.success) {
      showSuccess("Cập nhật thông tin thành công!");
    } else {
      showError("Lỗi khi cập nhật: " + result.message);
    }

    setSaving(false);
  };

  // Helper function render badge với màu tự động
  const renderMembershipBadge = (membership) => {
    let colorClass = "bg-gray-200 text-black"; // default

    if (membership.includes("Bạc")) colorClass = "bg-gray-300 text-black";
    else if (membership.includes("Vàng"))
      colorClass = "bg-yellow-400 text-black";
    else if (membership.includes("Bạch Kim"))
      colorClass = "bg-slate-300 text-black border border-gray-400";

    return (
      <span
        className={`mt-2 inline-block px-4 py-1 rounded-full text-sm shadow ${colorClass}`}
      >
        {membership}
      </span>
    );
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <Breadcrumb
        paths={[{ label: "Home", link: "/" }, { label: "Profile User" }]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mt-4 mb-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-100 w-full">
        <img
          src={getImageUrl(formData.image)}
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-md"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-800 truncate">
            {formData.fullName || "Người dùng"}
          </h1>
          <p className="text-gray-500 text-sm truncate">
            {formData.email || "email@example.com"}
          </p>
          {renderMembershipBadge(membership)}
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-10 w-full">
        <h2 className="text-lg font-semibold text-blue-700 mb-8 border-b pb-2">
          Thông tin cá nhân
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Họ tên */}
          <div className="flex flex-col gap-1">
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          </div>

          {/* Ngày sinh */}
          <div className="flex flex-col gap-1">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border p-2 rounded-lg h-10"
            />
          </div>

          {/* Giới tính */}
          <div className="flex flex-col gap-1">
            <label>Giới tính</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-2 rounded-lg h-10"
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
            </select>
          </div>
        </div>

        <div className="mt-10 text-right">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 text-white px-10 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
