import React, { useState, useEffect, useCallback } from 'react';
import { Users, BookOpen, BrainCircuit, Target, Calendar, Search, Award, Layers, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

// Giữ nguyên bảng màu tươi sáng từ thiết kế gốc[cite: 1]
const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export const Dashboard = () => {
  // Logic lấy ngày tháng mặc định[cite: 1]
  const getDateRangeForPeriod = (period: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    
    switch(period) {
      case 'day': return { startDate: today, endDate: today };
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return { startDate: weekAgo.toISOString().split('T')[0], endDate: today };
      case 'month': return { startDate: `${year}-${month}-01`, endDate: today };
      case 'year': return { startDate: `${year}-01-01`, endDate: `${year}-12-31` };
      default: return { startDate: `${year}-01-01`, endDate: `${year}-12-31` };
    }
  };

  const [filters, setFilters] = useState(() => ({
    period: 'month',
    ...getDateRangeForPeriod('month'),
  }));

  const [tempFilters, setTempFilters] = useState(() => ({
    period: 'month',
    ...getDateRangeForPeriod('month')
  }));

  const [loading, setLoading] = useState(true);
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  
  // Dữ liệu giả lập cho App Học Tiếng Nhật
  const [overview, setOverview] = useState<any>({});
  const [charts, setCharts] = useState<any>({ studyTime: [], users: [] });
  const [topLists, setTopLists] = useState<any>({ lessons: [], users: [], jlptLevels: [] });
  const [studyHistory, setStudyHistory] = useState<any>({});

  const handleDateChange = (field: string, value: string) => {
    setTempFilters(prev => ({ ...prev, [field]: value }));
    setIsCustomDateRange(true);
  };

  const handlePeriodChange = (value: string) => {
    const newDates = getDateRangeForPeriod(value);
    setTempFilters(prev => ({ ...prev, period: value, ...newDates }));
    setIsCustomDateRange(false);
  };

  const handleSearch = () => {
    setFilters({
      ...filters,
      ...tempFilters,
      period: isCustomDateRange ? 'custom' : tempFilters.period
    });
  };

  const fetchDashboardData = useCallback(() => {
    setLoading(true);
    // Giả lập gọi API lấy số liệu thống kê học tập
    setTimeout(() => {
      setOverview({
        totalUsers: 1250,
        totalLessons: 45,
        totalQuestions: 8432,
        totalCompletedExams: 3240
      });
      
      setCharts({
        studyTime: [
          { name: '01/07', value: 120 }, { name: '05/07', value: 300 }, 
          { name: '10/07', value: 450 }, { name: '15/07', value: 380 },
          { name: '20/07', value: 600 }
        ],
        users: [
          { name: '01/07', value: 15 }, { name: '05/07', value: 45 }, 
          { name: '10/07', value: 20 }, { name: '15/07', value: 80 },
          { name: '20/07', value: 55 }
        ]
      });

      setTopLists({
        jlptLevels: [
          { name: 'N5', percentage: 40 }, { name: 'N4', percentage: 30 },
          { name: 'N3', percentage: 20 }, { name: 'N2', percentage: 8 },
          { name: 'N1', percentage: 2 }
        ],
        lessons: [
          { title: 'Bài 1: Chào hỏi cơ bản', subtitle: 'Unit 1', playCount: 5430 },
          { title: 'Ngữ pháp N4 - Bài 25', subtitle: 'Unit 4', playCount: 4210 },
          { title: 'Từ vựng Kanji cơ bản', subtitle: 'Unit 2', playCount: 3890 },
        ],
        users: [
          { name: 'Sensei 01', subtitle: 'Level 99 • Chuỗi 120 ngày', totalPlayCount: 15000 },
          { name: 'Wibu Chua', subtitle: 'Level 45 • Chuỗi 45 ngày', totalPlayCount: 8400 },
          { name: 'Nihongo Master', subtitle: 'Level 40 • Chuỗi 30 ngày', totalPlayCount: 7200 },
        ]
      });

      setStudyHistory({
        totalListenTime: 450000, // Tính bằng giây
        averageListenTime: 1800,
        peakListeningHours: [
          { hour: 20, count: 450 }, { hour: 21, count: 520 }, 
          { hour: 22, count: 380 }, { hour: 7, count: 210 }
        ],
        topGenres: [
          { genreName: 'Từ vựng', percentage: 45 },
          { genreName: 'Ngữ pháp', percentage: 30 },
          { genreName: 'Nghe hiểu', percentage: 25 },
        ],
        listenTrendByDay: [
          { date: '2026-07-15', totalListens: 120, totalTime: 3600 },
          { date: '2026-07-16', totalListens: 150, totalTime: 4500 },
          { date: '2026-07-17', totalListens: 180, totalTime: 5400 },
        ]
      });
      setLoading(false);
    }, 800);
  }, [filters]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  // Render cấu trúc Header và Toolbar giống hệt bản gốc[cite: 1]
  return (
    <div className="p-8 space-y-8 bg-[#fdfdff] min-h-screen font-sans text-slate-900" style={{ marginTop: '20px', borderRadius: '16px' }}>
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Tổng quan Học tập</h1>
          <p className="text-slate-500 mt-1">Theo dõi tiến độ và sự phát triển của học viên.</p>
        </div>

        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 gap-3">
            <Calendar size={18} className="text-slate-400" />
            <input type="date" className="bg-transparent text-sm font-medium outline-none text-slate-700" value={tempFilters.startDate} onChange={(e) => handleDateChange('startDate', e.target.value)} />
            <span className="text-slate-300">→</span>
            <input type="date" className="bg-transparent text-sm font-medium outline-none text-slate-700" value={tempFilters.endDate} onChange={(e) => handleDateChange('endDate', e.target.value)} />
          </div>

          <select className={`bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 ring-violet-500 transition-all ${isCustomDateRange ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} value={isCustomDateRange ? 'custom' : tempFilters.period} onChange={(e) => handlePeriodChange(e.target.value)} disabled={isCustomDateRange}>
            {isCustomDateRange && <option value="custom">Tùy chỉnh</option>}
            <option value="day">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>

          <button onClick={handleSearch} className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95">
            <Search size={16} /> Lọc
          </button>
        </div>
      </header>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 mt-2 text-sm">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Thay đổi Icon và nội dung thẻ thống kê cho App Học Tiếng Nhật[cite: 1] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Tổng Học viên" value={overview.totalUsers} icon={Users} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Bài học (Lessons)" value={overview.totalLessons} icon={BookOpen} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Ngân hàng Câu hỏi" value={overview.totalQuestions} icon={BrainCircuit} color="text-orange-600" bg="bg-orange-50" />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartBox title="Tăng trưởng Thời gian học (Giờ)" data={charts.studyTime} color="#8b5cf6" type="line" />
        <ChartBox title="Học viên mới" data={charts.users} color="#06b6d4" type="bar" />
      </div>

      {topLists.jlptLevels.length > 0 && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="font-extrabold text-slate-800 mb-8 text-lg flex items-center gap-3">
            <div className="p-2 bg-violet-50 text-violet-600 rounded-lg"><Layers size={20} /></div>
            Phân bổ Mục tiêu JLPT
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topLists.jlptLevels} cx="50%" cy="50%" labelLine={false} label={({ name, percentage } :any) => `${name} ${Math.round(percentage)}%`} outerRadius={140} fill="#8884d8" dataKey="percentage">
                  {topLists.jlptLevels.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} formatter={(value: any) => `${Math.round(value)}%`} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: '600' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopList title="Bài học Phổ biến nhất" data={topLists.lessons} icon={BookOpen} unit="lượt học" />
        <TopList title="Bảng xếp hạng Học viên" data={topLists.users} icon={Award} unit="EXP" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StudyHistoryStats data={studyHistory} />
        <StudyTrendChart data={studyHistory?.listenTrendByDay || []} />
      </div>
    </div>
  );
};

// --- CÁC COMPONENT TÁI SỬ DỤNG (Được điều chỉnh từ mã nguồn)[cite: 1] ---

const StatCard = ({ label, value, icon: Icon, color, bg }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
    <div className={`p-4 rounded-2xl ${bg} ${color}`}><Icon size={28} /></div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <h3 className="text-2xl font-black text-slate-800">{(value || 0).toLocaleString()}</h3>
    </div>
  </div>
);

const ChartBox = ({ title, data, color, type }: any) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
    <h3 className="font-extrabold text-slate-800 mb-8 text-lg">{title}</h3>
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} dy={10} stroke="#94a3b8" />
            <YAxis fontSize={11} axisLine={false} tickLine={false} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={4} dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} dy={10} stroke="#94a3b8" />
            <YAxis fontSize={11} axisLine={false} tickLine={false} stroke="#94a3b8" />
            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none' }} />
            <Bar dataKey="value" fill={color} radius={[8, 8, 0, 0]} barSize={32} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  </div>
);

const TopList = ({ title, data, icon: Icon, unit }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
    <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
      <div className="p-2 bg-violet-50 text-violet-600 rounded-lg"><Icon size={20} /></div>
      <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
    </div>
    <div className="space-y-5 flex-1">
      {data.map((item: any, idx: number) => (
        <div key={idx} className="flex items-center justify-between group cursor-default">
          <div className="flex flex-col max-w-[70%]">
            <span className="text-sm font-bold text-slate-700 line-clamp-1 group-hover:text-violet-600 transition-colors">{item.title || item.name}</span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{item.subtitle}</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-black bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-xl border border-slate-100">
              {(item.playCount || item.totalPlayCount).toLocaleString()} {unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StudyTrendChart = ({ data }: any) => {
  const chartData = data.map((item: any) => ({
    name: new Date(item.date).toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' }),
    lessons: item.totalListens,
    time: Math.round(item.totalTime / 60)
  }));

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <h3 className="font-extrabold text-slate-800 mb-8 text-lg flex items-center gap-3">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Clock size={20} /></div>
        Xu hướng Học tập (Ngày)
      </h3>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} dy={10} stroke="#94a3b8" />
            <YAxis fontSize={11} axisLine={false} tickLine={false} stroke="#94a3b8" />
            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="lessons" name="Bài đã học" fill="#10b981" radius={[8, 8, 0, 0]} barSize={24} />
            <Bar dataKey="time" name="Phút học" fill="#06b6d4" radius={[8, 8, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StudyHistoryStats = ({ data }: any) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
        <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><BrainCircuit size={20} /></div>
        <h3 className="font-bold text-slate-800 tracking-tight">Phân tích Thói quen Học tập</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-violet-50 to-pink-50 p-4 rounded-2xl">
          <p className="text-xs font-bold text-slate-500 mb-1">Tổng Thời gian học</p>
          <p className="text-2xl font-black text-violet-600">{formatTime(data.totalListenTime || 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl">
          <p className="text-xs font-bold text-slate-500 mb-1">Trung bình Phiên</p>
          <p className="text-2xl font-black text-blue-600">{formatTime(data.averageListenTime || 0)}</p>
        </div>
      </div>

      {data.peakListeningHours && (
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">Khung giờ học sôi nổi nhất</h4>
          <div className="space-y-2">
            {data.peakListeningHours.slice(0, 4).map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center text-xs font-bold">{item.hour}h</div>
                  <span className="text-sm text-slate-600">{item.hour}:00</span>
                </div>
                <span className="text-xs font-black bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-xl">{item.count} lượt</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};