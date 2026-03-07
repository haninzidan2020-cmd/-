import React from 'react';
import { UserProfile, DailyIntake, DailyGoals, MedicalLog, ConsumedFood } from '../types';
import { Droplet, Activity, Apple, Flame, Leaf, Wheat, Footprints, Stethoscope, Trash2, Plus, TrendingUp, ChevronDown } from 'lucide-react';

interface DashboardProps {
  intake: DailyIntake;
  goals: DailyGoals;
  profile: UserProfile;
  onAddMedicalLog: (log: MedicalLog) => void;
  onRemoveFood: (logId: string) => void;
  onAddWalking: (minutes: number) => void;
  onAddWater: (amount: number) => void;
}

export default function Dashboard({ intake, goals, profile, onAddMedicalLog, onRemoveFood, onAddWalking, onAddWater }: DashboardProps) {
  const [showMedical, setShowMedical] = React.useState(false);
  const [medicalType, setMedicalType] = React.useState<'bloodSugar' | 'bloodPressure'>('bloodSugar');
  const [bloodSugar, setBloodSugar] = React.useState('');
  const [systolic, setSystolic] = React.useState('');
  const [diastolic, setDiastolic] = React.useState('');
  const [showFoodLog, setShowFoodLog] = React.useState(true);

  const handleSubmitMedical = () => {
    if (medicalType === 'bloodSugar' && bloodSugar) {
      onAddMedicalLog({ type: 'bloodSugar', bloodSugar: parseFloat(bloodSugar), timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) });
      setBloodSugar('');
    } else if (medicalType === 'bloodPressure' && systolic && diastolic) {
      onAddMedicalLog({ type: 'bloodPressure', systolic: parseFloat(systolic), diastolic: parseFloat(diastolic), timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) });
      setSystolic('');
      setDiastolic('');
    }
    setShowMedical(false);
  };

  const getPercentage = (current: number, goal: number) => Math.min((current / goal) * 100, 100);
  const getColor = (percentage: number) => {
    if (percentage < 50) return 'text-rose-600 bg-rose-100';
    if (percentage < 80) return 'text-amber-600 bg-amber-100';
    return 'text-emerald-600 bg-emerald-100';
  };

  const metrics = [
    { icon: Droplet, label: 'المياه', current: intake.water.toFixed(1), goal: goals.water.toFixed(1), unit: 'لتر', color: 'from-blue-500 to-cyan-500', bgLight: 'bg-blue-50', percentage: getPercentage(intake.water, goals.water) },
    { icon: Apple, label: 'البروتين', current: intake.protein.toFixed(0), goal: goals.protein.toFixed(0), unit: 'جم', color: 'from-rose-500 to-pink-500', bgLight: 'bg-rose-50', percentage: getPercentage(intake.protein, goals.protein) },
    { icon: Wheat, label: 'النشويات', current: intake.carbs.toFixed(0), goal: goals.carbs.toFixed(0), unit: 'جم', color: 'from-amber-500 to-orange-500', bgLight: 'bg-amber-50', percentage: getPercentage(intake.carbs, goals.carbs) },
    { icon: Flame, label: 'السكر', current: intake.sugar.toFixed(0), goal: goals.sugar.toFixed(0), unit: 'جم', color: 'from-red-500 to-rose-600', bgLight: 'bg-red-50', percentage: getPercentage(intake.sugar, goals.sugar) },
    { icon: Leaf, label: 'الخضراوات', current: intake.veggies.toFixed(0), goal: goals.veggies.toFixed(0), unit: 'جم', color: 'from-green-500 to-emerald-500', bgLight: 'bg-green-50', percentage: getPercentage(intake.veggies, goals.veggies) },
    { icon: Wheat, label: 'الألياف', current: intake.fiber.toFixed(0), goal: goals.fiber.toFixed(0), unit: 'جم', color: 'from-yellow-600 to-amber-600', bgLight: 'bg-yellow-50', percentage: getPercentage(intake.fiber, goals.fiber) },
    { icon: TrendingUp, label: 'السعرات', current: intake.calories.toFixed(0), goal: goals.calories.toFixed(0), unit: 'كالوري', color: 'from-purple-500 to-indigo-500', bgLight: 'bg-purple-50', percentage: getPercentage(intake.calories, goals.calories) },
  ];

  return (
    <div className="space-y-6">
      
      {/* 💧 قسم المياه مع زر الإضافة السريعة */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Droplet className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black">شرب المياه</h3>
                <p className="text-sm text-white/80 font-medium">الهدف اليومي: {goals.water.toFixed(1)} لتر</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-end justify-between mb-3">
              <span className="text-5xl font-black tracking-tight">{intake.water.toFixed(1)}</span>
              <span className="text-xl font-bold text-white/80">/ {goals.water.toFixed(1)} لتر</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
              <div className="bg-white h-full rounded-full transition-all duration-500 shadow-lg" style={{ width: `${getPercentage(intake.water, goals.water)}%` }}></div>
            </div>
            <p className="text-sm text-white/90 mt-2 font-medium">
              {getPercentage(intake.water, goals.water).toFixed(0)}% مكتمل
              {getPercentage(intake.water, goals.water) >= 100 && ' 🎉'}
            </p>
          </div>

          {/* 🚀 أزرار إضافة المياه السريعة */}
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => onAddWater(0.25)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg">
              + 250 مل
            </button>
            <button onClick={() => onAddWater(0.5)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg">
              + 500 مل
            </button>
            <button onClick={() => onAddWater(1)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg">
              + 1 لتر
            </button>
          </div>
        </div>
      </div>

      {/* النشاط البدني والمشي */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mt-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Footprints className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black">النشاط البدني والمشي</h3>
              <p className="text-sm text-white/80 font-medium">الهدف اليومي: {goals.walkingMinutes} دقيقة</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-end justify-between mb-3">
              <span className="text-5xl font-black tracking-tight">{intake.walkingMinutes || 0}</span>
              <span className="text-xl font-bold text-white/80">/ {goals.walkingMinutes} دقيقة</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
              <div className="bg-white h-full rounded-full transition-all duration-500 shadow-lg" style={{ width: `${getPercentage(intake.walkingMinutes || 0, goals.walkingMinutes)}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onAddWalking(15)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg">
              + 15 د
            </button>
            <button onClick={() => onAddWalking(30)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg">
              + 30 د
            </button>
          </div>
        </div>
      </div>

      {/* مقاييس التغذية */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className={`${metric.bgLight} rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all`}>
            <div className={`w-10 h-10 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
              <metric.icon className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-sm font-bold text-gray-600 mb-1">{metric.label}</h4>
            <p className="text-2xl font-black text-gray-900 mb-1">{metric.current}</p>
            <p className="text-xs text-gray-500 font-medium">من {metric.goal} {metric.unit}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
              <div className={`bg-gradient-to-r ${metric.color} h-full rounded-full transition-all duration-500`} style={{ width: `${metric.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* العيادة المصغرة */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">العيادة المصغرة</h3>
              <p className="text-sm text-gray-500 font-medium">سجّل قراءاتك وتابع حالتك لحظة بلحظة</p>
            </div>
          </div>
          <button onClick={() => setShowMedical(!showMedical)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-2">
            <Plus className="w-5 h-5" /> إضافة قراءة
          </button>
        </div>

        {showMedical && (
          <div className="bg-red-50 rounded-2xl p-6 mb-6 border-2 border-red-200">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => setMedicalType('bloodSugar')} className={`py-3 rounded-xl font-bold transition-all ${medicalType === 'bloodSugar' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                قياس السكر
              </button>
              <button onClick={() => setMedicalType('bloodPressure')} className={`py-3 rounded-xl font-bold transition-all ${medicalType === 'bloodPressure' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                قياس الضغط
              </button>
            </div>

            {medicalType === 'bloodSugar' ? (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">قراءة السكر (mg/dL)</label>
                <input type="number" value={bloodSugar} onChange={(e) => setBloodSugar(e.target.value)} placeholder="مثال: 120" className="w-full p-4 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold text-lg" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الانقباضي</label>
                  <input type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)} placeholder="120" className="w-full p-4 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold text-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الانبساطي</label>
                  <input type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} placeholder="80" className="w-full p-4 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold text-lg" />
                </div>
              </div>
            )}

            <button onClick={handleSubmitMedical} className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg">
              حفظ القراءة
            </button>
          </div>
        )}

        {intake.medicalLogs && intake.medicalLogs.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold text-gray-700 text-sm mb-3">قراءات اليوم السابقة:</h4>
            {intake.medicalLogs.map((log, idx) => (
              <div key={idx} className="bg-red-50 rounded-xl p-4 flex justify-between items-center border border-red-100">
                <div>
                  <p className="font-bold text-gray-900">
                    {log.type === 'bloodSugar' ? `سكر: ${log.bloodSugar} mg/dL` : `ضغط: ${log.systolic}/${log.diastolic}`}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* سجل الوجبات */}
      {intake.consumedFoods && intake.consumedFoods.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <button onClick={() => setShowFoodLog(!showFoodLog)} className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Apple className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-right">
                <h3 className="text-xl font-black text-gray-900">سجل الوجبات اليومية</h3>
                <p className="text-sm text-gray-500 font-medium">{intake.consumedFoods.length} وجبة مسجلة</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${showFoodLog ? 'rotate-180' : ''}`} />
          </button>

          {showFoodLog && (
            <div className="space-y-3">
              {intake.consumedFoods.map((log) => (
                <div key={log.id} className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 text-lg">{log.food.name}</h4>
                      <p className="text-sm text-gray-600 font-medium">{log.amount} جرام • {log.time}</p>
                    </div>
                    <button onClick={() => onRemoveFood(log.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white rounded-lg p-2 border border-gray-200">
                      <p className="text-gray-500 font-medium">بروتين</p>
                      <p className="font-black text-rose-600">{(log.food.protein * log.amount / 100).toFixed(1)} جم</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-gray-200">
                      <p className="text-gray-500 font-medium">نشويات</p>
                      <p className="font-black text-amber-600">{(log.food.carbs * log.amount / 100).toFixed(1)} جم</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-gray-200">
                      <p className="text-gray-500 font-medium">سعرات</p>
                      <p className="font-black text-purple-600">{((log.food.calories || 0) * log.amount / 100).toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
