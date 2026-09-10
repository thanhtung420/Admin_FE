import React, { useState, useEffect } from 'react';
import { Search, Mail, X, UserCheck, Flame, Coins, Heart, Award, ShieldPlus, Edit3, Trash2, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

export const User = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // ALL, USER, ADMIN
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // State Modal Sửa Học Viên
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // State Modal Thêm Admin Mới
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ email: '', username: '', password: '', displayName: '' });

  // State Modal Xác Nhận Xóa
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // --- HÀM LẤY DANH SÁCH USER TỪ BACKEND ---
  const fetchUsers = async () => {
    setIsFetching(true);
    const token = localStorage.getItem("token");
    if (!token) { setIsFetching(false); return; }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const listData = Array.isArray(data) ? data : (data.content || data.data || data.result || []);
        setUsers(listData);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách người dùng:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- HÀM TẠO ADMIN MỚI (@PostMapping("/users/create-admin")) ---
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/create-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(adminForm)
      });

      if (response.ok) {
        setMessage("Tạo tài khoản Admin thành công!");
        setIsError(false);
        setTimeout(() => {
          setIsCreateAdminOpen(false);
          setAdminForm({ email: '', username: '', password: '', displayName: '' });
          fetchUsers();
        }, 1000);
      } else {
        const err = await response.json();
        setMessage(err.detail || "Lỗi khi tạo Admin mới!");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Lỗi kết nối máy chủ!");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM CẬP NHẬT THÔNG TIN HỌC VIÊN (PUT) ---
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editingUser)
      });

      if (response.ok) {
        setEditingUser(null);
        await fetchUsers();
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      alert("Lỗi kết nối!");
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM XÓA HỌC VIÊN (DELETE) ---
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${deletingUser.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok || response.status === 204) {
        setDeletingUser(null);
        await fetchUsers();
      } else {
        alert("Xóa học viên thất bại!");
      }
    } catch (error) {
      alert("Lỗi kết nối khi xóa!");
    } finally {
      setIsDeleting(false);
    }
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm và vai trò
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.display_name?.toLowerCase() || user.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    if (roleFilter === 'ALL') return matchesSearch;
    return matchesSearch && user.role?.toUpperCase() === roleFilter;
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F7F3EC] px-6 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;800&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Shippori Mincho', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .genkou-grid { background-image: linear-gradient(rgba(27,42,74,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(27,42,74,0.05) 1px, transparent 1px); background-size: 44px 44px; }
      `}</style>

      <div className="absolute inset-0 genkou-grid pointer-events-none" aria-hidden="true" />
      <div className="absolute -right-16 top-10 font-display text-[250px] leading-none text-[#1B2A4A]/[0.03] select-none pointer-events-none">人</div>
      <div aria-hidden="true" className="absolute top-0 left-0 w-full h-1.5 bg-[#1B2A4A]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-8 font-body">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="w-10 h-[3px] bg-[#B23B3B] mb-4" />
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#23211D]">Quản lý Người dùng </h1>
            <p className="text-slate-500 mt-2 font-medium">Quản lý toàn bộ học viên và phân quyền tài khoản quản trị viên.</p>
          </div>
          <button 
            onClick={() => setIsCreateAdminOpen(true)}
            className="bg-[#1B2A4A] hover:bg-[#12203B] text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <ShieldPlus size={20} /> Tạo Admin Mới
          </button>
        </header>

        {/* SEARCH & FILTER */}
        <div className="bg-white border border-[#E7E1D4] p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center bg-[#F7F3EC] border border-[#E7E1D4] rounded-lg px-4 py-2.5 w-full md:w-[400px]">
            <Search size={18} className="text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Tìm theo tên hiển thị, email, username..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent w-full text-sm font-medium outline-none text-[#23211D] placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {['ALL', 'USER', 'ADMIN'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${roleFilter === role ? 'bg-[#1B2A4A] text-white border-[#1B2A4A] shadow-md' : 'bg-[#F7F3EC] text-slate-600 border-[#E7E1D4] hover:bg-[#E7E1D4]'}`}
              >
                {role === 'ALL' ? 'Tất cả' : role === 'USER' ? 'Học viên' : 'Quản trị viên'}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE DATA */}
        <div className="bg-white rounded-xl border border-[#E7E1D4] shadow-sm overflow-hidden min-h-[300px] relative">
          {isFetching ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <Loader2 className="animate-spin text-[#1B2A4A] mb-3" size={32} />
              <p className="text-sm font-semibold text-slate-500">Đang tải dữ liệu hệ thống...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E7E1D4] bg-[#1B2A4A]/5 text-xs font-bold text-[#1B2A4A] uppercase tracking-wider">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Học viên / Admin</th>
                    <th className="py-4 px-6">Tài khoản</th>
                    <th className="py-4 px-6">Vai trò</th>
                    <th className="py-4 px-6">Cấp độ (Level)</th>
                    <th className="py-4 px-6 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E1D4] text-sm font-medium">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">Không tìm thấy người dùng nào!</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isAdmin = user.role?.toUpperCase() === 'ADMIN';
                      return (
                        <tr key={user.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                          <td className="py-4 px-6 text-slate-400 font-bold">#{user.id}</td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-[#23211D]">{user.display_name || user.displayName || user.username}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Mail size={12}/> {user.email}</div>
                          </td>
                          <td className="py-4 px-6 text-slate-600">@{user.username}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-md text-xs font-bold border ${isAdmin ? 'bg-[#FBEAEA] text-[#8A2E24] border-[#EBC6C2]' : 'bg-[#EFF6EE] text-[#2E5C33] border-[#CFE3CC]'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-[#B23B3B]">
                            {isAdmin ? '---' : `Level ${user.level || 1}`}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setSelectedUser(user)} className="px-3 py-1.5 bg-white text-[#1B2A4A] font-bold text-xs rounded-lg hover:bg-[#F7F3EC] transition-colors border border-[#E7E1D4] shadow-sm">
                                Chi tiết
                              </button>
                              <button onClick={() => setEditingUser(user)} className="p-2 hover:bg-[#F7F3EC] text-slate-400 hover:text-[#1B2A4A] rounded-lg transition-colors border border-transparent hover:border-[#E7E1D4]" title="Chỉnh sửa">
                                <Edit3 size={18} />
                              </button>
                              {!isAdmin && (
                                <button onClick={() => setDeletingUser(user)} className="p-2 hover:bg-[#FBEAEA] text-slate-400 hover:text-[#8A2E24] rounded-lg transition-colors border border-transparent hover:border-[#EBC6C2]" title="Xóa học viên">
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL TẠO ADMIN MỚI */}
        {isCreateAdminOpen && (
          <div className="fixed inset-0 bg-[#1B2A4A]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-[#E7E1D4]">
              <button onClick={() => setIsCreateAdminOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:bg-slate-100 p-2 rounded-full"><X size={20}/></button>
              <h2 className="text-xl font-bold text-[#1B2A4A] mb-6 flex items-center gap-2 font-display"><ShieldPlus /> Thêm tài khoản Quản trị</h2>

              {message && (
                <div className={`mb-4 px-4 py-3 border rounded-lg text-sm font-medium ${isError ? 'bg-[#FBEAEA] border-[#EBC6C2] text-[#8A2E24]' : 'bg-[#EFF6EE] border-[#CFE3CC] text-[#2E5C33]'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="space-y-4 font-body">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Email</label>
                  <input type="email" required value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] font-semibold" placeholder="admin@nihongo.app"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Username</label>
                  <input type="text" required value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] font-semibold" placeholder="admin_user"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Tên hiển thị</label>
                  <input type="text" required value={adminForm.displayName} onChange={e => setAdminForm({...adminForm, displayName: e.target.value})} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] font-semibold" placeholder="Quản Trị Viên"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Mật khẩu</label>
                  <input type="password" required value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] font-semibold" placeholder="••••••••"/>
                </div>
                <button type="submit" disabled={loading} className="w-full h-12 bg-[#1B2A4A] hover:bg-[#12203B] text-white font-bold rounded-lg transition-all mt-4 shadow-sm">
                  {loading ? "Đang xử lý..." : "Xác nhận tạo Admin"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CHỈNH SỬA HỌC VIÊN */}
        {editingUser && (
          <div className="fixed inset-0 bg-[#1B2A4A]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-[#E7E1D4]">
              <button onClick={() => setEditingUser(null)} className="absolute top-6 right-6 text-slate-400 hover:bg-slate-100 p-2 rounded-full"><X size={20}/></button>
              <h2 className="text-xl font-bold text-[#1B2A4A] mb-6 flex items-center gap-2 font-display"><Edit3 /> Chỉnh sửa thông tin</h2>

              <form onSubmit={handleUpdateUser} className="space-y-4 font-body">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Tên hiển thị</label>
                  <input type="text" required value={editingUser.display_name || editingUser.displayName || ''} onChange={e => setEditingUser({...editingUser, displayName: e.target.value, display_name: e.target.value})} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] font-semibold"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Số điện thoại</label>
                  <input type="text" value={editingUser.phone_number || editingUser.phoneNumber || ''} onChange={e => setEditingUser({...editingUser, phone_number: e.target.value})} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] font-semibold"/>
                </div>
                {editingUser.role?.toUpperCase() !== 'ADMIN' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Cấp độ (Level)</label>
                    <input type="number" min="1" value={editingUser.level || 1} onChange={e => setEditingUser({...editingUser, level: Number(e.target.value)})} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] font-semibold"/>
                  </div>
                )}
                <button type="submit" disabled={loading} className="w-full h-12 bg-[#1B2A4A] hover:bg-[#12203B] text-white font-bold rounded-lg transition-all mt-4 shadow-sm">
                  {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CHI TIẾT */}
        {selectedUser && (
          <div className="fixed inset-0 bg-[#1B2A4A]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border border-[#E7E1D4]">
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E1D4] mb-6">
                <h2 className="text-xl font-bold text-[#1B2A4A] flex items-center gap-2 font-display">
                  <UserCheck /> Hồ sơ chi tiết: #{selectedUser.id}
                </h2>
                <button onClick={() => setSelectedUser(null)} className="p-2 text-slate-400 hover:bg-[#F7F3EC] rounded-full"><X size={20}/></button>
              </div>

              <div className="space-y-6 font-body">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin định danh hệ thống</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F7F3EC]/50 p-4 rounded-xl border border-[#E7E1D4] text-sm font-semibold">
                    <div><span className="text-slate-400 block text-xs">Họ tên:</span> {selectedUser.display_name || selectedUser.displayName || '---'}</div>
                    <div><span className="text-slate-400 block text-xs">Username:</span> @{selectedUser.username}</div>
                    <div><span className="text-slate-400 block text-xs">Email:</span> {selectedUser.email}</div>
                    <div><span className="text-slate-400 block text-xs">Số điện thoại:</span> {selectedUser.phone_number || selectedUser.phoneNumber || 'Chưa cập nhật'}</div>
                    <div><span className="text-slate-400 block text-xs">Auth Provider:</span> {selectedUser.auth_provider || 'LOCAL'}</div>
                    <div><span className="text-slate-400 block text-xs">Vai trò:</span> {selectedUser.role}</div>
                    <div><span className="text-slate-400 block text-xs">Ngày tạo:</span> {selectedUser.created_at || '---'}</div>
                  </div>
                </div>

                {selectedUser.role?.toUpperCase() !== 'ADMIN' && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Chỉ số Trò chơi & Tiến độ học tập</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                        <Award className="mx-auto text-[#1B2A4A] mb-1" size={24} />
                        <span className="text-xs text-slate-500 font-bold block">Cấp độ (Level)</span>
                        <span className="text-lg font-black text-[#1B2A4A]">{selectedUser.level || 1}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                        <span className="text-xs text-slate-500 font-bold block mb-1">Kinh nghiệm (Exp)</span>
                        <span className="text-lg font-black text-slate-700">{selectedUser.exp || 0}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                        <Coins className="mx-auto text-[#B23B3B] mb-1" size={24} />
                        <span className="text-xs text-slate-500 font-bold block">Tiền vàng (Coins)</span>
                        <span className="text-lg font-black text-[#B23B3B]">{selectedUser.coins || 0}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                        <Heart className="mx-auto text-[#B23B3B] mb-1" size={24} />
                        <span className="text-xs text-slate-500 font-bold block">Mạng sống (Hearts)</span>
                        <span className="text-lg font-black text-[#B23B3B]">{selectedUser.hearts || 3}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                        <Flame className="mx-auto text-orange-500 mb-1" size={24} />
                        <span className="text-xs text-slate-500 font-bold block">Streak hiện tại</span>
                        <span className="text-lg font-black text-orange-600">{selectedUser.current_streak || 0} ngày</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                        <span className="text-xs text-slate-500 font-bold block mb-1">Streak dài nhất</span>
                        <span className="text-lg font-black text-emerald-600">{selectedUser.longest_streak || 0} ngày</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL XÁC NHẬN XÓA */}
        {deletingUser && (
          <div className="fixed inset-0 bg-[#1B2A4A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl font-body space-y-4">
              <h3 className="text-lg font-bold text-[#23211D]">Xác nhận xóa người dùng</h3>
              <p className="text-sm text-slate-600">
                Bạn có chắc chắn muốn xóa tài khoản <span className="font-bold text-[#B23B3B]">@{deletingUser.username}</span>? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setDeletingUser(null)} className="px-4 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-sm">
                  Hủy bỏ
                </button>
                <button onClick={handleDeleteUser} disabled={isDeleting} className="px-4 py-2 rounded-lg bg-[#8A2E24] hover:bg-[#6e231b] font-semibold text-white transition-colors text-sm flex items-center gap-2">
                  {isDeleting && <Loader2 size={14} className="animate-spin" />} Xóa vĩnh viễn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;