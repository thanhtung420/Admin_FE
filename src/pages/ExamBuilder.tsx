import { useState } from 'react';
import { ArrowLeft, Search, Plus, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

export const ExamBuilder = () => {
  // Giả lập dữ liệu: Đang xem chi tiết đề thi ID = 1
  const exam = {
    title: 'Đề thi thử JLPT N4 - Tháng 7/2026',
    sections: [
      { id: 101, name: 'Từ vựng & Chữ Hán', limit: '30p', questionCount: 15 },
      { id: 102, name: 'Ngữ pháp & Đọc hiểu', limit: '40p', questionCount: 0 },
      { id: 103, name: 'Nghe hiểu', limit: '35p', questionCount: 0 },
    ]
  };

  const [activeSection, setActiveSection] = useState(exam.sections[0]);

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-900 flex flex-col h-screen overflow-hidden">
      
      {/* Header điều hướng */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">Thiết kế Đề thi</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">{exam.title}</h1>
          </div>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm">
          Xuất bản Đề thi
        </button>
      </header>

      {/* Giao diện Builder chia 2 cột */}
      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* Cột trái: Danh sách các Phần thi (Sections) */}
        <div className="w-80 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col shrink-0 overflow-y-auto">
          <h3 className="font-bold text-slate-800 mb-4 px-2">Cấu trúc đề thi</h3>
          <div className="space-y-2">
            {exam.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  activeSection.id === section.id 
                  ? 'bg-violet-50 border-violet-200 text-violet-700' 
                  : 'bg-transparent border-transparent hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="font-bold text-sm mb-1">{section.name}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className={activeSection.id === section.id ? 'text-violet-500' : 'text-slate-400'}>
                    ID: #{section.id} • {section.limit}
                  </span>
                  <span className="font-bold bg-white/50 px-2 py-0.5 rounded-md">
                    {section.questionCount} câu
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cột phải: Danh sách Câu hỏi (Đề thi thật) của Section đang chọn */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden">
          
          {/* Header của cột phải */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="font-bold text-lg text-slate-800">{activeSection.name}</h2>
              <p className="text-sm text-slate-500">Kéo thả để sắp xếp, hoặc bốc câu hỏi từ Ngân hàng vào đây.</p>
            </div>
            <button className="bg-violet-100 hover:bg-violet-200 text-violet-700 font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
              <Plus size={18} /> Bốc câu hỏi từ Ngân hàng
            </button>
          </div>

          {/* Nội dung câu hỏi thật */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
            {activeSection.questionCount === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <FileText size={48} className="mb-4 text-slate-200" />
                <p className="font-bold">Chưa có câu hỏi nào trong phần này.</p>
                <p className="text-sm mt-1">Hãy bấm nút "Bốc câu hỏi" ở góc trên bên phải.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Giả lập 1 câu hỏi đã được thêm vào */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-violet-300 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-sm text-violet-600 bg-violet-50 px-3 py-1 rounded-lg">Câu 1</span>
                    <button className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">Xóa khỏi đề</button>
                  </div>
                  <p className="font-bold text-slate-800 text-base mb-4">Kanji của từ 'Gakusei' là gì?</p>
                  <div className="grid grid-cols-2 gap-3 text-sm font-medium">
                    <div className="flex items-center gap-2 p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-700">
                      <CheckCircle2 size={16} /> A: 学生
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
                      <div className="w-4 text-center font-bold text-slate-400">B</div> 先生
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExamBuilder;