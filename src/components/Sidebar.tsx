import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Library, Users, Settings, LogOut, HelpCircle, FileText } from 'lucide-react';

const Sidebar = () => {
    // Khai báo danh sách các menu để dễ dàng thêm/bớt sau này
    const menuItems = [
        { path: '/dashboard', name: 'Tổng quan', icon: LayoutDashboard },
        { path: '/lesson', name: 'Bài học', icon: BookOpen },
        { path: '/vocabulary', name: 'Từ vựng', icon: Library },
        { path: '/user', name: 'Học viên', icon: Users },
        { path: '/question', name: 'Câu hỏi', icon: HelpCircle },
        { path: '/exam', name: 'Đề thi', icon: FileText },
        { path: '/exam-results', name: 'Kết quả thi', icon: FileText }
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-100 flex flex-col hidden md:flex">
            {/* Logo Thương hiệu */}
            <div className="h-24 flex items-center px-8 border-b border-slate-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xl">N</span>
                    </div>
                    <h1 className="text-2xl font-black text-violet-600 tracking-tight">
                        Nihongo<span className="text-slate-800">Admin</span>
                    </h1>
                </div>
            </div>

            {/* Menu Điều hướng */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 ${
                                isActive
                                    ? 'bg-violet-50 text-violet-700 shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon 
                                    size={20} 
                                    className={isActive ? 'text-violet-600' : 'text-slate-400'} 
                                />
                                <span>{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Cài đặt & Đăng xuất nằm ở đáy */}
            <div className="p-4 border-t border-slate-50 space-y-2">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200">
                    <Settings size={20} className="text-slate-400" />
                    <span>Cài đặt</span>
                </button>
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
                    <LogOut size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;