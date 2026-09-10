import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Search, Edit3, Trash2, Settings2, Loader2, CheckCircle2, Image as ImageIcon, Volume2, PlusCircle, X, Upload } from 'lucide-react';
import * as wanakana from 'wanakana';
import { API_BASE_URL } from '../utils/api';

// --- HÀM XỬ LÝ URL ---
const getFullFileUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const baseUrl = API_BASE_URL;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
};

interface OptionData {
  optionText: string;
  imageUrl: string;
  audioUrl: string;
  isCorrect: boolean;
  orderIndex: string;
  metadataString: string;
}

export const Question = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // State nhận biết đang Tạo mới (null) hay Sửa (chứa ID câu hỏi)
  const [editingId, setEditingId] = useState<number | null>(null);

  // State Modal xác nhận xóa
  const [deletingQuestion, setDeletingQuestion] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State cho Question Root
  const [formData, setFormData] = useState<{
    lessonId: number | string;
    questionType: string;
    questionText: string;
    audioUrl: string;
    imageUrl: string;
    metadataString: string;
  }>({
    lessonId: 1,
    questionType: 'SELECT_IMAGE',
    questionText: '',
    audioUrl: '',
    imageUrl: '',
    metadataString: ''
  });

  // State cho mảng Options động
  const [options, setOptions] = useState<OptionData[]>([
    { optionText: '', imageUrl: '', audioUrl: '', isCorrect: true, orderIndex: '1', metadataString: '' }
  ]);

  const questionTypes = [
    { value: "SELECT_IMAGE", label: "Chọn hình ảnh từ vựng" },
    { value: "TRANSLATE_TO_JP", label: "Dịch sang tiếng Nhật (Ghép block)" },
    { value: "TRANSLATE_TO_VN", label: "Dịch sang tiếng Việt (Ghép block)" },
    { value: "LISTEN_AND_ARRANGE", label: "Nghe và sắp xếp câu" },
    { value: "LISTEN_AND_SELECT", label: "Nghe từ và chọn đáp án đúng" },
    { value: "SPEAKING", label: "Luyện nói (Thu âm)" }
  ];

  const fetchQuestions = async () => {
    setIsFetching(true);
    const token = localStorage.getItem("token");
    if (!token) { setIsFetching(false); return; }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/questions`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(Array.isArray(data) ? data : data.content || data.data || []);
      }
    } catch (error) {
      console.error("Lỗi tải câu hỏi:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // --- HÀM RESET FORM VỀ MẶC ĐỊNH ---
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      lessonId: 1,
      questionType: 'SELECT_IMAGE',
      questionText: '',
      audioUrl: '',
      imageUrl: '',
      metadataString: ''
    });
    setOptions([
      { optionText: '', imageUrl: '', audioUrl: '', isCorrect: true, orderIndex: '1', metadataString: '' }
    ]);
    setMessage("");
    setIsError(false);
    setIsModalOpen(true);
  };

  // --- HÀM MỞ MODAL ĐỂ SỬA CÂU HỎI ---
  const handleOpenEditModal = (q: any) => {
    setEditingId(q.id);
    
    // Parse metadataRoot nếu có
    let metaStr = '';
    if (q.metadataJson) {
      metaStr = typeof q.metadataJson === 'string' ? q.metadataJson : JSON.stringify(q.metadataJson);
    }

    setFormData({
      lessonId: q.lessonId || 1,
      questionType: q.questionType || 'SELECT_IMAGE',
      questionText: q.questionText || '',
      audioUrl: q.audioUrl || '',
      imageUrl: q.imageUrl || '',
      metadataString: metaStr
    });

    // Map mảng options từ API
    if (q.options && Array.isArray(q.options) && q.options.length > 0) {
      const mappedOptions = q.options.map((opt: any, idx: number) => {
        let optMetaStr = '';
        if (opt.metadataJson) {
          optMetaStr = typeof opt.metadataJson === 'string' ? opt.metadataJson : JSON.stringify(opt.metadataJson);
        }
        return {
          optionText: opt.optionText || '',
          imageUrl: opt.imageUrl || '',
          audioUrl: opt.audioUrl || '',
          isCorrect: Boolean(opt.isCorrect),
          orderIndex: opt.orderIndex ? String(opt.orderIndex) : String(idx + 1),
          metadataString: optMetaStr
        };
      });
      setOptions(mappedOptions);
    } else {
      setOptions([{ optionText: '', imageUrl: '', audioUrl: '', isCorrect: true, orderIndex: '1', metadataString: '' }]);
    }

    setMessage("");
    setIsError(false);
    setIsModalOpen(true);
  };

  // --- HÀM XỬ LÝ XÓA CÂU HỎI ---
  const handleDeleteConfirm = async () => {
    if (!deletingQuestion) return;
    setIsDeleting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/questions/${deletingQuestion.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok || response.status === 204) {
        setDeletingQuestion(null);
        await fetchQuestions();
      } else {
        const err = await response.text();
        alert(`Xóa thất bại: ${err}`);
      }
    } catch (error) {
      alert("Lỗi kết nối khi xóa câu hỏi!");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- HÀM UPLOAD FILE ---
  const handleUploadFile = async (file: File, type: 'image' | 'audio') => {
    const token = localStorage.getItem("token");
    if (!token) { alert("Bạn chưa đăng nhập!"); return null; }

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    const endpoint = type === 'image' 
      ? `${API_BASE_URL}/api/v1/uploads/images`
      : `${API_BASE_URL}/api/v1/uploads/audio`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: uploadData,
      });

      if (response.ok) {
        const data = await response.text();
        try {
          const json = JSON.parse(data);
          return json.fileUrl || json.url || data; 
        } catch (e) {
          return data;
        }
      } else {
        alert(`Upload thất bại! (Status: ${response.status})`);
        return null;
      }
    } catch (error) {
      alert("Lỗi kết nối khi upload file!");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // --- HÀM TỰ ĐỘNG SINH ROMAJI CHO CÂU HỎI GỐC ---
  const handleQuestionTextInput = (text: string) => {
    const generatedRomaji = wanakana.toRomaji(text);
    const generatedFurigana = wanakana.toHiragana(text);

    // Bổ sung thêm trường vnMeaning để Admin tự nhập nghĩa tiếng Việt
    const autoMetadata = JSON.stringify({
      romaji: generatedRomaji,
      furigana: generatedFurigana,
      vnMeaning: "" 
    });

    setFormData({
      ...formData,
      questionText: text,
      metadataString: autoMetadata
    });
  };

  // --- CÁC HÀM XỬ LÝ OPTIONS ---
  const handleAddOption = () => {
    setOptions([...options, { optionText: '', imageUrl: '', audioUrl: '', isCorrect: false, orderIndex: String(options.length + 1), metadataString: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    const newOpts = [...options];
    newOpts.splice(index, 1);
    setOptions(newOpts);
  };

  const handleOptionChange = (index: number, field: keyof OptionData, value: any) => {
    const newOpts = [...options];
    newOpts[index] = { ...newOpts[index], [field]: value };
    setOptions(newOpts);
  };

  const handleOptionTextInput = (index: number, text: string) => {
    const newOpts = [...options];
    
    const generatedRomaji = wanakana.toRomaji(text);
    const generatedFurigana = wanakana.toHiragana(text);

    const autoMetadata = JSON.stringify({
      romaji: generatedRomaji,
      furigana: generatedFurigana
    });

    newOpts[index] = { 
      ...newOpts[index], 
      optionText: text,
      metadataString: autoMetadata 
    };
    
    setOptions(newOpts);
  };

  // --- SUBMIT CREATE HOẶC UPDATE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage(""); setIsError(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Lỗi: Bạn chưa đăng nhập!"); setIsError(true); setLoading(false); return;
    }

    try {
      let rootMetadata = null;
      if (formData.metadataString.trim()) {
        try { rootMetadata = JSON.parse(formData.metadataString); } 
        catch (e) { throw new Error("Metadata Câu hỏi không phải là JSON hợp lệ!"); }
      }

      const payloadOptions = options.map((opt, index) => {
        let optMeta = null;
        if (opt.metadataString.trim()) {
          try { optMeta = JSON.parse(opt.metadataString); } 
          catch (e) { throw new Error(`Metadata của Option ${index + 1} không hợp lệ!`); }
        }
        return {
          optionText: opt.optionText,
          imageUrl: opt.imageUrl || null,
          audioUrl: opt.audioUrl || null,
          isCorrect: opt.isCorrect,
          orderIndex: opt.orderIndex ? Number(opt.orderIndex) : index + 1,
          metadataJson: optMeta
        };
      });

      const payload = {
        lessonId: Number(formData.lessonId),
        questionType: formData.questionType,
        questionText: formData.questionText,
        audioUrl: formData.audioUrl || null,
        imageUrl: formData.imageUrl || null,
        metadataJson: rootMetadata,
        options: payloadOptions
      };

      const url = editingId 
        ? `${API_BASE_URL}/api/admin/questions/${editingId}`
        : `${API_BASE_URL}/api/admin/questions`;
      
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage(editingId ? "Cập nhật câu hỏi thành công!" : "Tạo Câu hỏi thành công!");
        setIsError(false);
        setTimeout(() => setIsModalOpen(false), 1000);
        await fetchQuestions();
      } else {
        const errText = await response.text();
        setMessage(`Lỗi hệ thống: ${errText}`);
        setIsError(true);
      }
    } catch (error: any) {
      setMessage(error.message || "Lỗi cấu trúc dữ liệu gửi đi!");
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
        .genkou-grid { background-image: linear-gradient(rgba(27,42,74,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(27,42,74,0.05) 1px, transparent 1px); background-size: 44px 44px; }
      `}</style>

      <div className="absolute inset-0 genkou-grid pointer-events-none" aria-hidden="true" />
      <div className="absolute -right-16 top-10 font-display text-[250px] leading-none text-[#1B2A4A]/[0.03] select-none pointer-events-none">問</div>
      <div aria-hidden="true" className="absolute top-0 left-0 w-full h-1.5 bg-[#1B2A4A]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-8 font-body">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="w-10 h-[3px] bg-[#B23B3B] mb-4" />
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#23211D]">Ngân hàng Câu hỏi</h1>
            <p className="text-slate-500 mt-2 font-medium">Quản lý các dạng bài tập, đọc hiểu, nghe hiểu.</p>
          </div>
          <button onClick={handleOpenCreateModal} className="bg-[#1B2A4A] hover:bg-[#12203B] text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2">
            <Plus size={20} /> Tạo Câu hỏi
          </button>
        </header>

        {/* SEARCH & TABLE */}
        <div className="bg-white border border-[#E7E1D4] p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center bg-[#F7F3EC] border border-[#E7E1D4] rounded-lg px-4 py-2.5 w-full md:w-96">
            <Search size={18} className="text-slate-400 mr-3" />
            <input type="text" placeholder="Tìm nội dung câu hỏi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent w-full text-sm font-medium outline-none text-[#23211D] placeholder:text-slate-400" />
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
                    <th className="py-4 px-6 w-24">Lesson ID</th>
                    <th className="py-4 px-6">Nội dung câu hỏi</th>
                    <th className="py-4 px-6">Loại câu (Type)</th>
                    <th className="py-4 px-6 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E1D4] text-sm font-medium">
                  {questions.length === 0 ? (
                    <tr><td colSpan={5} className="py-12 text-center text-slate-500 font-semibold">Chưa có câu hỏi nào!</td></tr>
                  ) : (
                    questions.filter(q => q.questionText?.toLowerCase().includes(searchTerm.toLowerCase())).map((q) => {
                      const typeObj = questionTypes.find(t => t.value === q.questionType);
                      return (
                        <tr key={q.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                          <td className="py-4 px-6 text-slate-400 font-bold">#{q.id}</td>
                          <td className="py-4 px-6 text-[#B23B3B] font-bold">{q.lessonId}</td>
                          <td className="py-4 px-6 font-bold text-[#23211D] truncate max-w-xs">{q.questionText}</td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-[#EFF6EE] text-[#2E5C33] rounded-md text-xs font-bold border border-[#CFE3CC]">
                              {typeObj ? typeObj.label : q.questionType}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* NÚT SỬA */}
                              <button onClick={() => handleOpenEditModal(q)} title="Chỉnh sửa" className="p-2 hover:bg-[#F7F3EC] text-slate-400 hover:text-[#1B2A4A] rounded-lg transition-colors border border-transparent hover:border-[#E7E1D4]">
                                <Edit3 size={18} />
                              </button>
                              {/* NÚT XÓA */}
                              <button onClick={() => setDeletingQuestion(q)} title="Xóa" className="p-2 hover:bg-[#FBEAEA] text-slate-400 hover:text-[#8A2E24] rounded-lg transition-colors border border-transparent hover:border-[#EBC6C2]">
                                <Trash2 size={18} />
                              </button>
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

        {/* MODAL THÊM / SỬA CÂU HỎI */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#1B2A4A]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] border border-[#E7E1D4] overflow-hidden flex flex-col">
              
              <div className="bg-[#1B2A4A] px-8 py-5 flex items-center justify-between shrink-0">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                  <HelpCircle size={20} /> {editingId ? `Chỉnh sửa Câu hỏi #${editingId}` : "Tạo Câu hỏi mới"}
                </h2>
                <div className="flex items-center gap-4">
                  {isUploading && <span className="text-sm font-bold text-emerald-400 flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Đang tải file lên...</span>}
                  <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white font-bold text-xl">✕</button>
                </div>
              </div>

              <div className="p-8 font-body overflow-y-auto flex-1 bg-slate-50">
                {message && (
                  <div className={`mb-6 px-5 py-4 border rounded-lg text-sm font-medium ${isError ? "bg-[#FBEAEA] border-[#EBC6C2] text-[#8A2E24]" : "bg-[#EFF6EE] border-[#CFE3CC] text-[#2E5C33]"}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8">
                  {/* CỘT TRÁI: ROOT QUESTION DATA */}
                  <div className="flex-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
                      <h3 className="font-bold text-[#1B2A4A] flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Settings2 size={18} /> Cấu hình gốc
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Lesson ID</label>
                          <input 
                            type="number" 
                            required 
                            min="1" 
                            value={formData.lessonId} 
                            onChange={(e) => setFormData({...formData, lessonId: e.target.value === '' ? '' : Number(e.target.value)})} 
                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Loại câu hỏi</label>
                          <select value={formData.questionType} onChange={(e) => setFormData({...formData, questionType: e.target.value})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 cursor-pointer">
                            {questionTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Câu hỏi (questionText)</label>
                        <textarea 
                          required 
                          rows={2} 
                          value={formData.questionText} 
                          onChange={(e) => handleQuestionTextInput(e.target.value)} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 resize-none" 
                          placeholder="VD: 私はりんごを食べます。"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">File Nghe (audioUrl)</label>
                          <div className="relative flex items-center">
                            <Volume2 size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                            <input type="text" value={formData.audioUrl} onChange={(e) => setFormData({...formData, audioUrl: e.target.value})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20" placeholder="/uploads/..." />
                            
                            <label className="absolute right-2 cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1">
                              <Upload size={12}/> Tải lên
                              <input type="file" accept="audio/*" className="hidden" onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const url = await handleUploadFile(e.target.files[0], 'audio');
                                  if (url) setFormData({...formData, audioUrl: url});
                                }
                              }} />
                            </label>
                          </div>
                          {formData.audioUrl && (
                            <div className="mt-2">
                              <audio controls className="h-8 w-full">
                                <source src={getFullFileUrl(formData.audioUrl)} type="audio/mpeg" />
                              </audio>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Hình ảnh (imageUrl)</label>
                          <div className="relative flex items-center">
                            <ImageIcon size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                            <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20" placeholder="/uploads/..." />
                            
                            <label className="absolute right-2 cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1">
                              <Upload size={12}/> Tải lên
                              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const url = await handleUploadFile(e.target.files[0], 'image');
                                  if (url) setFormData({...formData, imageUrl: url});
                                }
                              }} />
                            </label>
                          </div>
                          {formData.imageUrl && (
                            <div className="mt-2 h-20 w-32 border border-slate-200 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                              <img src={getFullFileUrl(formData.imageUrl)} alt="Preview" className="h-full w-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Metadata (Tự động sinh từ Wanakana)</label>
                        <textarea rows={3} value={formData.metadataString} onChange={(e) => setFormData({...formData, metadataString: e.target.value})} className="w-full font-mono text-sm bg-slate-800 text-green-400 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 resize-y" placeholder='{"romaji": "Watashi wa...", "furigana": "わたし わ..."}'></textarea>
                      </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI: MẢNG OPTIONS ĐỘNG */}
                  <div className="w-full xl:w-[600px] flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#1B2A4A] flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-600" /> Danh sách Options
                      </h3>
                      <button type="button" onClick={handleAddOption} className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-bold px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors">
                        <PlusCircle size={14} /> Thêm Option
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[500px]">
                      {options.map((opt, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                          <button type="button" onClick={() => handleRemoveOption(idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500">
                            <X size={18} />
                          </button>
                          
                          <div className="flex items-center gap-4 mb-4">
                            <span className="bg-slate-100 text-slate-600 font-black px-3 py-1 rounded-md text-xs">#{idx + 1}</span>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={opt.isCorrect} onChange={(e) => handleOptionChange(idx, 'isCorrect', e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600" />
                              <span className={`text-sm font-bold ${opt.isCorrect ? 'text-emerald-600' : 'text-slate-500'}`}>Là đáp án đúng</span>
                            </label>
                          </div>

                          <div className="space-y-4">
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Option Text (Tự động sinh Romaji/Furigana)</label>
                                <input 
                                  type="text" 
                                  value={opt.optionText} 
                                  onChange={(e) => handleOptionTextInput(idx, e.target.value)} 
                                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none" 
                                  placeholder="VD: わたし / watashi" 
                                />
                              </div>
                              <div className="w-24">
                                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Order Index</label>
                                <input type="number" value={opt.orderIndex} onChange={(e) => handleOptionChange(idx, 'orderIndex', e.target.value)} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none" placeholder="VD: 1" />
                              </div>
                            </div>

                            <div className="flex gap-4">
                              <div className="flex-1">
                                <div className="relative flex items-center">
                                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 absolute -top-4 left-0">Audio URL</label>
                                  <input type="text" value={opt.audioUrl} onChange={(e) => handleOptionChange(idx, 'audioUrl', e.target.value)} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 pr-16 text-xs focus:outline-none" placeholder="/uploads/..." />
                                  <label className="absolute right-1 cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded text-[10px] font-bold transition-colors">
                                    Tải lên
                                    <input type="file" accept="audio/*" className="hidden" onChange={async (e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const url = await handleUploadFile(e.target.files[0], 'audio');
                                        if (url) handleOptionChange(idx, 'audioUrl', url);
                                      }
                                    }} />
                                  </label>
                                </div>
                                {opt.audioUrl && (
                                  <div className="mt-1">
                                    <audio controls className="h-6 w-full" style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                                      <source src={getFullFileUrl(opt.audioUrl)} type="audio/mpeg" />
                                    </audio>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="relative flex items-center">
                                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 absolute -top-4 left-0">Image URL</label>
                                  <input type="text" value={opt.imageUrl} onChange={(e) => handleOptionChange(idx, 'imageUrl', e.target.value)} className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 pr-16 text-xs focus:outline-none" placeholder="/uploads/..." />
                                  <label className="absolute right-1 cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded text-[10px] font-bold transition-colors">
                                    Tải lên
                                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const url = await handleUploadFile(e.target.files[0], 'image');
                                        if (url) handleOptionChange(idx, 'imageUrl', url);
                                      }
                                    }} />
                                  </label>
                                </div>
                                {opt.imageUrl && (
                                  <div className="mt-1.5 h-12 w-20 border border-slate-200 rounded overflow-hidden bg-slate-100 flex items-center justify-center">
                                    <img src={getFullFileUrl(opt.imageUrl)} alt="Preview" className="h-full w-full object-cover" />
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-2">
                              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Metadata (Tự động sinh từ Wanakana)</label>
                              <input type="text" value={opt.metadataString} onChange={(e) => handleOptionChange(idx, 'metadataString', e.target.value)} className="w-full h-9 bg-slate-800 text-green-400 border border-slate-700 font-mono rounded-lg px-3 text-xs focus:outline-none" placeholder='{"romaji": "watashi"}' />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 mt-2 border-t border-slate-200">
                      <button type="submit" disabled={loading || isUploading} className={`w-full py-3.5 rounded-xl font-bold text-white shadow-sm transition-all duration-200 ${(loading || isUploading) ? "bg-[#1B2A4A]/50 cursor-not-allowed" : "bg-[#1B2A4A] hover:bg-[#12203B]"}`}>
                        {loading ? "Đang xử lý..." : (editingId ? "Cập nhật Câu hỏi" : "Lưu Câu hỏi JSON")}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL XÁC NHẬN XÓA */}
        {deletingQuestion && (
          <div className="fixed inset-0 bg-[#1B2A4A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl font-body space-y-4">
              <h3 className="text-lg font-bold text-[#23211D]">Xác nhận xóa câu hỏi</h3>
              <p className="text-sm text-slate-600">
                Bạn có chắc chắn muốn xóa câu hỏi <span className="font-bold text-[#B23B3B]">#{deletingQuestion.id}</span>: "<span className="italic">{deletingQuestion.questionText}</span>"? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setDeletingQuestion(null)} className="px-4 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-sm">
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

export default Question;