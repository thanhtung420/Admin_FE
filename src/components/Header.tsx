import { Search, Bell, Menu } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-10 shrink-0">
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

                {/* Thông tin Avatar */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-700 group-hover:text-violet-600 transition-colors">Admin Sensei</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quản trị viên</p>
                    </div>
                    {/* Sử dụng UI Avatars để tạo avatar tự động từ tên */}
                    <img 
                        src="https://ui-avatars.com/api/?name=Admin+Sensei&background=8b5cf6&color=fff&rounded=true&bold=true" 
                        alt="Avatar" 
                        className="w-11 h-11 rounded-xl shadow-sm border-2 border-white group-hover:border-violet-100 transition-all"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;