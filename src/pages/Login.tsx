import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Dùng để chuyển hướng trang
import { API_BASE_URL } from "../utils/api";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Lấy token từ phản hồi của Backend (tùy Backend cấu hình trả về là 'token' hay 'accessToken')
        const token = data.token || data.accessToken;

        if (token) {
          // 1. Lưu token vào bộ nhớ trình duyệt
          localStorage.setItem("token", token);

          // 2. Tùy chọn: Lưu thêm thông tin user nếu cần
          if (data.username) localStorage.setItem("username", data.username);

          // 3. Chuyển hướng sang trang Bài học và cuộn lên đầu trang
          navigate("/lesson");
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        } else {
          setError("Lỗi hệ thống: Không nhận được Token từ máy chủ!");
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          setError("Tài khoản hoặc mật khẩu không chính xác!");
        } else {
          setError(`Lỗi đăng nhập! (Mã lỗi: ${response.status})`);
        }
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại Backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F7F3EC] flex items-center justify-center px-6 py-16">
      {/* Font & pattern helpers */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;800&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Shippori Mincho', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .genkou-grid {
          background-image:
            linear-gradient(rgba(27,42,74,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(27,42,74,0.05) 1px, transparent 1px);
          background-size: 44px 44px;
        }
      `}</style>

      {/* Decorative background layer */}
      <div className="absolute inset-0 genkou-grid pointer-events-none" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -right-16 -bottom-24 font-display text-[300px] lg:text-[420px] leading-none text-[#1B2A4A]/[0.035] select-none pointer-events-none"
      >
        学
      </div>
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-1.5 bg-[#1B2A4A]"
      />

      {/* Form column */}
      <div className="relative z-10 w-full max-w-xl">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-9 h-9 rounded-md bg-[#B23B3B] flex items-center justify-center font-display text-white text-lg shrink-0">
            日
          </span>
          <span className="font-body text-[#1B2A4A]/70 text-xs tracking-[0.22em] uppercase">
            Nihongo App · Quản trị
          </span>
        </div>

        <div className="mb-10">
          <div className="w-10 h-[3px] bg-[#B23B3B] mb-5" />
          <h2 className="font-display text-3xl lg:text-4xl text-[#23211D] mb-2">
            Đăng nhập quản trị
          </h2>
          <p className="font-body text-slate-500 text-sm">
            Nhập thông tin tài khoản admin để tiếp tục.
          </p>
        </div>

          {error && (
            <div className="mb-6 px-5 py-4 bg-[#FBEAEA] border border-[#EBC6C2] text-[#8A2E24] rounded-lg text-sm font-body font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 font-body">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Tài khoản (Username)
              </label>
              <input
                type="text"
                className="w-full h-14 bg-white border border-slate-200 rounded-lg px-5 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A] transition-all"
                placeholder="admin@nihongo.app"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                className="w-full h-14 bg-white border border-slate-200 rounded-lg px-5 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A] transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-[#1B2A4A] focus:ring-[#1B2A4A]/30"
                />
                Ghi nhớ đăng nhập
              </label>
              <a
                href="#"
                className="text-[#1B2A4A] font-medium hover:text-[#B23B3B] transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-lg font-semibold text-base text-white shadow-sm transition-all duration-200 ${
                loading
                  ? "bg-[#1B2A4A]/50 cursor-not-allowed"
                  : "bg-[#1B2A4A] hover:bg-[#12203B] hover:shadow-md"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Đăng Nhập"
              )}
            </button>
          </form>

          <p className="font-body text-slate-400 text-xs text-center mt-10">
            Hệ thống quản trị học liệu · Nihongo App © {year}
          </p>
        </div>
    </div>
  );
};

export default Login;