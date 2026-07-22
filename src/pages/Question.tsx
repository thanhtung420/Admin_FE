import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, FileText, Volume2, HelpCircle, CheckCircle2 } from 'lucide-react';

export const Question = () => {
  // Dữ liệu giả lập khớp 100% với DB của bạn
  const [questions, setQuestions] = useState([
    {
      id: 1,
      section_id: 101, // ID của bài tập / đề thi
      passage_text: null,
      audio_url: null,
      question_text: "Kanji của từ 'Gakusei' là gì?",
      options_json: '{"A": "学生", "B": "先生", "C": "学校", "D": "会社"}',
      correct_option_key: "A",
      points: 5,
    },
    {
      id: 2,
      section_id: 102,
      passage_text: "私は毎朝6時に起きます。それからコーヒーを飲みます...",
      audio_url: null,
      question_text: "Người này uống gì vào buổi sáng?",
      options_json: '{"A": "Trà", "B": "Cà phê", "C": "Sữa", "D": "Nước hoa quả"}',
      correct_option_key: "B",
      points: 10,
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State khớp với các cột trong Database
  const [formData, setFormData] = useState({
    section_id: 1, // Mặc định chọn 1 section nào đó
    question_text: '',
    passage_text: '',
    audio_url: '',
    correct_option_key: 'A',
    points: 10
  });

  // State riêng rẽ để Admin nhập 4 đáp án cho dễ, lúc submit sẽ gom lại thành chuỗi JSON
  const [options, setOptions] = useState({
    A: '', B: '', C: '', D: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Đóng gói dữ liệu chuẩn bị gửi xuống Backend
    const payload = {
      ...formData,
      // Biến object options thành chuỗi JSON chuẩn để lưu vào cột options_json
      options_json: JSON.stringify(options),
      // Nếu không nhập đoạn văn hoặc audio thì cho bằng null
      passage_text: formData.passage_text || null,
      audio_url: formData.audio_url || null,
    };

    console.log('Payload gửi lên Backend:', payload);
    alert('Đã lưu câu hỏi thành công! (Kiểm tra Console để xem Payload JSON)');
    setIsModalOpen(false);
  };

  // Hàm parse JSON an toàn để hiển thị trên bảng
  const getParsedOptions = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return { A: 'Lỗi', B: 'Lỗi', C: 'Lỗi', D: 'Lỗi' };
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Ngân hàng Câu hỏi</h1>
          <p className="text-slate-500 mt-1">Quản lý câu hỏi Đọc hiểu, Nghe hiểu và Trắc nghiệm.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 active:scale-95"
        >
          <Plus size={20} /> Thêm câu hỏi
        </button>
      </header>

      {/* Bảng danh sách câu hỏi */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 w-16">ID</th>
                <th className="py-4 px-6">Nội dung câu hỏi</th>
                <th className="py-4 px-6">Dạng bài</th>
                <th className="py-4 px-6 text-center">Điểm</th>
                <th className="py-4 px-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {questions.map((q) => {
                const parsedOpts = getParsedOptions(q.options_json);
                return (
                  <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-slate-400 font-bold">#{q.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800 mb-1">{q.question_text}</div>
                      <div className="text-xs text-slate-500 flex gap-3">
                        <span className={q.correct_option_key === 'A' ? 'text-emerald-600 font-bold' : ''}>A: {parsedOpts.A}</span>
                        <span className={q.correct_option_key === 'B' ? 'text-emerald-600 font-bold' : ''}>B: {parsedOpts.B}</span>
                        <span className={q.correct_option_key === 'C' ? 'text-emerald-600 font-bold' : ''}>C: {parsedOpts.C}</span>
                        <span className={q.correct_option_key === 'D' ? 'text-emerald-600 font-bold' : ''}>D: {parsedOpts.D}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {q.passage_text && <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg" title="Có đoạn văn đọc hiểu"><FileText size={16}/></span>}
                        {q.audio_url && <span className="p-1.5 bg-pink-50 text-pink-600 rounded-lg" title="Có file nghe"><Volume2 size={16}/></span>}
                        {!q.passage_text && !q.audio_url && <span className="p-1.5 bg-slate-100 text-slate-600 rounded-lg" title="Trắc nghiệm thường"><HelpCircle size={16}/></span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-violet-600">{q.points}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-violet-600 rounded-xl transition-colors"><Edit3 size={18} /></button>
                        <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM CÂU HỎI (Thiết kế to hơn vì form này phức tạp) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <HelpCircle className="text-violet-600" /> Thêm câu hỏi mới
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
              {/* CỘT TRÁI: Nội dung câu hỏi, Audio, Đoạn văn */}
              <div className="flex-1 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Đoạn văn Đọc hiểu (Tùy chọn)</label>
                  <textarea 
                    rows={4}
                    placeholder="Nhập đoạn văn dài cho dạng bài Dokkai..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-violet-500 resize-none"
                    onChange={(e) => setFormData({...formData, passage_text: e.target.value})}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">File Nghe (Tùy chọn)</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <Volume2 size={18} className="text-slate-400 mr-3" />
                    <input 
                      type="text" 
                      placeholder="Dán link audio_url vào đây..." 
                      className="bg-transparent w-full text-sm outline-none"
                      onChange={(e) => setFormData({...formData, audio_url: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nội dung câu hỏi (*)</label>
                  <textarea 
                    required
                    rows={2}
                    placeholder="VD: Người đàn ông sẽ đi đâu tiếp theo?" 
                    className="w-full bg-white border-2 border-violet-100 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-violet-500 resize-none"
                    onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                  ></textarea>
                </div>
              </div>

              {/* CỘT PHẢI: Trắc nghiệm (JSON) & Thiết lập */}
              <div className="w-full lg:w-80 space-y-5 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2">Đáp án (Tự động chuyển thành JSON)</h3>
                
                {['A', 'B', 'C', 'D'].map((key) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="font-black text-slate-400 w-4">{key}</span>
                    <input 
                      type="text" 
                      required
                      placeholder={`Nhập đáp án ${key}`}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-violet-500"
                      onChange={(e) => setOptions({...options, [key]: e.target.value})}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2 mt-4 flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-emerald-500"/> Đáp án đúng (Key)
                  </label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none text-emerald-600 focus:ring-2 ring-emerald-500"
                    onChange={(e) => setFormData({...formData, correct_option_key: e.target.value})}
                  >
                    <option value="A">Đáp án A</option>
                    <option value="B">Đáp án B</option>
                    <option value="C">Đáp án C</option>
                    <option value="D">Đáp án D</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Điểm số</label>
                    <input 
                      type="number" required min="1" defaultValue="10"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                      onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Thuộc Section</label>
                    <input 
                      type="number" required defaultValue="1"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                      onChange={(e) => setFormData({...formData, section_id: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200">
                  <button type="submit" className="w-full py-3 rounded-xl font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-sm">
                    Lưu câu hỏi
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;