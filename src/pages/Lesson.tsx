import React, { useState } from 'react';
import { BookOpen, Plus, Search, Edit3, Trash2, ListOrdered } from 'lucide-react';

export const Lesson = () => {
  // Dữ liệu giả lập khớp 100% với cấu trúc DB (lessons table)
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Bài 1: Chào hỏi và giới thiệu',
      jlpt_level: 'N5',
      order_index: 1,
    },
    {
      id: 2,
      title: 'Bài 2: Đồ vật quanh ta',
      jlpt_level: 'N5',
      order_index: 2,
    },
    {
      id: 3,
      title: 'Bài 26: Thể thông thường',
      jlpt_level: 'N4',
      order_index: 1,
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  // Form state khớp với tên cột trong Database
  const [formData, setFormData] = useState({
    title: '',
    jlpt_level: 'N5',
    order_index: 1
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Payload sẵn sàng để gọi API bắn xuống Backend
    console.log('Payload gửi lên API:', formData);
    alert('Thêm bài học thành công!');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Header trang */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Quản lý Danh mục Bài học</h1>
          <p className="text-slate-500 mt-1">Quản lý tên bài học, cấp độ và thứ tự hiển thị trên App.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <Plus size={20} /> Thêm bài học
        </button>
      </header>

      {/* Bộ lọc và Tìm kiếm */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-full md:w-96">
          <Search size={18} className="text-slate-400 mr-3" />
          <input 
            type="text" 
            placeholder="Tìm tên bài học..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent w-full text-sm font-semibold outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 ring-violet-500 cursor-pointer"
          >
            <option value="ALL">Tất cả cấp độ (JLPT)</option>
            <option value="N5">N5</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
            <option value="N2">N2</option>
            <option value="N1">N1</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách bài học */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 w-16">ID</th>
                <th className="py-4 px-6">Tên bài học (Title)</th>
                <th className="py-4 px-6">Cấp độ (JLPT)</th>
                <th className="py-4 px-6 text-center">Thứ tự (Order)</th>
                <th className="py-4 px-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-slate-400 font-bold">#{lesson.id}</td>
                  <td className="py-4 px-6 font-bold text-slate-800">{lesson.title}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-black">
                      {lesson.jlpt_level}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold">
                      {lesson.order_index}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-violet-600 rounded-xl transition-colors">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM/SỬA BÀI HỌC */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <BookOpen className="text-violet-600" /> Thêm bài học mới
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tên bài học */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Tên bài học (Title)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: Bài 1: Chào hỏi..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 ring-violet-500"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Cấp độ JLPT */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cấp độ</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 ring-violet-500 cursor-pointer"
                    onChange={(e) => setFormData({...formData, jlpt_level: e.target.value})}
                    value={formData.jlpt_level}
                  >
                    <option value="N5">N5</option>
                    <option value="N4">N4</option>
                    <option value="N3">N3</option>
                    <option value="N2">N2</option>
                    <option value="N1">N1</option>
                  </select>
                </div>
                
                {/* Order Index */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                    Thứ tự <ListOrdered size={14}/>
                  </label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    placeholder="VD: 1" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 ring-violet-500"
                    onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 1})}
                    value={formData.order_index}
                  />
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-all"
                >
                  Lưu dữ liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lesson;