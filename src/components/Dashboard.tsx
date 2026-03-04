import React, { useState } from 'react';
import { DailyGoals, DailyIntake, UserProfile, MedicalLog } from '../types';
import { Droplet, Beef, Wheat, Candy, Leaf, Activity, Flame, HeartPulse, Stethoscope, Save, Trash2, Clock, ActivitySquare, Footprints } from 'lucide-react';

interface Props {
  intake: DailyIntake;
  goals: DailyGoals;
  profile?: UserProfile;
  onAddMedicalLog?: (log: MedicalLog) => void;
  onRemoveFood?: (id: string) => void;
  onAddWalking?: (minutes: number) => void; 
}

export default function Dashboard({ intake, goals, profile, onAddMedicalLog, onRemoveFood, onAddWalking }: Props) {
  const [medType, setMedType] = useState<'bloodSugar' | 'bloodPressure'>('bloodSugar');
  const [bloodSugar, setBloodSugar] = useState<number | ''>('');
  const [systolic, setSystolic] = useState<number | ''>('');
  const [diastolic, setDiastolic] = useState<number | ''>('');
  const [logTime, setLogTime] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });

  const handleSaveMedical = () => {
    if (!onAddMedicalLog) return;
    if (medType === 'bloodSugar' && bloodSugar) {
      onAddMedicalLog({ id: Date.now().toString(), time: logTime, type: 'bloodSugar', bloodSugar: Number(bloodSugar) });
      setBloodSugar('');
    } else if (medType === 'bloodPressure' && systolic && diastolic) {
      onAddMedicalLog({ id: Date.now().toString(), time: logTime, type: 'bloodPressure', systolic: Number(systolic), diastolic: Number(diastolic) });
      setSystolic('');
      setDiastolic('');
    }
  };

  const showMedicalSection = profile?.isDiabetic || profile?.hasHypertension;

  return (
    <div className="space-y-8">
      
      {/* قسم تسجيل المشي السريع المطور (مع أزرار التراجع) */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-3xl shadow-md text-white flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:shadow-lg">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Footprints className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-black text-lg">النشاط البدني والمشي</h3>
            <p className="text-indigo-100 text-sm font-medium">الهدف اليومي: {goals.walkingMinutes} دقيقة</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
          {/* أزرار التراجع والتصفير تظهر فقط لو فيه وقت مشي متسجل */}
          {(intake.walkingMinutes || 0) > 0 && (
            <>
              <button 
                onClick={() => {
                  if(confirm('هل تريد تصفير وقت المشي؟')) {
                    onAddWalking && onAddWalking(-(intake.walkingMinutes || 0));
                  }
                }}
                className="flex-1 sm:flex-none bg-red-500/40 hover:bg-red-500 text-white px-3 py-2 rounded-xl font-bold transition-all text-sm flex items-center justify-center"
                title="تصفير وقت المشي"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onAddWalking && onAddWalking((intake.walkingMinutes || 0) >= 15 ? -15 : -(intake.walkingMinutes || 0))} 
                className="flex-1 sm:flex-none bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-bold transition-all text-sm"
              >
                - 15
              </button>
            </>
          )}
          
          <button 
            onClick={() => onAddWalking && onAddWalking(15)} 
            className="flex-1 sm:flex-none bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-2 rounded-xl font-bold transition-all shadow-sm text-sm"
          >
            + 15
          </button>
          <button 
            onClick={() => onAddWalking && onAddWalking(30)} 
            className="flex-1 sm:flex-none bg-indigo-600/50 hover:bg-indigo-500 text-white border border-indigo-400 px-5 py-2 rounded-xl font-bold transition-all backdrop-blur-sm text-sm"
          >
            + 30
          </button>
        </div>
      </div>

      {/* القسم الطبي */}
      {showMedicalSection && (
        <div className="bg-gradient-to-br from-white to-rose-50/50 p-6 rounded-3xl shadow-sm border border-rose-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6 border-b border-rose-100 pb-4">
            <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-rose-900">العيادة المصغرة</h2>
              <p className="text-sm text-rose-600 font-medium">سجل قراءاتك وتابع حالتك لحظة بلحظة</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-2 mb-4 bg-gray-50 p-1 rounded-xl">
                {profile?.isDiabetic && (
                  <button onClick={() => setMedType('bloodSugar')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${medType === 'bloodSugar' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
                    قياس السكر
                  </button>
                )}
                {profile?.hasHypertension && (
                  <button onClick={() => setMedType('bloodPressure')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${medType === 'bloodPressure' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
                    قياس الضغط
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">وقت القياس</label>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <input type="time" value={logTime} onChange={(e) => setLogTime(e.target.value)} className="bg-transparent outline-none font-medium text-gray-700 w-full" />
                  </div>
                </div>

                {medType === 'bloodSugar' ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">قراءة السكر (mg/dL)</label>
                    <input type="number" value={bloodSugar} onChange={(e) => setBloodSugar(e.target.value === '' ? '' : Number(e.target.value))} placeholder="مثال: 120" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold text-lg" />
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 mb-1">انقباضي (العالي)</label>
                      <input type="number" value={systolic} onChange={(e) => setSystolic(e.target.value === '' ? '' : Number(e.target.value))} placeholder="120" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold text-lg text-center" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 mb-1">انبساطي (الواطي)</label>
                      <input type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value === '' ? '' : Number(e.target.value))} placeholder="80" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold text-lg text-center" />
                    </div>
                  </div>
                )}

                <button onClick={handleSaveMedical} className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  <Save className="w-5 h-5" /> حفظ القراءة
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <ActivitySquare className="w-4 h-4 text-rose-500" /> قراءات اليوم السابقة
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                {intake.medicalLogs && intake.medicalLogs.length > 0 ? (
                  intake.medicalLogs.slice().reverse().map(log => (
                    <div key={log.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-rose-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${log.type === 'bloodSugar' ? 'bg-purple-100 text-purple-600' : 'bg-red-100 text-red-600'}`}>
                          {log.type === 'bloodSugar' ? <Activity className="w-4 h-4" /> : <HeartPulse className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">
                            {log.type === 'bloodSugar' ? `${log.bloodSugar} mg/dL` : `${log.systolic}/${log.diastolic} mmHg`}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {log.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm font-medium">
                    لم يتم تسجيل قراءات اليوم
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* قسم الإحصائيات الغذائية */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard title="المشي" icon={<Footprints className="w-6 h-6 text-indigo-500" />} current={intake.walkingMinutes || 0} goal={goals.walkingMinutes} unit="دقيقة" color="bg-indigo-500" bgColor="bg-indigo-50" />
        <StatCard title="السعرات" icon={<Flame className="w-6 h-6 text-orange-500" />} current={intake.calories} goal={goals.calories} unit="سعر" color="bg-orange-500" bgColor="bg-orange-50" />
        <StatCard title="المياه" icon={<Droplet className="w-6 h-6 text-blue-500" />} current={intake.water} goal={goals.water} unit="لتر" color="bg-blue-500" bgColor="bg-blue-50" />
        <StatCard title="البروتين" icon={<Beef className="w-6 h-6 text-red-500" />} current={intake.protein} goal={goals.protein} unit="جم" color="bg-red-500" bgColor="bg-red-50" />
        <StatCard title="النشويات" icon={<Wheat className="w-6 h-6 text-amber-500" />} current={intake.carbs} goal={goals.carbs} unit="جم" color="bg-amber-500" bgColor="bg-amber-50" />
        <StatCard title="السكريات" icon={<Candy className="w-6 h-6 text-purple-500" />} current={intake.sugar} goal={goals.sugar} unit="جم" color="bg-purple-500" bgColor="bg-purple-50" isLimit={true} />
        <StatCard title="الخضروات" icon={<Leaf className="w-6 h-6 text-emerald-500" />} current={intake.veggies} goal={goals.veggies} unit="جم" color="bg-emerald-500" bgColor="bg-emerald-50" />
        <StatCard title="الألياف" icon={<Activity className="w-6 h-6 text-teal-500" />} current={intake.fiber} goal={goals.fiber} unit="جم" color="bg-teal-500" bgColor="bg-teal-50" />
      </div>

      {/* قائمة الأكل المستهلك */}
      {intake.consumedFoods && intake.consumedFoods.length > 0 && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">سجل وجبات اليوم</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {intake.consumedFoods.map((log) => (
              <div key={log.id} className="group flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">{log.food.name} <span className="text-emerald-600 text-sm">({log.amount} جم)</span></span>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" /> {log.time}
                    <span>•</span>
                    <span className="font-medium text-orange-500">{((log.food.calories || 0) * (log.amount/100)).toFixed(0)} سعر</span>
                  </div>
                </div>
                <button 
                  onClick={() => onRemoveFood && onRemoveFood(log.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"
                  title="حذف الوجبة"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// مكون الكارت المطور
interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  current: number;
  goal: number;
  unit: string;
  color: string;
  bgColor: string;
  isLimit?: boolean;
}

function StatCard({ title, icon, current, goal, unit, color, bgColor, isLimit }: StatCardProps) {
  const percentage = Math.min(100, Math.round((current / goal) * 100));
  const remaining = Math.max(0, Number((goal - current).toFixed(1)));
  const isExceeded = isLimit && current > goal;
  const barColor = isExceeded ? 'bg-red-600' : color;
  
  return (
    <div className={`p-4 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-2xl ${bgColor}`}>
          {icon}
        </div>
        <div className="text-right">
          <span className="block text-xl font-black text-gray-900">{Number(current.toFixed(1))}</span>
          <span className="block text-xs text-gray-400 font-medium">/ {goal} {unit}</span>
        </div>
      </div>
      <h3 className="font-bold text-gray-800 text-sm mb-2">{title}</h3>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-700 ease-out ${barColor}`} style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="flex justify-between text-[10px] font-bold">
        <span className={isExceeded ? 'text-red-600' : 'text-gray-500'}>
          {isLimit ? (isExceeded ? `تجاوزت بـ ${Number((current - goal).toFixed(1))}` : `متبقي ${remaining}`) : `متبقي ${remaining}`}
        </span>
        <span className="text-gray-400">{percentage}%</span>
      </div>
    </div>
  );
}