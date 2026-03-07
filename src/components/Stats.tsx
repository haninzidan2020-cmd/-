import React, { useState } from 'react';
import { UserProfile, DailyRecord } from '../types';
import { Trash2, TrendingUp, Calendar, Award, Droplet, Activity, Apple, ChevronLeft, ChevronRight, Pill } from 'lucide-react';

interface StatsProps {
  history: DailyRecord[];
  profile: UserProfile;
  onDeleteRecord: (id: string) => void;
}

const MEDICINES_PREFIX = 'medicines_';
const REMINDERS_PREFIX = 'reminders_';

export default function Stats({ history, profile, onDeleteRecord }: StatsProps) {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [activeSection, setActiveSection] = useState<'nutrition' | 'medical' | 'medicines'>('nutrition');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const getAllMedicalLogs = () => {
    const logs: { date: string; type: string; bloodSugar?: number; systolic?: number; diastolic?: number }[] = [];
    history.forEach(record => {
      (record.intake.medicalLogs || []).forEach((log: any) => {
        logs.push({ date: record.date, ...log });
      });
    });
    return logs.sort((a, b) => b.date.localeCompare(a.date));
  };

  const getMedicineStats = () => {
    const medicines: any[] = JSON.parse(localStorage.getItem(`${MEDICINES_PREFIX}${profile.id}`) || '[]');
    const today = new Date();
    return medicines.map((med: any) => {
      let takenDoses = 0, totalDoses = 0;
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        const dayReminders: any[] = JSON.parse(localStorage.getItem(`${REMINDERS_PREFIX}${profile.id}_${dateKey}`) || '[]');
        dayReminders.forEach(r => {
          if (r.medicineId === med.id) { totalDoses++; if (r.completed) takenDoses++; }
        });
      }
      return { name: med.name, dosage: med.dosage, daily: med.times?.length || 1, weekly: (med.times?.length || 1) * 7, monthly: (med.times?.length || 1) * 30, totalDoses, takenDoses };
    });
  };

  const getWeeklyStats = () => {
    const weeks: { [key: string]: DailyRecord[] } = {};
    history.forEach(r => {
      const d = new Date(r.date);
      const ws = new Date(d); ws.setDate(d.getDate() - d.getDay());
      const k = ws.toISOString().split('T')[0];
      if (!weeks[k]) weeks[k] = [];
      weeks[k].push(r);
    });
    return Object.entries(weeks).map(([weekStart, records]) => {
      const n = records.length;
      return {
        weekStart, days: n,
        avg: {
          water: records.reduce((s, r) => s + r.intake.water, 0) / n,
          protein: records.reduce((s, r) => s + r.intake.protein, 0) / n,
          calories: records.reduce((s, r) => s + r.intake.calories, 0) / n,
          walkingMinutes: records.reduce((s, r) => s + (r.intake.walkingMinutes || 0), 0) / n,
        }
      };
    }).sort((a, b) => b.weekStart.localeCompare(a.weekStart));
  };

  const getMonthlyStats = () => {
    const months: { [key: string]: DailyRecord[] } = {};
    history.forEach(r => {
      const k = r.date.substring(0, 7);
      if (!months[k]) months[k] = [];
      months[k].push(r);
    });
    return Object.entries(months).map(([month, records]) => {
      const n = records.length;
      return {
        month, days: n,
        avg: {
          water: records.reduce((s, r) => s + r.intake.water, 0) / n,
          protein: records.reduce((s, r) => s + r.intake.protein, 0) / n,
          calories: records.reduce((s, r) => s + r.intake.calories, 0) / n,
          walkingMinutes: records.reduce((s, r) => s + (r.intake.walkingMinutes || 0), 0) / n,
        }
      };
    }).sort((a, b) => b.month.localeCompare(a.month));
  };

  const getYearlyStats = () => {
    const today = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const records = history.filter(r => r.date.startsWith(monthKey));
      const n = records.length;
      let sugarVals: number[] = [], bpVals: { s: number; d: number }[] = [];
      records.forEach(r => (r.intake.medicalLogs || []).forEach((log: any) => {
        if (log.type === 'bloodSugar' && log.bloodSugar) sugarVals.push(log.bloodSugar);
        if (log.type === 'bloodPressure' && log.systolic) bpVals.push({ s: log.systolic, d: log.diastolic });
      }));
      return {
        label: new Intl.DateTimeFormat('ar-EG', { month: 'long', year: 'numeric' }).format(d),
        days: n,
        avg: n ? {
          water: records.reduce((s, r) => s + r.intake.water, 0) / n,
          calories: records.reduce((s, r) => s + r.intake.calories, 0) / n,
          protein: records.reduce((s, r) => s + r.intake.protein, 0) / n,
          walkingMinutes: records.reduce((s, r) => s + (r.intake.walkingMinutes || 0), 0) / n,
        } : null,
        avgSugar: sugarVals.length ? sugarVals.reduce((a, b) => a + b, 0) / sugarVals.length : null,
        avgBP: bpVals.length ? { s: bpVals.reduce((a, b) => a + b.s, 0) / bpVals.length, d: bpVals.reduce((a, b) => a + b.d, 0) / bpVals.length } : null,
        sugarCount: sugarVals.length, bpCount: bpVals.length,
      };
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === today) return 'اليوم';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'أمس';
    return new Intl.DateTimeFormat('ar-EG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };

  const pct = (c: number, g: number) => Math.min((c / (g || 1)) * 100, 100);

  const getSugarStatus = (v: number) => {
    if (v < 70) return { label: 'منخفض ⚠️', color: 'text-blue-700', bg: 'bg-blue-50' };
    if (v <= 100) return { label: 'طبيعي ✅', color: 'text-green-700', bg: 'bg-green-50' };
    if (v <= 140) return { label: 'مقبول 🟡', color: 'text-yellow-700', bg: 'bg-yellow-50' };
    if (v <= 180) return { label: 'مرتفع 🟠', color: 'text-orange-700', bg: 'bg-orange-50' };
    return { label: 'مرتفع جداً 🔴', color: 'text-red-700', bg: 'bg-red-50' };
  };

  const getBPStatus = (s: number) => {
    if (s < 90) return { label: 'منخفض ⚠️', color: 'text-blue-700', bg: 'bg-blue-50' };
    if (s < 120) return { label: 'مثالي ✅', color: 'text-green-700', bg: 'bg-green-50' };
    if (s < 130) return { label: 'طبيعي ✅', color: 'text-green-600', bg: 'bg-green-50' };
    if (s < 140) return { label: 'مرتفع قليلاً 🟡', color: 'text-yellow-700', bg: 'bg-yellow-50' };
    return { label: 'ضغط مرتفع 🔴', color: 'text-red-700', bg: 'bg-red-50' };
  };

  const allMedicalLogs = getAllMedicalLogs();
  const medicineStats = getMedicineStats();
  const paginatedHistory = history.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const getFilteredMedicalLogs = () => {
    const now = new Date().getTime();
    return allMedicalLogs.filter(l => {
      const diff = (now - new Date(l.date).getTime()) / (1000 * 86400);
      if (viewMode === 'daily') return diff <= 1;
      if (viewMode === 'weekly') return diff <= 7;
      if (viewMode === 'monthly') return diff <= 30;
      return true; // yearly
    });
  };

  const getBestDay = () => history.length === 0 ? null : history.reduce((best, cur) =>
    (pct(cur.intake.water, cur.goals.water) + pct(cur.intake.protein, cur.goals.protein)) >
    (pct(best.intake.water, best.goals.water) + pct(best.intake.protein, best.goals.protein)) ? cur : best
  );

  const TabBtn = ({ mode, label }: { mode: typeof viewMode; label: string }) => (
    <button onClick={() => { setViewMode(mode); setCurrentPage(0); }}
      className={`flex-1 py-2.5 px-1 rounded-xl font-bold text-xs sm:text-sm transition-all ${viewMode === mode ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}>
      {label}
    </button>
  );

  const MiniBar = ({ value, max, colorClass }: { value: number; max: number; colorClass: string }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
      <div className={`${colorClass} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.min((value / (max || 1)) * 100, 100)}%` }} />
    </div>
  );

  return (
    <div className="space-y-4">

      {/* تبويب الفترة الزمنية */}
      <div className="bg-white rounded-2xl p-1.5 shadow-md border border-gray-200 flex gap-1">
        <TabBtn mode="daily" label="📅 يومي" />
        <TabBtn mode="weekly" label="📊 أسبوعي" />
        <TabBtn mode="monthly" label="🗓️ شهري" />
        <TabBtn mode="yearly" label="📈 سنوي 12م" />
      </div>

      {/* تبويب القسم */}
      <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100 flex gap-1">
        {([
          { id: 'nutrition', label: '🥗 التغذية' },
          { id: 'medical', label: '🩸 السكر والضغط' },
          { id: 'medicines', label: '💊 الأدوية' },
        ] as const).map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`flex-1 py-2 px-1 rounded-xl font-bold text-xs sm:text-sm transition-all ${activeSection === s.id ? 'bg-emerald-100 text-emerald-800 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ===== قسم التغذية ===== */}
      {activeSection === 'nutrition' && (
        <>
          {getBestDay() && viewMode === 'daily' && (
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl p-4 text-white flex items-center gap-3 shadow-lg">
              <Award className="w-9 h-9 flex-shrink-0" />
              <div><p className="font-black">🏆 أفضل يوم لديك</p><p className="text-sm opacity-90">{formatDate(getBestDay()!.date)}</p></div>
            </div>
          )}

          {viewMode === 'daily' && (
            <>
              <div className="space-y-3">
                {paginatedHistory.map(record => (
                  <div key={record.id} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-black text-gray-900">{formatDate(record.date)}</h3>
                      {record.id !== 'today' && (
                        <button onClick={() => onDeleteRecord(record.id)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { icon: Droplet, label: 'المياه', val: `${record.intake.water.toFixed(1)}ل`, goal: record.goals.water, cur: record.intake.water, color: 'text-blue-600', bar: 'bg-blue-500' },
                        { icon: Apple, label: 'البروتين', val: `${record.intake.protein.toFixed(0)}ج`, goal: record.goals.protein, cur: record.intake.protein, color: 'text-red-600', bar: 'bg-red-500' },
                        { icon: Activity, label: 'المشي', val: `${record.intake.walkingMinutes || 0}د`, goal: record.goals.walkingMinutes, cur: record.intake.walkingMinutes || 0, color: 'text-purple-600', bar: 'bg-purple-500' },
                        { icon: TrendingUp, label: 'السعرات', val: `${record.intake.calories.toFixed(0)}`, goal: record.goals.calories, cur: record.intake.calories, color: 'text-orange-600', bar: 'bg-orange-500' },
                      ].map((m, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                          <m.icon className={`w-4 h-4 ${m.color} mb-1`} />
                          <p className="text-xs text-gray-500">{m.label}</p>
                          <p className={`font-black ${m.color}`}>{m.val}</p>
                          <MiniBar value={m.cur} max={m.goal} colorClass={m.bar} />
                          <p className="text-xs text-gray-400">{pct(m.cur, m.goal).toFixed(0)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="p-2.5 bg-white border-2 border-gray-200 rounded-xl disabled:opacity-40"><ChevronRight className="w-5 h-5" /></button>
                  <span className="font-bold text-gray-700 text-sm">صفحة {currentPage + 1} من {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1} className="p-2.5 bg-white border-2 border-gray-200 rounded-xl disabled:opacity-40"><ChevronLeft className="w-5 h-5" /></button>
                </div>
              )}
            </>
          )}

          {viewMode === 'weekly' && (
            <div className="space-y-3">
              {getWeeklyStats().map((w, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                  <h3 className="font-black text-gray-900 mb-3 text-sm">الأسبوع من {w.weekStart} <span className="text-gray-400 font-medium">({w.days} أيام)</span></h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <StatCard label="متوسط المياه" value={`${w.avg.water.toFixed(1)} لتر`} color="text-blue-600" bg="bg-blue-50" />
                    <StatCard label="متوسط البروتين" value={`${w.avg.protein.toFixed(0)} جم`} color="text-red-600" bg="bg-red-50" />
                    <StatCard label="متوسط المشي" value={`${w.avg.walkingMinutes.toFixed(0)} د`} color="text-purple-600" bg="bg-purple-50" />
                    <StatCard label="متوسط السعرات" value={`${w.avg.calories.toFixed(0)}`} color="text-orange-600" bg="bg-orange-50" />
                  </div>
                </div>
              ))}
              {getWeeklyStats().length === 0 && <EmptyState />}
            </div>
          )}

          {viewMode === 'monthly' && (
            <div className="space-y-3">
              {getMonthlyStats().map((m, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                  <h3 className="font-black text-gray-900 mb-3 text-sm">📅 {m.month} <span className="text-gray-400 font-medium">({m.days} يوم)</span></h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <StatCard label="متوسط المياه" value={`${m.avg.water.toFixed(1)} لتر`} color="text-blue-600" bg="bg-blue-50" />
                    <StatCard label="متوسط البروتين" value={`${m.avg.protein.toFixed(0)} جم`} color="text-red-600" bg="bg-red-50" />
                    <StatCard label="متوسط المشي" value={`${m.avg.walkingMinutes.toFixed(0)} د`} color="text-purple-600" bg="bg-purple-50" />
                    <StatCard label="متوسط السعرات" value={`${m.avg.calories.toFixed(0)}`} color="text-orange-600" bg="bg-orange-50" />
                  </div>
                </div>
              ))}
              {getMonthlyStats().length === 0 && <EmptyState />}
            </div>
          )}

          {viewMode === 'yearly' && (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <h3 className="font-black text-gray-800">📈 تقرير 12 شهر الماضية - التغذية والنشاط</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {getYearlyStats().map((m, i) => (
                  <div key={i} className={`p-4 ${m.days === 0 ? 'opacity-40' : ''}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-gray-800 text-sm">{m.label}</span>
                      <span className="text-xs text-gray-400">{m.days > 0 ? `${m.days} يوم` : 'لا بيانات'}</span>
                    </div>
                    {m.avg && (
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center"><p className="text-gray-400">مياه</p><p className="font-black text-blue-600">{m.avg.water.toFixed(1)}ل</p></div>
                        <div className="text-center"><p className="text-gray-400">سعرات</p><p className="font-black text-orange-600">{m.avg.calories.toFixed(0)}</p></div>
                        <div className="text-center"><p className="text-gray-400">بروتين</p><p className="font-black text-red-600">{m.avg.protein.toFixed(0)}ج</p></div>
                        <div className="text-center"><p className="text-gray-400">مشي</p><p className="font-black text-purple-600">{m.avg.walkingMinutes.toFixed(0)}د</p></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {history.length === 0 && <EmptyState />}
        </>
      )}

      {/* ===== قسم السكر والضغط ===== */}
      {activeSection === 'medical' && (
        <div className="space-y-4">
          {/* ملخص إحصائي */}
          {(() => {
            const logs = getFilteredMedicalLogs();
            const sugarLogs = logs.filter(l => l.type === 'bloodSugar' && l.bloodSugar);
            const bpLogs = logs.filter(l => l.type === 'bloodPressure' && l.systolic);
            if (sugarLogs.length === 0 && bpLogs.length === 0) return null;
            const avgSugar = sugarLogs.length ? sugarLogs.reduce((s, l) => s + l.bloodSugar!, 0) / sugarLogs.length : null;
            const maxSugar = sugarLogs.length ? Math.max(...sugarLogs.map(l => l.bloodSugar!)) : null;
            const avgBP = bpLogs.length ? { s: bpLogs.reduce((s, l) => s + l.systolic!, 0) / bpLogs.length, d: bpLogs.reduce((s, l) => s + l.diastolic!, 0) / bpLogs.length } : null;
            return (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {avgSugar && <div className="bg-red-50 rounded-2xl p-4 border border-red-100 text-center"><p className="text-xs text-gray-500 mb-1">🩸 متوسط السكر</p><p className="text-2xl font-black text-red-600">{avgSugar.toFixed(0)}</p><p className={`text-xs font-bold mt-1 ${getSugarStatus(avgSugar).color}`}>{getSugarStatus(avgSugar).label}</p></div>}
                {maxSugar && <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 text-center"><p className="text-xs text-gray-500 mb-1">⬆️ أعلى قراءة سكر</p><p className="text-2xl font-black text-orange-600">{maxSugar}</p><p className={`text-xs font-bold mt-1 ${getSugarStatus(maxSugar).color}`}>{getSugarStatus(maxSugar).label}</p></div>}
                {avgBP && <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 text-center"><p className="text-xs text-gray-500 mb-1">💓 متوسط الضغط</p><p className="text-2xl font-black text-purple-600">{avgBP.s.toFixed(0)}/{avgBP.d.toFixed(0)}</p><p className={`text-xs font-bold mt-1 ${getBPStatus(avgBP.s).color}`}>{getBPStatus(avgBP.s).label}</p></div>}
              </div>
            );
          })()}

          <div className="grid md:grid-cols-2 gap-4">
            {/* جدول السكر */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <h3 className="font-black text-gray-800 mb-3 flex items-center gap-2 text-sm">
                🩸 قراءات السكر
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-lg">{getFilteredMedicalLogs().filter(l => l.type === 'bloodSugar').length} قراءة</span>
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {getFilteredMedicalLogs().filter(l => l.type === 'bloodSugar' && l.bloodSugar).map((log, idx) => {
                  const st = getSugarStatus(log.bloodSugar!);
                  return (
                    <div key={idx} className={`${st.bg} rounded-xl p-3 flex justify-between items-center border border-gray-100`}>
                      <div><p className="font-black text-gray-900 text-sm">{log.bloodSugar} <span className="text-xs text-gray-500">mg/dL</span></p><p className="text-xs text-gray-400">{formatDate(log.date)}</p></div>
                      <span className={`text-xs font-black px-2 py-1 rounded-lg bg-white/70 ${st.color}`}>{st.label}</span>
                    </div>
                  );
                })}
                {getFilteredMedicalLogs().filter(l => l.type === 'bloodSugar').length === 0 && <p className="text-gray-400 text-sm text-center py-4">لا توجد قراءات</p>}
              </div>
            </div>

            {/* جدول الضغط */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <h3 className="font-black text-gray-800 mb-3 flex items-center gap-2 text-sm">
                💓 قراءات الضغط
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-lg">{getFilteredMedicalLogs().filter(l => l.type === 'bloodPressure').length} قراءة</span>
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {getFilteredMedicalLogs().filter(l => l.type === 'bloodPressure' && l.systolic).map((log, idx) => {
                  const st = getBPStatus(log.systolic!);
                  return (
                    <div key={idx} className={`${st.bg} rounded-xl p-3 flex justify-between items-center border border-gray-100`}>
                      <div><p className="font-black text-gray-900 text-sm">{log.systolic}/{log.diastolic} <span className="text-xs text-gray-500">mmHg</span></p><p className="text-xs text-gray-400">{formatDate(log.date)}</p></div>
                      <span className={`text-xs font-black px-2 py-1 rounded-lg bg-white/70 ${st.color}`}>{st.label}</span>
                    </div>
                  );
                })}
                {getFilteredMedicalLogs().filter(l => l.type === 'bloodPressure').length === 0 && <p className="text-gray-400 text-sm text-center py-4">لا توجد قراءات</p>}
              </div>
            </div>
          </div>

          {/* تقرير سنوي للسكر والضغط */}
          {viewMode === 'yearly' && (
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <h3 className="font-black text-gray-800 mb-3">📈 متوسط السكر والضغط شهرياً (12 شهر)</h3>
              <div className="space-y-2">
                {getYearlyStats().map((m, i) => (
                  <div key={i} className={`rounded-xl p-3 border ${m.days > 0 ? 'bg-gray-50 border-gray-200' : 'border-dashed border-gray-200 opacity-40'}`}>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-bold text-gray-700 text-sm">{m.label}</span>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {m.avgSugar && <span className={`font-black px-2 py-0.5 rounded-lg ${getSugarStatus(m.avgSugar).bg} ${getSugarStatus(m.avgSugar).color}`}>🩸 {m.avgSugar.toFixed(0)} ({m.sugarCount})</span>}
                        {m.avgBP && <span className={`font-black px-2 py-0.5 rounded-lg ${getBPStatus(m.avgBP.s).bg} ${getBPStatus(m.avgBP.s).color}`}>💓 {m.avgBP.s.toFixed(0)}/{m.avgBP.d.toFixed(0)} ({m.bpCount})</span>}
                        {m.days > 0 && !m.avgSugar && !m.avgBP && <span className="text-gray-400">لا قراءات طبية</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== قسم الأدوية ===== */}
      {activeSection === 'medicines' && (
        <div className="space-y-4">
          {medicineStats.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-bold">لا توجد أدوية مسجلة</p>
              <p className="text-gray-400 text-sm mt-1">أضف أدويتك من تبويب الأدوية</p>
            </div>
          ) : (
            <>
              {/* ملخص الالتزام */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg">
                <h3 className="font-black mb-3 flex items-center gap-2"><Pill className="w-5 h-5" /> ملخص الالتزام (آخر 30 يوم)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {medicineStats.map((med, idx) => {
                    const p = med.totalDoses > 0 ? (med.takenDoses / med.totalDoses) * 100 : 0;
                    return (
                      <div key={idx} className="bg-white/20 rounded-xl p-3 text-center">
                        <p className="font-black text-sm truncate">{med.name}</p>
                        <p className="text-3xl font-black">{p.toFixed(0)}%</p>
                        <p className="text-xs opacity-80">{med.takenDoses}/{med.totalDoses} جرعة</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* جدول الأدوية */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100"><h3 className="font-black text-gray-800">📋 جدول الأدوية التفصيلي</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-right p-3 font-black text-gray-700">الدواء</th>
                        <th className="text-center p-3 font-black text-gray-700">الجرعة</th>
                        <th className="text-center p-3 font-black text-gray-700">يومياً</th>
                        <th className="text-center p-3 font-black text-gray-700">أسبوعياً</th>
                        <th className="text-center p-3 font-black text-gray-700">شهرياً</th>
                        <th className="text-center p-3 font-black text-gray-700">الالتزام</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicineStats.map((med, idx) => {
                        const p = med.totalDoses > 0 ? (med.takenDoses / med.totalDoses) * 100 : 0;
                        const pColor = p >= 80 ? 'text-green-700 bg-green-100' : p >= 50 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100';
                        return (
                          <tr key={idx} className="border-t border-gray-50 hover:bg-gray-50">
                            <td className="p-3 font-bold text-gray-900">{med.name}</td>
                            <td className="p-3 text-center text-gray-600 text-xs">{med.dosage}</td>
                            <td className="p-3 text-center font-bold text-blue-600">{med.daily}×</td>
                            <td className="p-3 text-center font-bold text-indigo-600">{med.weekly}×</td>
                            <td className="p-3 text-center font-bold text-purple-600">{med.monthly}×</td>
                            <td className="p-3 text-center"><span className={`px-2 py-1 rounded-lg font-black text-xs ${pColor}`}>{p.toFixed(0)}%</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-3 border border-gray-100`}>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`text-lg font-black ${color} mt-1`}>{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-200">
      <Calendar className="w-14 h-14 text-gray-300 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-gray-600 mb-1">لا توجد تقارير بعد</h3>
      <p className="text-gray-400 text-sm">ابدأ بتسجيل بياناتك اليومية</p>
    </div>
  );
}
