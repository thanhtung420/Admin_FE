import React, { useState } from 'react';
import { Search, FileText, CheckCircle2, XCircle, Award, Calendar, User as UserIcon } from 'lucide-react';

export const ExamResults = () => {
  // Dữ liệu giả lập danh sách kết quả thi (Khớp với bảng exam_results & user)
  const results = [
    {
      id: 1,
      exam_title: 'Đề thi thử JLPT N4 - Tháng 7/2026',
      student_name: ' Hoàng',
      student_email: 'hoangvd@example.com',
      total_score: 80,
      max_score: 100,
      submitted_at: '22/07/2026 14:30',
      answers: [
        { text: "Kanji của từ 'Gakusei' là gì?", user_choice: "A. 学生", correct_choice: "A. 学生", is_correct: true },
        { text: "Người đàn ông sẽ đi đâu tiếp theo?", user_choice: "C. Siêu thị", correct_choice: "B. Bưu điện", is_correct: false },
      ]
    },
    {
      id: 2,
      exam_title: 'Mini Test N5 - Bài 1 đến Bài 10',
      student_name: 'Tung',
      student_email: 'nghialh.study@example.com',
      total_score: 100,
      max_score: 100,
      submitted_at: '20/07/2026 09:15',
      answers: [
        { text: "Nghĩa của từ 'Sensei'?", user_choice: "A. Giáo viên", correct_choice: "A. Giáo viên", is_correct: true },
      ]
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResult, setSelectedResult] = useState<any>(null);

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Kết quả & Lịch sử thi</h1>
          <p className="text-slate-500 mt-1">Danh sách thí sinh đã tham gia và bảng điểm chi tiết từng bài thi.</p>
        </div>
      </header>

      {/* Tìm kiếm */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center w-full md:w-[400px]">
        <Search size={18} className="text-slate-400 mr-3" />
        <input 
          type="text" 
          placeholder="Tìm theo tên thí sinh hoặc tên đề thi..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent w-full text-sm font-semibold outline-none text-slate-700"
        />
      </div>

      {/* Bảng danh sách kết quả thi của thí sinh */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Thí sinh</th>
                <th className="py-4 px-6">Tên đề thi</th>
                <th className="py-4 px-6">Điểm số</th>
                <th className="py-4 px-6">Thời gian nộp</th>
                <th className="py-4 px-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {results.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800">{res.student_name}</div>
                    <div className="text-xs text-slate-400">{res.student_email}</div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-700">{res.exam_title}</td>
                  <td className="py-4 px-6">
                    <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                      {res.total_score} / {res.max_score} điểm
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500 font-medium">{res.submitted_at}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => setSelectedResult(res)}
                      className="px-4 py-2 bg-violet-50 text-violet-600 font-bold text-xs rounded-xl hover:bg-violet-100 transition-colors"
                    >
                      Xem bài làm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xem chi tiết bài làm của thí sinh */}
      {selectedResult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-800">{selectedResult.exam_title}</h2>
                <p className="text-sm font-semibold text-violet-600 mt-0.5">Thí sinh: {selectedResult.student_name}</p>
              </div>
              <button onClick={() => setSelectedResult(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chi tiết đáp án từng câu</h3>
              {selectedResult.answers.map((ans: any, idx: number) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex gap-4">
                  <div className="mt-1">
                    {ans.is_correct ? <CheckCircle2 size={20} className="text-emerald-500"/> : <XCircle size={20} className="text-red-500"/>}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-sm mb-2">Câu {idx + 1}: {ans.text}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="text-slate-400 text-xs block mb-0.5">Thí sinh chọn:</span>
                        <span className={`font-bold ${ans.is_correct ? 'text-emerald-600' : 'text-red-500'}`}>{ans.user_choice}</span>
                      </div>
                      {!ans.is_correct && (
                        <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                          <span className="text-emerald-600 text-xs block mb-0.5">Đáp án đúng:</span>
                          <span className="font-bold text-emerald-700">{ans.correct_choice}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResults;