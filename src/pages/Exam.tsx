import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit3, Trash2, Clock, Layers, PlusCircle, X, FileQuestion, PenTool } from 'lucide-react';

export const Exam = () => {
  const navigate = useNavigate();

  // Dữ liệu giả lập kết hợp giữa bảng `exams` và `exam_sections`
  const [exams, setExams] = useState([
    {
      id: 1,
      title: 'Đề thi thử JLPT N4 - Tháng 7/2026',
      jlpt_level: 'N4',
      total_time_minutes: 105,
      sections: [
        { id: 101, section_name: 'Từ vựng & Chữ Hán', time_limit: 30 },
        { id: 102, section_name: 'Ngữ pháp & Đọc hiểu', time_limit: 40 },
        { id: 103, section_name: 'Nghe hiểu', time_limit: 35 },
      ]
    },
    {
      id: 2,
      title: 'Mini Test N5 - Bài 1 đến Bài 10',
      jlpt_level: 'N5',
      total_time_minutes: 45,
      sections: [
        { id: 104, section_name: 'Trắc nghiệm tổng hợp', time_limit: 45 }
      ]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State cho bảng `exams`
  const [formData, setFormData] = useState({
    title: '',
    jlpt_level: 'N5',
    total_time_minutes: 0,
  });

  // State động để quản lý danh sách `exam_sections`
  const [sections, setSections] = useState([
    { section_name: '', time_limit: 0 }
  ]);

  const handleAddSection = () => {
    setSections([...sections, { section_name: '', time_limit: 0 }]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length === 1) return;
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleSectionChange = (index: number, field: string, value: string | number) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { exam: formData, sections: sections };
    console.log('Payload tạo Đề thi gửi lên Backend:', payload);
    alert('Đã tạo Đề thi và các Phần thi thành công!');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Quản lý Đề thi</h1>
          <p className="text-slate-500 mt-1">Thiết lập cấu trúc đề thi, cấp độ và thời gian làm bài.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <Plus size={20} /> Tạo Đề thi mới
        </button>
      </header>

      {/* Tìm kiếm */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center w-full md:w-96">
        <Search size={18} className="text-slate-400 mr-3" />
        <input 
          type="text" 
          placeholder="Tìm kiếm đề thi..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent w-full text-sm font-semibold outline-none text-slate-700"
        />
      </div>

      {/* Bảng Danh sách Đề thi */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 w-16">ID</th>
                <th className="py-4 px-6">Tên đề thi</th>
                <th className="py-4 px-6">Cấp độ</th>
                <th className="py-4 px-6">Tổng thời gian</th>
                <th className="py-4 px-6">Cấu trúc (Sections)</th>
                <th className="py-4 px-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-slate-400 font-bold">#{exam.id}</td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800">{exam.title}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-black">
                      {exam.jlpt_level}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock size={16} className="text-amber-500"/> 
                      {exam.total_time_minutes} phút
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs mb-1">
                        <Layers size={14} /> {exam.sections.length} phần thi
                      </div>
                      {exam.sections.map(sec => (
                        <div key={sec.id} className="text-[11px] text-slate-400 flex justify-between w-40">
                          <span className="truncate">{sec.section_name}</span>
                          <span>{sec.time_limit}p</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  
                  {/* CỘT HÀNH ĐỘNG - NƠI CHỨA NÚT THIẾT KẾ ĐỀ */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Nút Thiết kế đề thi thật */}
                      <button 
                        onClick={() => navigate('/exam-builder')}
                        title="Thiết kế nội dung đề thi"
                        className="p-2 hover:bg-emerald-50 text-emerald-500 hover:text-emerald-600 rounded-xl transition-colors font-bold flex items-center gap-1 border border-transparent hover:border-emerald-200"
                      >
                        <PenTool size={18} /> <span className="text-xs hidden lg:inline">Thiết kế</span>
                      </button>
                      
                      {/* Nút sửa/xóa cơ bản */}
                      <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-violet-600 rounded-xl transition-colors" title="Sửa thông tin đề">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors" title="Xóa đề">
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

      {/* MODAL TẠO ĐỀ THI & SECTIONS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <FileQuestion className="text-violet-600" /> Tạo Đề thi mới
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* PHẦN 1: THÔNG TIN CHUNG */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs">1</span>
                  Thông tin chung
                </h3>
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Tên Đề thi (Title)</label>
                    <input type="text" required placeholder="VD: Đề thi thử JLPT N4..." 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 ring-violet-500"
                      onChange={(e) => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cấp độ (JLPT Level)</label>
                    <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 ring-violet-500"
                      onChange={(e) => setFormData({...formData, jlpt_level: e.target.value})}>
                      <option value="N5">N5</option>
                      <option value="N4">N4</option>
                      <option value="N3">N3</option>
                      <option value="N2">N2</option>
                      <option value="N1">N1</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Tổng thời gian (Phút)</label>
                    <input type="number" required min="1" placeholder="VD: 105" 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 ring-violet-500"
                      onChange={(e) => setFormData({...formData, total_time_minutes: parseInt(e.target.value)})} />
                  </div>
                </div>
              </div>

              {/* PHẦN 2: CẤU TRÚC PHẦN THI */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">2</span>
                    Cấu trúc các Phần thi (Sections)
                  </h3>
                  <button type="button" onClick={handleAddSection} className="text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                    <PlusCircle size={14}/> Thêm phần thi
                  </button>
                </div>
                
                <div className="space-y-3">
                  {sections.map((section, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative group">
                      <div className="font-black text-slate-300 w-6 text-center">{index + 1}</div>
                      <div className="flex-1">
                        <input type="text" required placeholder="Tên phần thi (VD: Từ vựng)" 
                          value={section.section_name} onChange={(e) => handleSectionChange(index, 'section_name', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-violet-500" />
                      </div>
                      <div className="w-32 relative">
                        <input type="number" required min="1" placeholder="Thời gian" 
                          value={section.time_limit || ''} onChange={(e) => handleSectionChange(index, 'time_limit', parseInt(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:ring-2 ring-violet-500" />
                        <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Phút</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveSection(index)} disabled={sections.length === 1}
                        className={`p-2 rounded-lg transition-colors ${sections.length === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-red-50 hover:text-red-500'}`}>
                        <X size={18}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Hủy bỏ</button>
                <button type="submit" className="px-8 py-2.5 rounded-xl font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-all">Tạo cấu trúc Đề thi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;