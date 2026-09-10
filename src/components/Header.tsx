import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState("Admin Sensei");
    const [adminRole, setAdminRole] = useState("QUẢN TRỊ VIÊN");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Đọc thông tin user từ localStorage khi component được load
    useEffect(() => {
        try {
            // Kiểm tra xem nhóm bạn có lưu thông tin user dưới dạng JSON hay không
            const savedUser = localStorage.getItem("user") || localStorage.getItem("userInfo");
            if (savedUser) {
                const userObj = JSON.parse(savedUser);
                if (userObj.fullName || userObj.name || userObj.username) {
                    setAdminName(userObj.fullName || userObj.name || userObj.username);
                }
                if (userObj.role || userObj.roles) {
                    setAdminRole(userObj.role || userObj.roles[0] || "QUẢN TRỊ VIÊN");
                }
            } else {
                // Hoặc nếu backend lưu trực tiếp tên riêng
                const tokenName = localStorage.getItem("username");
                if (tokenName) {
                    setAdminName(tokenName);
                }
            }
        } catch (e) {
            console.error("Không thể đọc thông tin user từ localStorage", e);
        }

        // Đóng dropdown khi click ra bên ngoài
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userInfo");
        navigate("/login"); // Điều hướng về trang đăng nhập
    };

    // Tạo link avatar tự động dựa theo tên thật của Admin
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=1B2A4A&color=fff&rounded=true&bold=true`;

    return (
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-10 shrink-0 relative">
            {/* Nút menu cho mobile (hiện tại ẩn trên desktop) */}
            <button className="md:hidden text-slate-500 hover:text-violet-600 transition-colors">
                <Menu size={24} />
            </button>

            {/* Thanh tìm kiếm */}
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 w-[400px] focus-within:ring-2 ring-violet-100 focus-within:border-violet-300 transition-all">
                <Search size={18} className="text-slate-400 mr-3" />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm bài học, học viên..." 
                    className="bg-transparent w-full text-sm font-semibold outline-none text-slate-700 placeholder:text-slate-400"
                />
            </div>

            {/* Khu vực thông báo & Avatar User */}
            <div className="flex items-center gap-6">
                {/* Icon Thông báo có chấm đỏ */}
                <button className="relative text-slate-400 hover:text-violet-600 transition-colors">
                    <Bell size={22} />
                    <span className="absolute -top-1 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Đường kẻ dọc phân cách */}
                <div className="w-px h-8 bg-slate-100 hidden md:block"></div>

                {/* Khu vực bấm vào để hiện Menu Đăng xuất */}
                <div className="relative" ref={dropdownRef}>
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 cursor-pointer group select-none"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-slate-700 group-hover:text-violet-600 transition-colors">{adminName}</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{adminRole}</p>
                        </div>
                        <img 
                            src={avatarUrl} 
                            alt="Avatar" 
                            className="w-11 h-11 rounded-xl shadow-sm border-2 border-white group-hover:border-violet-100 transition-all object-cover"
                        />
                    </div>

                    {/* Dropdown Menu Đăng xuất */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                            <div className="px-4 py-2 border-b border-slate-100 md:hidden">
                                <p className="text-sm font-bold text-slate-700">{adminName}</p>
                                <p className="text-[10px] text-slate-400 uppercase">{adminRole}</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={16} /> Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;