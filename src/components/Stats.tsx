import React from 'react';
import { DailyRecord, UserProfile } from '../types';
// ✅ تم إصلاح السطر ده وإضافة الأيقونات الناقصة
import { Droplet, Beef, Candy, Calendar, Flame, Activity, HeartPulse, Trash2, Clock, Footprints, BarChart2, Stethoscope } from 'lucide-react';

interface Props {
  history: DailyRecord[];
  profile?: UserProfile;
  onDeleteRecord: (id: string) => void;
  onUpdateRecord?: (record: DailyRecord) => void;
}

export default function Stats({ history, profile, onDeleteRecord }: Props) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center min-h-[400px]">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Calendar className="w-12 h-12 text-emerald-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">لا توجد إحصائيات بعد</h2>
        <p className="text-gray-500 font-medium">ابدأ بتسجيل يومياتك وسيبهرك التقرير هنا!</p>
      </div>
    );
  }

  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8 bg-gradient-to-l from-emerald-600 to-teal-500 p-6 rounded-3xl shadow-lg text-white">
        <div>
          <h2 className="text-2xl font-black mb-1">تقارير ({profile?.name || 'المستخدم'})</h2>
          <p className="text-emerald-100 font-medium text-sm">متابعة يومية لأدائك الصحي والغذائي</p>
        </div>
        <BarChart2 className="w-12 h-12 text-emerald-200 opacity-80" />
      </div>
      
      <div className="grid gap-6">
        {sortedHistory.map((record) => {
          const isToday = record.date === new Date().toISOString().split('T')[0];
          const waterGoalMet = record.intake.water >= record.goals.water;
          const caloriesGoalMet = record.intake.calories <= record.goals.calories;
          const walkGoalMet = record.intake.walkingMinutes >= record.goals.walkingMinutes;
          
          return (
            <div key={record.id} className={`bg-white rounded-3xl shadow-sm border ${isToday ? 'border-emerald-300 ring-4 ring-emerald-50' : 'border-gray-100'} overflow-hidden transition-all hover:shadow-md`}>
              
              {/* تاريخ التقرير والتحكم */}
              <div className={`flex justify-between items-center p-4 ${isToday ? 'bg-emerald-50/50' : 'bg-gray-50/50'} border-b border-gray-100`}>
                <div className="flex items-center gap-3">
                  <div className={`py-1.5 px-4 rounded-xl font-bold text-sm shadow-sm ${isToday ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}>
                    {isToday ? 'اليوم اللحظي' : new Date(record.date).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                </div>
                {!isToday && (
                  <button onClick={() => { if(confirm('متأكد من حذف التقرير؟')) onDeleteRecord(record.id); }} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all flex items-center gap-2 text-xs font-bold">
                    <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">حذف</span>
                  </button>
                )}
              </div>
              
              <div className="p-5">
                {/* الإحصائيات الدائرية أو المربعة */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <StatMini icon={<Flame />} color="text-orange-500" bg="bg-orange-50" value={`${record.intake.calories?.toFixed(0)}`} label="سعر" success={caloriesGoalMet} />
                  <StatMini icon={<Droplet />} color="text-blue-500" bg="bg-blue-50" value={`${record.intake.water.toFixed(1)}`} label="لتر" success={waterGoalMet} />
                  <StatMini icon={<Beef />} color="text-red-500" bg="bg-red-50" value={`${record.intake.protein.toFixed(0)}`} label="جم بروتين" />
                  <StatMini icon={<Candy />} color="text-purple-500" bg="bg-purple-50" value={`${record.intake.sugar.toFixed(0)}`} label="جم سكر" />
                  <StatMini icon={<Footprints />} color="text-indigo-500" bg="bg-indigo-50" value={`${record.intake.walkingMinutes || 0}`} label="دقيقة مشي" success={walkGoalMet} />
                </div>

                {/* القراءات الطبية في التقرير */}
                {record.intake.medicalLogs && record.intake.medicalLogs.length > 0 && (
                  <div className="mt-4 bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                    <h4 className="text-xs font-black text-rose-800 mb-3 flex items-center gap-2 uppercase tracking-wider">
                      <Stethoscope className="w-4 h-4" /> السجل الطبي لليوم
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {record.intake.medicalLogs.map((log, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-rose-100 shadow-sm text-sm font-bold">
                          <span className="text-gray-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3"/> {log.time}</span>
                          <span className="text-gray-300">|</span>
                          {log.type === 'bloodSugar' ? (
                            <span className="text-purple-700 flex items-center gap-1"><Activity className="w-4 h-4"/> {log.bloodSugar} <span className="text-[10px] text-purple-400">mg/dL</span></span>
                          ) : (
                            <span className="text-red-700 flex items-center gap-1"><HeartPulse className="w-4 h-4"/> {log.systolic}/{log.diastolic}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

// مكون فرعي صغير للاحصائيات
function StatMini({ icon, color, bg, value, label, success }: any) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl ${bg} border border-white/50 relative overflow-hidden`}>
      <div className={`mb-2 ${color}`}>{icon}</div>
      <span className="text-lg font-black text-gray-900">{value}</span>
      <span className="text-xs font-bold text-gray-500">{label}</span>
      {success !== undefined && (
        <div className={`absolute top-0 right-0 w-2 h-full ${success ? 'bg-emerald-400' : 'bg-red-400'}`} />
      )}
    </div>
  );
}