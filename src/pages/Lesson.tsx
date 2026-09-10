import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Edit3, Trash2, Settings2, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

// 1. Định nghĩa khuôn mẫu cho configJson để Typescript không báo lỗi
interface ConfigJson {
  hideFurigana: boolean;
  timeLimitSeconds: number | null;
  entryCostEnergy: number | string;
  heartsLimit?: number | string;
  starThresholds?: {
    threeStars: number;
    twoStars: number;
    oneStar: number;
  };
}

// 2. Định nghĩa khuôn mẫu cho toàn bộ Form
interface LessonFormData {
  topicId: number | string; // Cho phép string để xử lý ô trống (không bị dính số 0)
  title: string;
  lessonType: string;
  jlptLevel: string;
  orderIndex: number | string; // Cho phép string để xử lý ô trống
  configJson: ConfigJson;
}

export const Lesson = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // State hỗ trợ Sửa / Xóa
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 3. Gắn Type cho State
  const [formData, setFormData] = useState<LessonFormData>({
    topicId: 1,
    title: '',
    lessonType: 'NORMAL',
    jlptLevel: 'N5',
    orderIndex: 1,
    configJson: {
      hideFurigana: false,
      timeLimitSeconds: null,
      entryCostEnergy: 1
    }
  });

  const fetchLessons = async () => {
    setIsFetching(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      setIsFetching(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/lessons`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setLessons(data);
        } else if (data && Array.isArray(data.data)) {
          setLessons(data.data);
        } else if (data && Array.isArray(data.content)) {
          setLessons(data.content);
        } else if (data && Array.isArray(data.result)) {
          setLessons(data.result);
        } else {
          setLessons([]); 
        }
      } else {
        console.error("Lỗi khi tải danh sách bài học");
      }
    } catch (error) {
      console.error("Không thể kết nối đến server");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // Mở modal tạo mới (Reset form)
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      topicId: 1,
      title: '',
      lessonType: 'NORMAL',
      jlptLevel: 'N5',
      orderIndex: 1,
      configJson: { hideFurigana: false, timeLimitSeconds: null, entryCostEnergy: 1 }
    });
    setMessage("");
    setIsError(false);
    setIsModalOpen(true);
  };

  // Mở modal để Sửa (Đổ dữ liệu)
  const handleOpenEditModal = (lesson: any) => {
    setEditingId(lesson.id);
    
    // Parse configJson nếu từ Backend trả về dạng chuỗi (Phòng hờ)
    let parsedConfig = { hideFurigana: false, timeLimitSeconds: null, entryCostEnergy: 1 };
    if (lesson.configJson) {
      parsedConfig = typeof lesson.configJson === 'string' ? JSON.parse(lesson.configJson) : lesson.configJson;
    } else if (lesson.config_json) {
      parsedConfig = typeof lesson.config_json === 'string' ? JSON.parse(lesson.config_json) : lesson.config_json;
    }

    setFormData({
      topicId: lesson.topicId || lesson.topic_id || 1,
      title: lesson.title || '',
      lessonType: lesson.lessonType || lesson.lesson_type || 'NORMAL',
      jlptLevel: lesson.jlptLevel || lesson.jlpt_level || 'N5',
      orderIndex: lesson.orderIndex ?? lesson.order_index ?? 1,
      configJson: parsedConfig
    });
    setMessage("");
    setIsError(false);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage("");
  };

  // Xử lý Xóa Lesson
  const handleDeleteConfirm = async () => {
    if (!deletingLesson) return;
    setIsDeleting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/lessons/${deletingLesson.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok || response.status === 204) {
        setDeletingLesson(null);
        await fetchLessons();
      } else {
        const err = await response.text();
        alert(`Xóa thất bại: ${err}`);
      }
    } catch (error) {
      alert("Lỗi kết nối khi xóa bài học!");
    } finally {
      setIsDeleting(false);
    }
  };

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

    // Đảm bảo dữ liệu gửi đi là số thực sự, phòng ngừa string rỗng
    const payload = {
      ...formData,
      topicId: Number(formData.topicId) || 1,
      orderIndex: Number(formData.orderIndex) || 1,
      jlpt_level: formData.jlptLevel,
      configJson: {
        ...formData.configJson,
        entryCostEnergy: Number(formData.configJson.entryCostEnergy) || 0,
        heartsLimit: formData.configJson.heartsLimit ? Number(formData.configJson.heartsLimit) : undefined
      }
    };

    const url = editingId 
        ? `${API_BASE_URL}/api/admin/lessons/${editingId}`
        : `${API_BASE_URL}/api/admin/lessons`;
      
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
        setMessage(editingId ? "Cập nhật bài học thành công!" : "Tạo bài học thành công!");
        setIsError(false);
        setTimeout(() => setIsModalOpen(false), 1000);
        await fetchLessons();
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
          background-image:
            linear-gradient(rgba(27,42,74,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(27,42,74,0.05) 1px, transparent 1px);
          background-size: 44px 44px;
        }
      `}</style>

      <div className="absolute inset-0 genkou-grid pointer-events-none" aria-hidden="true" />
      <div className="absolute -right-16 top-10 font-display text-[250px] leading-none text-[#1B2A4A]/[0.03] select-none pointer-events-none">
        課
      </div>
      <div aria-hidden="true" className="absolute top-0 left-0 w-full h-1.5 bg-[#1B2A4A]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-8 font-body">
        
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="w-10 h-[3px] bg-[#B23B3B] mb-4" />
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#23211D]">Quản lý Bài học (Lesson)</h1>
            <p className="text-slate-500 mt-2 font-medium">Danh sách các bài học thuộc từng Topic.</p>
          </div>
          <button 
            onClick={handleOpenCreateModal}
            className="bg-[#1B2A4A] hover:bg-[#12203B] text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <Plus size={20} /> Tạo Lesson mới
          </button>
        </header>

        <div className="bg-white border border-[#E7E1D4] p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center bg-[#F7F3EC] border border-[#E7E1D4] rounded-lg px-4 py-2.5 w-full md:w-96">
            <Search size={18} className="text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Tìm tên bài học..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent w-full text-sm font-medium outline-none text-[#23211D] placeholder:text-slate-400"
            />
          </div>
        </div>

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
                    <th className="py-4 px-6">Tên bài học</th>
                    <th className="py-4 px-6">Cấp độ (JLPT)</th>
                    <th className="py-4 px-6">Loại bài (Type)</th>
                    <th className="py-4 px-6 text-center">Thứ tự</th>
                    <th className="py-4 px-6 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E1D4] text-sm font-medium">
                  {lessons.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">
                        Chưa có bài học nào. Hãy tạo bài học đầu tiên!
                      </td>
                    </tr>
                  ) : (
                    lessons
                      .filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((lesson) => (
                      <tr key={lesson.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-bold">#{lesson.id}</td>
                        <td className="py-4 px-6 font-bold text-[#23211D]">{lesson.title}</td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-[#FBEAEA] text-[#B23B3B] rounded-md text-xs font-bold border border-[#EBC6C2]">
                            {lesson.jlptLevel || lesson.jlpt_level || 'N5'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-[#EFF6EE] text-[#2E5C33] rounded-md text-xs font-bold border border-[#CFE3CC]">
                            {lesson.lessonType || lesson.lesson_type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[#F7F3EC] text-[#1B2A4A] font-bold border border-[#E7E1D4]">
                            {lesson.orderIndex ?? lesson.order_index ?? '-'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleOpenEditModal(lesson)} className="p-2 hover:bg-[#F7F3EC] text-slate-400 hover:text-[#1B2A4A] rounded-lg transition-colors border border-transparent hover:border-[#E7E1D4]">
                              <Edit3 size={18} />
                            </button>
                            <button onClick={() => setDeletingLesson(lesson)} className="p-2 hover:bg-[#FBEAEA] text-slate-400 hover:text-[#8A2E24] rounded-lg transition-colors border border-transparent hover:border-[#EBC6C2]">
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

        {/* MODAL THÊM / SỬA LESSON */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#1B2A4A]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl border border-[#E7E1D4] overflow-hidden">
              <div className="bg-[#1B2A4A] px-8 py-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                  <BookOpen size={20} /> {editingId ? `Chỉnh sửa Bài học #${editingId}` : "Tạo Bài học mới"}
                </h2>
                <button onClick={handleCloseModal} className="text-white/70 hover:text-white font-bold text-xl">✕</button>
              </div>

              <div className="p-8 font-body max-h-[85vh] overflow-y-auto">
                {message && (
                  <div className={`mb-6 px-5 py-4 border rounded-lg text-sm font-medium ${isError ? "bg-[#FBEAEA] border-[#EBC6C2] text-[#8A2E24]" : "bg-[#EFF6EE] border-[#CFE3CC] text-[#2E5C33]"}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Thuộc Topic ID</label>
                      <input 
                        type="number" required min="1"
                        className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]"
                        value={formData.topicId}
                        onChange={(e) => setFormData({...formData, topicId: e.target.value === '' ? '' : Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Loại bài học</label>
                      <select 
                        className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A] cursor-pointer"
                        value={formData.lessonType}
                        onChange={(e) => {
                          const type = e.target.value;
                          // 4. Gắn Type cho biến này
                          let newConfig: ConfigJson = { hideFurigana: false, timeLimitSeconds: null, entryCostEnergy: 1 };
                          let newOrderIndex = formData.orderIndex;

                          if (type === 'JUMP_TEST') {
                            newOrderIndex = 0; 
                            newConfig = { hideFurigana: true, timeLimitSeconds: null, entryCostEnergy: 0, heartsLimit: 3 };
                          } else if (type === 'TIMED_REVIEW') {
                            newConfig = { ...newConfig, timeLimitSeconds: 120, starThresholds: { threeStars: 100, twoStars: 70, oneStar: 50 } };
                          }

                          setFormData({...formData, lessonType: type, orderIndex: newOrderIndex, configJson: newConfig});
                        }}
                      >
                        <option value="NORMAL">NORMAL (Học bình thường)</option>
                        <option value="TIMED_REVIEW">TIMED_REVIEW</option>
                        <option value="JUMP_TEST">JUMP_TEST</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Cấp độ JLPT</label>
                      <select 
                        className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A] cursor-pointer"
                        value={formData.jlptLevel}
                        onChange={(e) => setFormData({...formData, jlptLevel: e.target.value})}
                      >
                        <option value="N5">N5</option>
                        <option value="N4">N4</option>
                        <option value="N3">N3</option>
                        <option value="N2">N2</option>
                        <option value="N1">N1</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Tiêu đề bài học</label>
                    <input 
                      type="text" required
                      placeholder="Ví dụ: Bài 1: Chào hỏi cơ bản" 
                      className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="bg-[#F7F3EC] p-5 rounded-xl border border-[#E7E1D4] space-y-4">
                    <h3 className="text-sm font-bold text-[#1B2A4A] flex items-center gap-2 border-b border-[#E7E1D4] pb-2">
                      <Settings2 size={16} /> Cấu hình nâng cao (configJson)
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      {formData.lessonType !== 'JUMP_TEST' ? (
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Vị trí Map (Order Index)</label>
                          <input 
                            type="number" required min="1"
                            className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]"
                            value={formData.orderIndex}
                            onChange={(e) => setFormData({...formData, orderIndex: e.target.value === '' ? '' : Number(e.target.value)})}
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Vị trí Map</label>
                          <input 
                            type="text" disabled value="Nằm trên Header (Không có Order)"
                            className="w-full h-12 bg-slate-100 border border-slate-200 rounded-lg px-4 text-base text-slate-500 cursor-not-allowed"
                          />
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Năng lượng yêu cầu (entryCostEnergy)</label>
                        <input 
                          type="number" required min="0"
                          className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]"
                          value={formData.configJson.entryCostEnergy}
                          onChange={(e) => setFormData({
                            ...formData, 
                            configJson: { ...formData.configJson, entryCostEnergy: e.target.value === '' ? '' : Number(e.target.value) }
                          })}
                        />
                      </div>

                      {formData.lessonType === 'TIMED_REVIEW' && (
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Thời gian (Giây)</label>
                          <input 
                            type="number" required min="10"
                            className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]"
                            value={formData.configJson.timeLimitSeconds || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              configJson: { ...formData.configJson, timeLimitSeconds: Number(e.target.value) }
                            })}
                          />
                        </div>
                      )}

                      {formData.lessonType === 'JUMP_TEST' && (
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Giới hạn mạng (Hearts)</label>
                          <input 
                            type="number" required min="1"
                            className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]"
                            value={formData.configJson.heartsLimit || 3}
                            onChange={(e) => setFormData({
                              ...formData, 
                              configJson: { ...formData.configJson, heartsLimit: e.target.value === '' ? '' : Number(e.target.value) }
                            })}
                          />
                        </div>
                      )}
                    </div>

                    <label className={`flex items-center gap-3 w-max mt-2 ${formData.lessonType === 'JUMP_TEST' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                      <input 
                        type="checkbox" 
                        disabled={formData.lessonType === 'JUMP_TEST'}
                        className="w-5 h-5 rounded border-slate-300 text-[#1B2A4A] focus:ring-[#1B2A4A]"
                        checked={formData.configJson.hideFurigana}
                        onChange={(e) => setFormData({
                          ...formData, 
                          configJson: { ...formData.configJson, hideFurigana: e.target.checked }
                        })}
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        Ẩn Furigana {formData.lessonType === 'JUMP_TEST' && "(Bắt buộc với Học Vượt)"}
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={handleCloseModal}
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
                      {loading ? "Đang xử lý..." : (editingId ? "Cập nhật Bài học" : "Tạo Bài Học")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL XÁC NHẬN XÓA */}
        {deletingLesson && (
          <div className="fixed inset-0 bg-[#1B2A4A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl font-body space-y-4">
              <h3 className="text-lg font-bold text-[#23211D]">Xác nhận xóa bài học</h3>
              <p className="text-sm text-slate-600">
                Bạn có chắc chắn muốn xóa bài học <span className="font-bold text-[#B23B3B]">#{deletingLesson.id}</span>: "<span className="italic">{deletingLesson.title}</span>"? 
                <br/><span className="text-red-500 font-semibold text-xs mt-1 block">Lưu ý: Hành động này có thể xóa cả các câu hỏi thuộc bài học này!</span>
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setDeletingLesson(null)} className="px-4 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-sm">
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

export default Lesson;