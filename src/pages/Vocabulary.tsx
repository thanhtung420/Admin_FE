import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Volume2, Filter, Type, BookA } from 'lucide-react';

export const Vocabulary = () => {
  // Dữ liệu giả lập danh sách từ vựng
  const [vocabularies, setVocabularies] = useState([
    {
      id: 1,
      kanji: '学生',
      kana: 'がくせい',
      romaji: 'gakusei',
      meaning: 'Học sinh, sinh viên',
      jlptLevel: 'N5',
      lesson: 'Bài 1',
      hasAudio: true,
      example: '私は学生です。(Tôi là học sinh)'
    },
    {
      id: 2,
      kanji: '勉強',
      kana: 'べんきょう',
      romaji: 'benkyou',
      meaning: 'Học tập, việc học',
      jlptLevel: 'N5',
      lesson: 'Bài 3',
      hasAudio: true,
      example: '毎日日本語を勉強します。(Mỗi ngày tôi đều học tiếng Nhật)'
    },
    {
      id: 3,
      kanji: '残業',
      kana: 'ざんぎょう',
      romaji: 'zangyou',
      meaning: 'Làm thêm giờ',
      jlptLevel: 'N3',
      lesson: 'Bài 15',
      hasAudio: false,
      example: '今日は残業があります。(Hôm nay có làm thêm giờ)'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  // State cho Form
  const [formData, setFormData] = useState({
    kanji: '',
    kana: '',
    meaning: '',
    jlptLevel: 'N5',
    lesson: '',
    example: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dữ liệu từ vựng gửi đi:', formData);
    alert('Đã lưu từ vựng thành công!');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Kho Từ Vựng</h1>
          <p className="text-slate-500 mt-1">Quản lý Hán tự, cách đọc, ý nghĩa và file phát âm.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <Plus size={20} /> Thêm từ vựng
        </button>
      </header>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-full md:w-[450px] focus-within:ring-2 ring-violet-200 transition-all">
          <Search size={18} className="text-slate-400 mr-3 shrink-0" />
          <input 
            type="text" 
            placeholder="Tìm theo Kanji, Kana hoặc Nghĩa tiếng Việt..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent w-full text-sm font-semibold outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm font-semibold">
            <Filter size={16} />
            <select 
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-slate-700"
            >
              <option value="ALL">Mọi cấp độ (JLPT)</option>
              <option value="N5">N5 - Cơ bản</option>
              <option value="N4">N4 - Sơ cấp</option>
              <option value="N3">N3 - Trung cấp</option>
              <option value="N2">N2 - Cao cấp</option>
              <option value="N1">N1 - Chuyên gia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu Từ vựng */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 w-16">Audio</th>
                <th className="py-4 px-6">Từ vựng (Kanji / Kana)</th>
                <th className="py-4 px-6">Ý nghĩa</th>
                <th className="py-4 px-6">Cấp độ</th>
                <th className="py-4 px-6">Thuộc bài</th>
                <th className="py-4 px-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vocabularies.map((vocab) => (
                <tr key={vocab.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <button 
                      className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
                        vocab.hasAudio 
                          ? 'bg-violet-100 text-violet-600 hover:bg-violet-200 hover:scale-110' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      }`}
                      title={vocab.hasAudio ? 'Nghe phát âm' : 'Chưa có file Audio'}
                    >
                      <Volume2 size={18} />
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      {/* Hiển thị Kanji to rõ ràng */}
                      <span className="text-xl font-black text-slate-800">{vocab.kanji}</span>
                      {/* Hiển thị Hiragana nhỏ hơn ở dưới */}
                      <span className="text-sm font-medium text-slate-500">{vocab.kana}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-bold text-slate-700">{vocab.meaning}</div>
                    <div className="text-xs font-medium text-slate-400 mt-1 truncate max-w-[200px]" title={vocab.example}>
                      VD: {vocab.example}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black border border-emerald-100">
                      {vocab.jlptLevel}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      {vocab.lesson}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white border border-slate-200 hover:border-violet-300 text-slate-500 hover:text-violet-600 rounded-xl transition-all shadow-sm">
                        <Edit3 size={16} />
                      </button>
                      <button className="p-2 bg-white border border-slate-200 hover:border-red-300 text-slate-500 hover:text-red-600 rounded-xl transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Từ Vựng */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-violet-100 text-violet-600 rounded-xl"><BookA size={24} /></div>
                Thêm từ vựng mới
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Kanji */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Hán tự (Kanji)</label>
                  <div className="relative">
                    <Type size={16} className="absolute left-4 top-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="VD: 学生" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-lg font-bold outline-none focus:ring-2 ring-violet-500"
                      onChange={(e) => setFormData({...formData, kanji: e.target.value})}
                    />
                  </div>
                </div>

                {/* Kana */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cách đọc (Hiragana/Katakana)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="VD: がくせい" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-medium outline-none focus:ring-2 ring-violet-500"
                    onChange={(e) => setFormData({...formData, kana: e.target.value})}
                  />
                </div>
              </div>

              {/* Nghĩa tiếng Việt */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nghĩa tiếng Việt</label>
                <input 
                  type="text" 
                  required
                  placeholder="VD: Học sinh, sinh viên..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 ring-violet-500"
                  onChange={(e) => setFormData({...formData, meaning: e.target.value})}
                />
              </div>

              {/* Phân loại (JLPT & Bài học) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cấp độ JLPT</label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 ring-violet-500 cursor-pointer"
                    onChange={(e) => setFormData({...formData, jlptLevel: e.target.value})}
                  >
                    <option value="N5">N5</option>
                    <option value="N4">N4</option>
                    <option value="N3">N3</option>
                    <option value="N2">N2</option>
                    <option value="N1">N1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Thuộc Bài / Unit</label>
                  <input 
                    type="text" 
                    placeholder="VD: Bài 1" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 ring-violet-500"
                    onChange={(e) => setFormData({...formData, lesson: e.target.value})}
                  />
                </div>
              </div>

              {/* Upload Audio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">File phát âm (Tùy chọn)</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-white border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-xl px-6 py-4 flex-1 flex flex-col items-center justify-center transition-colors group">
                    <Volume2 className="text-slate-400 group-hover:text-violet-500 mb-2" size={24} />
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-violet-600">Tải lên file Audio (.mp3)</span>
                    <input type="file" accept="audio/*" className="hidden" />
                  </label>
                </div>
              </div>

              {/* Câu ví dụ */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Câu ví dụ (Kèm nghĩa)</label>
                <textarea 
                  rows={2}
                  placeholder="VD: 私は学生です。 (Tôi là học sinh)" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 ring-violet-500 resize-none"
                  onChange={(e) => setFormData({...formData, example: e.target.value})}
                ></textarea>
              </div>

              {/* Nút hành động */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 rounded-xl font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200 transition-all active:scale-95"
                >
                  Lưu từ vựng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vocabulary;