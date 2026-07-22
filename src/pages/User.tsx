import React, { useState } from 'react';
import { Search, Mail, X, ShieldCheck, UserCheck, Flame, Coins, Heart, Award, Phone, Calendar } from 'lucide-react';

export const User = () => {
  // Dữ liệu giả lập khớp 100% các cột trong bảng `users`
  const [users] = useState([
    
    {
      id: 1,
      email: 'hoangvd@example.com',
      username: 'hoangvd',
      phone_number: '0123456789',
      display_name: ' Hoàng',
      role: 'User',
      level: 5,
      exp: 820,
      hearts: 3,
      coins: 150,
      current_streak: 4,
      longest_streak: 12,
      created_at: '2026-01-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Quản lý Học viên</h1>
          <p className="text-slate-500 mt-1">Danh sách tài khoản và thông tin chi tiết trên hệ thống.</p>
        </div>
      </header>

      {/* Tìm kiếm */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center w-full md:w-[400px]">
        <Search size={18} className="text-slate-400 mr-3" />
        <input 
          type="text" 
          placeholder="Tìm theo tên hiển thị, email, username..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent w-full text-sm font-semibold outline-none text-slate-700"
        />
      </div>

      {/* Bảng danh sách gọn gàng */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Học viên</th>
                <th className="py-4 px-6">Tài khoản</th>
                <th className="py-4 px-6">Vai trò</th>
                <th className="py-4 px-6">Cấp độ (Level)</th>
                <th className="py-4 px-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800">{user.display_name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Mail size={12}/> {user.email}</div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-600">@{user.username}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${user.role === 'ADMIN' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-violet-600">Level {user.level}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="px-4 py-2 bg-violet-50 text-violet-600 font-bold text-xs rounded-xl hover:bg-violet-100 transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL HIỂN THỊ ĐẦY ĐỦ CÁC TRƯỜNG DỮ LIỆU CỦA USER */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <UserCheck className="text-violet-600"/> Hồ sơ chi tiết học viên
              </h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>

            <div className="space-y-6">
              {/* Block 1: Thông tin định danh */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin định danh</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-semibold">
                  <div><span className="text-slate-400 block text-xs">Họ tên:</span> {selectedUser.display_name}</div>
                  <div><span className="text-slate-400 block text-xs">Username:</span> @{selectedUser.username}</div>
                  <div><span className="text-slate-400 block text-xs">Email:</span> {selectedUser.email}</div>
                  <div><span className="text-slate-400 block text-xs">Số điện thoại:</span> {selectedUser.phone_number || 'Chưa cập nhật'}</div>
                  <div><span className="text-slate-400 block text-xs">Ngày tham gia:</span> {selectedUser.created_at}</div>
                  <div><span className="text-slate-400 block text-xs">Vai trò:</span> {selectedUser.role}</div>
                </div>
              </div>

              {/* Block 2: Chỉ số Gamification & Học tập */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Chỉ số trò chơi & Tiến độ</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-violet-50 p-4 rounded-2xl border border-violet-100 text-center">
                    <Award className="mx-auto text-violet-600 mb-1" size={24} />
                    <span className="text-xs text-violet-500 font-bold block">Cấp độ (Level)</span>
                    <span className="text-lg font-black text-violet-700">{selectedUser.level}</span>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                    <span className="text-xs text-blue-500 font-bold block mb-1">Kinh nghiệm (Exp)</span>
                    <span className="text-lg font-black text-blue-700">{selectedUser.exp}</span>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center">
                    <Coins className="mx-auto text-amber-500 mb-1" size={24} />
                    <span className="text-xs text-amber-600 font-bold block">Tiền vàng (Coins)</span>
                    <span className="text-lg font-black text-amber-700">{selectedUser.coins}</span>
                  </div>
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center">
                    <Heart className="mx-auto text-red-500 mb-1" size={24} />
                    <span className="text-xs text-red-500 font-bold block">Mạng sống (Hearts)</span>
                    <span className="text-lg font-black text-red-700">{selectedUser.hearts}</span>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
                    <Flame className="mx-auto text-orange-500 mb-1" size={24} />
                    <span className="text-xs text-orange-500 font-bold block">Streak hiện tại</span>
                    <span className="text-lg font-black text-orange-700">{selectedUser.current_streak} ngày</span>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                    <span className="text-xs text-emerald-600 font-bold block mb-1">Streak dài nhất</span>
                    <span className="text-lg font-black text-emerald-700">{selectedUser.longest_streak} ngày</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;