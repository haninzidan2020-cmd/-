import React, { useState } from 'react';
import { UserProfile, WeightEntry } from '../types';
import { Scale, TrendingDown, TrendingUp, Minus, Calendar, Target, Activity } from 'lucide-react';

interface WeightTrackerProps {
  profile: UserProfile;
  weightHistory: WeightEntry[];
  onAddWeight: (weight: number) => void;
  currentBMI: string | null;
  bmiStatus: { status: string; color: string; bg: string } | null;
}

export default function WeightTracker({ profile, weightHistory, onAddWeight, currentBMI, bmiStatus }: WeightTrackerProps) {
  const [newWeight, setNewWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');

  const handleAddWeight = () => {
    const weight = parseFloat(newWeight);
    if (weight && weight > 0) {
      onAddWeight(weight);
      setNewWeight('');
    }
  };

  const getWeightTrend = () => {
    if (weightHistory.length < 2) return null;
    const recent = weightHistory[0].weight;
    const previous = weightHistory[1].weight;
    const diff = recent - previous;
    return { diff: Math.abs(diff).toFixed(1), increasing: diff > 0 };
  };

  const trend = getWeightTrend();

  const getIdealWeight = () => {
    const heightInMeters = profile.height / 100;
    const idealBMI = 22; // Middle of healthy range
    return (idealBMI * heightInMeters * heightInMeters).toFixed(1);
  };

  const calculateCalorieDeficit = () => {
    if (!targetWeight) return null;
    const target = parseFloat(targetWeight);
    const current = profile.weight;
    const diff = current - target;
    if (diff <= 0) return null;
    
    // 1kg = ~7700 calories
    const totalCalories = diff * 7700;
    const weeks = Math.ceil(diff / 0.5); // Safe weight loss: 0.5kg/week
    const dailyDeficit = Math.round(totalCalories / (weeks * 7));
    
    return { weeks, dailyDeficit, totalCalories: Math.round(totalCalories) };
  };

  const deficit = calculateCalorieDeficit();

  return (
    <div className="space-y-6">
      
      {/* BMI Card */}
      <div className={`${bmiStatus?.bg || 'bg-gray-50'} rounded-3xl p-6 shadow-lg border-2 ${bmiStatus?.color.replace('text-', 'border-')} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">مؤشر كتلة الجسم (BMI)</h2>
              <p className="text-sm text-gray-600 font-medium">Body Mass Index</p>
            </div>
            <div className={`w-16 h-16 ${bmiStatus?.bg || 'bg-gray-100'} rounded-2xl flex items-center justify-center shadow-lg`}>
              <Scale className={`w-8 h-8 ${bmiStatus?.color || 'text-gray-600'}`} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
              <p className="text-xs text-gray-600 font-medium mb-1">BMI الحالي</p>
              <p className={`text-3xl font-black ${bmiStatus?.color || 'text-gray-900'}`}>{currentBMI || '--'}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
              <p className="text-xs text-gray-600 font-medium mb-1">الحالة</p>
              <p className={`text-lg font-black ${bmiStatus?.color || 'text-gray-900'}`}>{bmiStatus?.status || '--'}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
              <p className="text-xs text-gray-600 font-medium mb-1">الوزن الحالي</p>
              <p className="text-2xl font-black text-gray-900">{profile.weight} كجم</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
              <p className="text-xs text-gray-600 font-medium mb-1">الوزن المثالي</p>
              <p className="text-2xl font-black text-emerald-600">{getIdealWeight()} كجم</p>
            </div>
          </div>

          {/* BMI Scale */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
            <p className="text-sm font-bold text-gray-700 mb-3">مقياس BMI</p>
            <div className="flex h-8 rounded-full overflow-hidden shadow-inner mb-2">
              <div className="flex-1 bg-blue-400 flex items-center justify-center text-xs font-bold text-white">&lt;18.5</div>
              <div className="flex-1 bg-green-400 flex items-center justify-center text-xs font-bold text-white">18.5-25</div>
              <div className="flex-1 bg-yellow-400 flex items-center justify-center text-xs font-bold text-white">25-30</div>
              <div className="flex-1 bg-red-400 flex items-center justify-center text-xs font-bold text-white">&gt;30</div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 font-medium">
              <span>نحيف</span>
              <span>طبيعي</span>
              <span>زائد</span>
              <span>سمنة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Weight */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-600" />
          تسجيل وزن جديد
        </h3>
        <div className="flex gap-3">
          <input
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="أدخل الوزن بالكيلوجرام"
            className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold text-lg"
          />
          <button
            onClick={handleAddWeight}
            disabled={!newWeight}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold px-6 py-4 rounded-xl transition-all disabled:cursor-not-allowed shadow-lg"
          >
            حفظ
          </button>
        </div>
      </div>

      {/* Weight Trend */}
      {trend && (
        <div className={`${trend.increasing ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} rounded-3xl p-6 shadow-lg border-2`}>
          <div className="flex items-center gap-3 mb-3">
            {trend.increasing ? (
              <TrendingUp className="w-8 h-8 text-red-600" />
            ) : (
              <TrendingDown className="w-8 h-8 text-green-600" />
            )}
            <div>
              <h3 className="text-xl font-black text-gray-900">التغير الأخير</h3>
              <p className="text-sm text-gray-600 font-medium">مقارنة بآخر قياس</p>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-black ${trend.increasing ? 'text-red-600' : 'text-green-600'}`}>
              {trend.increasing ? '+' : '-'}{trend.diff}
            </span>
            <span className="text-xl font-bold text-gray-600 mb-1">كجم</span>
          </div>
        </div>
      )}

      {/* Target Weight Calculator */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 shadow-xl text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black">حاسبة الوزن المستهدف</h3>
            <p className="text-sm text-white/80 font-medium">خطة مخصصة لتحقيق هدفك</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2 text-white/90">الوزن المستهدف (كجم)</label>
          <input
            type="number"
            step="0.1"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            placeholder="مثال: 75"
            className="w-full p-4 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-white focus:border-white font-bold text-lg text-white placeholder-white/60"
          />
        </div>

        {deficit && (
          <div className="space-y-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <p className="text-sm font-medium text-white/80 mb-1">الوقت المتوقع</p>
              <p className="text-3xl font-black">{deficit.weeks} أسبوع</p>
              <p className="text-xs text-white/70 mt-1">بمعدل آمن: 0.5 كجم/أسبوع</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <p className="text-sm font-medium text-white/80 mb-1">عجز السعرات اليومي</p>
              <p className="text-3xl font-black">{deficit.dailyDeficit} سعر</p>
              <p className="text-xs text-white/70 mt-1">إجمالي: {deficit.totalCalories.toLocaleString()} سعر حراري</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <p className="text-sm font-bold text-white mb-2">💡 نصيحة:</p>
              <p className="text-sm text-white/90 leading-relaxed">
                لتحقيق هدفك، قلل سعراتك اليومية بـ {deficit.dailyDeficit} سعر، أو زد نشاطك البدني بما يعادل حرق هذا القدر من السعرات.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Weight History Chart */}
      {weightHistory.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            سجل الوزن
          </h3>
          
          {/* Simple Chart */}
          <div className="mb-6 h-48 flex items-end gap-2 border-b-2 border-gray-200 pb-2">
            {weightHistory.slice(0, 10).reverse().map((entry, idx) => {
              const maxWeight = Math.max(...weightHistory.slice(0, 10).map(e => e.weight));
              const minWeight = Math.min(...weightHistory.slice(0, 10).map(e => e.weight));
              const range = maxWeight - minWeight || 1;
              const height = ((entry.weight - minWeight) / range) * 100;
              
              return (
                <div key={entry.id} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs font-bold text-gray-600">{entry.weight}kg</div>
                  <div 
                    className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg transition-all hover:from-emerald-600 hover:to-teal-600 min-h-[20px]"
                    style={{ height: `${Math.max(height, 20)}%` }}
                  ></div>
                </div>
              );
            })}
          </div>

          {/* History List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {weightHistory.map((entry, idx) => {
              const prevEntry = weightHistory[idx + 1];
              const diff = prevEntry ? entry.weight - prevEntry.weight : 0;
              
              return (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Scale className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-lg">{entry.weight} كجم</p>
                      <p className="text-xs text-gray-500 font-medium">{entry.date}</p>
                    </div>
                  </div>
                  {diff !== 0 && (
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${diff > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {diff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="text-sm font-black">{diff > 0 ? '+' : ''}{diff.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
