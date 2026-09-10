import React, { useState, useEffect } from "react";
import { Plus, Search, Edit3, Trash2, Layers, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../utils/api";

interface TopicFormData {
  title: string;
  description: string;
  orderIndex: number | string;
}

export const Topic = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State Modal Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // State Modal Xóa
  const [deletingTopic, setDeletingTopic] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<TopicFormData>({
    title: "",
    description: "",
    orderIndex: 1,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // --- LẤY DANH SÁCH TOPIC ---
  const fetchTopics = async () => {
    setIsFetching(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsFetching(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/topics`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Dữ liệu Topic từ API trả về:", data);

        // Hứng mọi định dạng trả về từ Backend (List trực tiếp hoặc bọc trong object)
        const listData = Array.isArray(data) ? data : (data.content || data.data || data.result || []);
        setTopics(listData);
      }
    } catch (error) {
      console.error("Lỗi kết nối khi tải topics:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // --- MỞ MODAL TẠO MỚI ---
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", orderIndex: topics.length + 1 });
    setMessage("");
    setIsError(false);
    setIsModalOpen(true);
  };

  // --- MỞ MODAL SỬA ---
  const handleOpenEditModal = (topic: any) => {
    setEditingId(topic.id);
    setFormData({
      title: topic.title || "",
      description: topic.description || "",
      orderIndex: topic.orderIndex ?? topic.order_index ?? 1,
    });
    setMessage("");
    setIsError(false);
    setIsModalOpen(true);
  };

  // --- XỬ LÝ XÓA TOPIC ---
  const handleDeleteConfirm = async () => {
    if (!deletingTopic) return;
    setIsDeleting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/topics/${deletingTopic.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok || response.status === 204) {
        setDeletingTopic(null);
        await fetchTopics();
      } else {
        const errText = await response.text();
        alert(`Xóa thất bại: ${errText}`);
      }
    } catch (error) {
      alert("Lỗi kết nối khi xóa topic!");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- SUBMIT FORM (CREATE HOẶC UPDATE) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Lỗi: Bạn chưa đăng nhập!");
      setIsError(true);
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      orderIndex: Number(formData.orderIndex) || 1
    };

    const url = editingId 
      ? `${API_BASE_URL}/api/admin/topics/${editingId}`
      : `${API_BASE_URL}/api/admin/topics`;
      
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage(editingId ? "Cập nhật Topic thành công!" : "Tạo Topic thành công!");
        setIsError(false);
        setTimeout(() => setIsModalOpen(false), 1000);
        await fetchTopics();
      } else {
        const errText = await response.text();
        setMessage(`Lỗi xử lý! (${response.status}) - ${errText}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage("Lỗi mạng: Không thể kết nối đến server backend!");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F7F3EC] px-6 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;800&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Shippori Mincho', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .genkou-grid {
          background-image: linear-gradient(rgba(27,42,74,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(27,42,74,0.05) 1px, transparent 1px);
          background-size: 44px 44px;
        }
      `}</style>

      <div className="absolute inset-0 genkou-grid pointer-events-none" aria-hidden="true" />
      <div className="absolute -left-16 top-10 font-display text-[250px] leading-none text-[#1B2A4A]/[0.03] select-none pointer-events-none">単</div>
      <div aria-hidden="true" className="absolute top-0 left-0 w-full h-1.5 bg-[#1B2A4A]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-8 font-body">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="w-10 h-[3px] bg-[#B23B3B] mb-4" />
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#23211D]">Quản lý Chủ đề (Topic)</h1>
            <p className="text-slate-500 mt-2 font-medium">Danh sách các chủ đề bài học lớn.</p>
          </div>
          <button 
            onClick={handleOpenCreateModal}
            className="bg-[#1B2A4A] hover:bg-[#12203B] text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <Plus size={20} /> Tạo Topic mới
          </button>
        </header>

        {/* SEARCH BAR */}
        <div className="bg-white border border-[#E7E1D4] p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center bg-[#F7F3EC] border border-[#E7E1D4] rounded-lg px-4 py-2.5 w-full md:w-96">
            <Search size={18} className="text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Tìm tiêu đề topic..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent w-full text-sm font-medium outline-none text-[#23211D] placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* TABLE HIỂN THỊ DANH SÁCH */}
        <div className="bg-white rounded-xl border border-[#E7E1D4] shadow-sm overflow-hidden min-h-[300px] relative">
          {isFetching ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <Loader2 className="animate-spin text-[#1B2A4A] mb-3" size={32} />
              <p className="text-sm font-semibold text-slate-500">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E7E1D4] bg-[#1B2A4A]/5 text-xs font-bold text-[#1B2A4A] uppercase tracking-wider">
                    <th className="py-4 px-6 w-16">ID</th>
                    <th className="py-4 px-6">Tiêu đề Topic</th>
                    <th className="py-4 px-6">Mô tả</th>
                    <th className="py-4 px-6 text-center w-28">Thứ tự</th>
                    <th className="py-4 px-6 text-right w-28">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E1D4] text-sm font-medium">
                  {topics.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 font-semibold">
                        Chưa có topic nào trong hệ thống!
                      </td>
                    </tr>
                  ) : (
                    topics
                      .filter(t => t.title?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((topic) => (
                        <tr key={topic.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                          <td className="py-4 px-6 text-slate-400 font-bold">#{topic.id}</td>
                          <td className="py-4 px-6 font-bold text-[#23211D]">{topic.title}</td>
                          <td className="py-4 px-6 text-slate-600 truncate max-w-sm">{topic.description || "---"}</td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[#F7F3EC] text-[#1B2A4A] font-bold border border-[#E7E1D4]">
                              {topic.orderIndex ?? topic.order_index ?? 1}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleOpenEditModal(topic)} className="p-2 hover:bg-[#F7F3EC] text-slate-400 hover:text-[#1B2A4A] rounded-lg transition-colors border border-transparent hover:border-[#E7E1D4]">
                                <Edit3 size={18} />
                              </button>
                              <button onClick={() => setDeletingTopic(topic)} className="p-2 hover:bg-[#FBEAEA] text-slate-400 hover:text-[#8A2E24] rounded-lg transition-colors border border-transparent hover:border-[#EBC6C2]">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL THÊM / SỬA TOPIC */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#1B2A4A]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl border border-[#E7E1D4] overflow-hidden">
              <div className="bg-[#1B2A4A] px-8 py-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                  <Layers size={20} /> {editingId ? `Chỉnh sửa Topic #${editingId}` : "Tạo Topic mới"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white font-bold text-xl">✕</button>
              </div>

              <div className="p-8 font-body max-h-[85vh] overflow-y-auto">
                {message && (
                  <div className={`mb-6 px-5 py-4 border rounded-lg text-sm font-medium ${isError ? "bg-[#FBEAEA] border-[#EBC6C2] text-[#8A2E24]" : "bg-[#EFF6EE] border-[#CFE3CC] text-[#2E5C33]"}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Tiêu đề Topic</label>
                    <input
                      type="text"
                      required
                      className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]"
                      placeholder="Ví dụ: Chào hỏi cơ bản"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Mô tả</label>
                    <textarea
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A] min-h-[100px] resize-y"
                      placeholder="Mô tả nội dung chủ đề..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Thứ tự hiển thị (Order Index)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]"
                      value={formData.orderIndex}
                      onChange={(e) => setFormData({ ...formData, orderIndex: e.target.value === '' ? '' : Number(e.target.value) })}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 h-12 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-8 h-12 rounded-lg font-semibold text-white shadow-sm transition-all duration-200 ${
                        loading ? "bg-[#1B2A4A]/50 cursor-not-allowed" : "bg-[#1B2A4A] hover:bg-[#12203B] hover:shadow-md"
                      }`}
                    >
                      {loading ? "Đang xử lý..." : (editingId ? "Cập nhật Topic" : "Tạo Topic")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL XÁC NHẬN XÓA */}
        {deletingTopic && (
          <div className="fixed inset-0 bg-[#1B2A4A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl font-body space-y-4">
              <h3 className="text-lg font-bold text-[#23211D]">Xác nhận xóa topic</h3>
              <p className="text-sm text-slate-600">
                Bạn có chắc chắn muốn xóa chủ đề <span className="font-bold text-[#B23B3B]">#{deletingTopic.id}</span>: "<span className="italic">{deletingTopic.title}</span>"?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setDeletingTopic(null)} className="px-4 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-sm">
                  Hủy bỏ
                </button>
                <button onClick={handleDeleteConfirm} disabled={isDeleting} className="px-4 py-2 rounded-lg bg-[#8A2E24] hover:bg-[#6e231b] font-semibold text-white transition-colors text-sm flex items-center gap-2">
                  {isDeleting && <Loader2 size={14} className="animate-spin" />}
                  Xóa vĩnh viễn
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Topic;