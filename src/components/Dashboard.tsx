import React from 'react';
import { UserProfile, DailyIntake, DailyGoals, MedicalLog, ConsumedFood } from '../types';
import { Droplet, Activity, Apple, Flame, Leaf, Wheat, Footprints, Stethoscope, Trash2, Plus, TrendingUp, ChevronDown, RotateCcw, Volume2 } from 'lucide-react';

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
  const [showSoundModal, setShowSoundModal] = React.useState(false);

  const SOUND_KEY = 'health_sound_settings';
  const [soundSettings, setSoundSettings] = React.useState<{
    muted: boolean; overEating: string; medicine: string; water: string; success: string; medical: string;
  }>(() => {
    try { return { muted: false, overEating: 'sawtooth', medicine: 'sine', water: 'sine', success: 'triangle', medical: 'square', ...JSON.parse(localStorage.getItem('health_sound_settings') || '{}') }; }
    catch { return { muted: false, overEating: 'sawtooth', medicine: 'sine', water: 'sine', success: 'triangle', medical: 'square' }; }
  });
  React.useEffect(() => { localStorage.setItem(SOUND_KEY, JSON.stringify(soundSettings)); }, [soundSettings]);

  // ===== 🔊 نظام الأصوات المتكامل =====
  const getAudioContext = () => new (window.AudioContext || (window as any).webkitAudioContext)();

  // 🍔 تجاوز حد الأكل
  const playOverEatingSound = () => {
    if (soundSettings.muted) return;
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;
      const notes = [523, 659, 784, 1047, 784, 659, 523];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = soundSettings.overEating as OscillatorType;
        osc.frequency.setValueAtTime(freq, t + i * 0.1);
        gain.gain.setValueAtTime(0.25, t + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.09);
        osc.start(t + i * 0.1); osc.stop(t + i * 0.1 + 0.1);
      });
    } catch (e) {}
  };

  // 💊 تذكير الدواء
  const playMedicineSound = () => {
    if (soundSettings.muted) return;
    try {
      const ctx = getAudioContext(); const t = ctx.currentTime;
      [0, 0.35, 0.7].forEach(offset => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = soundSettings.medicine as OscillatorType;
        osc.frequency.setValueAtTime(880, t + offset);
        osc.frequency.exponentialRampToValueAtTime(1100, t + offset + 0.15);
        gain.gain.setValueAtTime(0.0, t + offset);
        gain.gain.linearRampToValueAtTime(0.3, t + offset + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.3);
        osc.start(t + offset); osc.stop(t + offset + 0.35);
      });
    } catch (e) {}
  };

  // 💧 تذكير المياه
  const playWaterReminderSound = () => {
    if (soundSettings.muted) return;
    try {
      const ctx = getAudioContext(); const t = ctx.currentTime;
      [1200, 900, 600, 400].forEach((freq, i) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = soundSettings.water as OscillatorType;
        osc.frequency.setValueAtTime(freq, t + i * 0.08);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + i * 0.08 + 0.12);
        gain.gain.setValueAtTime(0.3, t + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.15);
        osc.start(t + i * 0.08); osc.stop(t + i * 0.08 + 0.2);
      });
    } catch (e) {}
  };

  // ⚠️ تحذير طبي
  const playMedicalWarningSound = () => {
    if (soundSettings.muted) return;
    try {
      const ctx = getAudioContext(); const t = ctx.currentTime;
      [0, 0.4, 0.8, 1.2].forEach(offset => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = (soundSettings.medical || 'square') as OscillatorType;
        osc.frequency.setValueAtTime(offset % 0.8 === 0 ? 660 : 880, t + offset);
        gain.gain.setValueAtTime(0.2, t + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.35);
        osc.start(t + offset); osc.stop(t + offset + 0.38);
      });
    } catch (e) {}
  };

  // ✅ إنجاز هدف
  const playSuccessSound = () => {
    if (soundSettings.muted) return;
    try {
      const ctx = getAudioContext(); const t = ctx.currentTime;
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = (soundSettings.success || 'triangle') as OscillatorType;
        osc.frequency.setValueAtTime(freq, t + i * 0.12);
        gain.gain.setValueAtTime(0.28, t + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.2);
        osc.start(t + i * 0.12); osc.stop(t + i * 0.12 + 0.22);
      });
    } catch (e) {}
  };

  // تتبع تجاوز الحدود مع منع تكرار الصوت
  const prevAlerts = React.useRef({ calories: false, sugar: false, carbs: false, waterDone: false, walkDone: false });

  React.useEffect(() => {
    const calOver = intake.calories > goals.calories * 1.1;
    const sugarOver = intake.sugar > goals.sugar;
    const carbsOver = intake.carbs > goals.carbs * 1.1;
    if (calOver && !prevAlerts.current.calories) { playOverEatingSound(); prevAlerts.current.calories = true; }
    if (!calOver) prevAlerts.current.calories = false;
    if (sugarOver && !prevAlerts.current.sugar) { playOverEatingSound(); prevAlerts.current.sugar = true; }
    if (!sugarOver) prevAlerts.current.sugar = false;
    if (carbsOver && !prevAlerts.current.carbs) { playOverEatingSound(); prevAlerts.current.carbs = true; }
    if (!carbsOver) prevAlerts.current.carbs = false;
  }, [intake.calories, intake.sugar, intake.carbs]);

  React.useEffect(() => {
    const waterDone = intake.water >= goals.water;
    if (waterDone && !prevAlerts.current.waterDone) { playSuccessSound(); prevAlerts.current.waterDone = true; }
    if (!waterDone) prevAlerts.current.waterDone = false;
  }, [intake.water]);

  React.useEffect(() => {
    const walkDone = (intake.walkingMinutes || 0) >= goals.walkingMinutes;
    if (walkDone && !prevAlerts.current.walkDone) { playSuccessSound(); prevAlerts.current.walkDone = true; }
    if (!walkDone) prevAlerts.current.walkDone = false;
  }, [intake.walkingMinutes]);

  // تذكير المياه كل 90 دقيقة لو لسه ما وصلش 50%
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (intake.water < goals.water * 0.5) playWaterReminderSound();
    }, 90 * 60 * 1000);
    return () => clearInterval(interval);
  }, [intake.water, goals.water]);

  // دالة عامة تستخدمها App.tsx للتحذير الطبي
  (window as any).playMedicalWarningSound = playMedicalWarningSound;
  (window as any).playMedicineSound = playMedicineSound;

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

      {/* 🟢 زر خضر - التحكم في الأصوات */}
      <button
        onClick={() => setShowSoundModal(true)}
        className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl font-black text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] ${soundSettings.muted ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{soundSettings.muted ? '🔇' : '🔊'}</span>
          <div className="text-right">
            <p className="text-base font-black">خضر - إعدادات الإشعارات الصوتية</p>
            <p className="text-xs font-medium opacity-80">{soundSettings.muted ? 'الصوت مكتوم' : 'الصوت مفعّل - اضغط للتخصيص'}</p>
          </div>
        </div>
        <Volume2 className="w-6 h-6 opacity-80" />
      </button>

      {/* Modal إعدادات الصوت */}
      {showSoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white rounded-t-3xl p-5 border-b flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">🟢 خضر - إعدادات الصوت</h2>
              <button onClick={() => setShowSoundModal(false)} className="bg-gray-100 p-2 rounded-xl text-gray-500 hover:text-red-500 transition-colors">✕</button>
            </div>
            <div className="p-5 space-y-5">

              {/* وضع الصمت */}
              <div className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${soundSettings.muted ? 'bg-gray-100 border-gray-400' : 'bg-emerald-50 border-emerald-400'}`}
                onClick={() => setSoundSettings(s => ({ ...s, muted: !s.muted }))}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-gray-900 text-lg">{soundSettings.muted ? '🔇 وضع الصمت مفعّل' : '🔊 الصوت مفعّل'}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{soundSettings.muted ? 'اضغط لتشغيل الصوت' : 'اضغط لإيقاف كل الأصوات'}</p>
                  </div>
                  <div className={`w-14 h-8 rounded-full transition-all ${soundSettings.muted ? 'bg-gray-400' : 'bg-emerald-500'} relative`}>
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${soundSettings.muted ? 'left-1' : 'left-7'}`} />
                  </div>
                </div>
              </div>

              {/* اختيار نوع الصوت لكل حالة */}
              {!soundSettings.muted && (
                <div className="space-y-4">
                  <h3 className="font-black text-gray-700">🎵 نوع الصوت لكل حالة</h3>
                  {([
                    { key: 'overEating', label: '🍔 تجاوز حد الأكل', play: playOverEatingSound },
                    { key: 'medicine', label: '💊 موعد الدواء', play: playMedicineSound },
                    { key: 'water', label: '💧 تذكير المياه', play: playWaterReminderSound },
                    { key: 'success', label: '🎉 إنجاز هدف', play: playSuccessSound },
                    { key: 'medical', label: '⚠️ تحذير طبي', play: playMedicalWarningSound },
                  ] as const).map(item => (
                    <div key={item.key} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-gray-800 text-sm">{item.label}</p>
                        <button onClick={item.play} className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1 rounded-lg font-bold transition-colors">
                          ▶ اختبر
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {([
                          { val: 'sine', label: '🎵 ناعم' },
                          { val: 'square', label: '📡 حاد' },
                          { val: 'sawtooth', label: '⚡ قوي' },
                          { val: 'triangle', label: '🔔 جرس' },
                        ]).map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => setSoundSettings(s => ({ ...s, [item.key]: opt.val }))}
                            className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all text-center ${soundSettings[item.key] === opt.val ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => setShowSoundModal(false)} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-3 rounded-xl transition-all hover:from-emerald-700 hover:to-teal-700 shadow-lg">
                ✅ حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}
      
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
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => onAddWater(0.25)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md">
              +250مل
            </button>
            <button onClick={() => onAddWater(0.5)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md">
              +500مل
            </button>
            <button onClick={() => onAddWater(1)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md">
              +1لتر
            </button>
            <button onClick={() => onAddWater(-0.25)} disabled={intake.water <= 0} className="bg-red-400/40 hover:bg-red-400/60 disabled:opacity-40 backdrop-blur-sm border border-white/30 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> تراجع
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

          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => onAddWalking(15)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md">
              +15د
            </button>
            <button onClick={() => onAddWalking(30)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md">
              +30د
            </button>
            <button onClick={() => onAddWalking(45)} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md">
              +45د
            </button>
            <button onClick={() => onAddWalking(-15)} disabled={(intake.walkingMinutes || 0) <= 0} className="bg-red-400/40 hover:bg-red-400/60 disabled:opacity-40 backdrop-blur-sm border border-white/30 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> تراجع
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
            {intake.medicalLogs.map((log, idx) => {
              let statusLabel = '';
              let statusColor = 'text-gray-600';
              let statusBg = 'bg-gray-50';
              if (log.type === 'bloodSugar' && log.bloodSugar !== undefined) {
                if (log.bloodSugar < 70) { statusLabel = '⚠️ منخفض'; statusColor = 'text-blue-700'; statusBg = 'bg-blue-50'; }
                else if (log.bloodSugar <= 100) { statusLabel = '✅ طبيعي صائم'; statusColor = 'text-green-700'; statusBg = 'bg-green-50'; }
                else if (log.bloodSugar <= 140) { statusLabel = '✅ طبيعي بعد أكل'; statusColor = 'text-green-600'; statusBg = 'bg-green-50'; }
                else if (log.bloodSugar <= 180) { statusLabel = '🟡 مرتفع قليلاً'; statusColor = 'text-amber-700'; statusBg = 'bg-amber-50'; }
                else { statusLabel = '🔴 مرتفع جداً'; statusColor = 'text-red-700'; statusBg = 'bg-red-50'; }
              } else if (log.type === 'bloodPressure' && log.systolic !== undefined) {
                if (log.systolic < 90) { statusLabel = '⚠️ منخفض'; statusColor = 'text-blue-700'; statusBg = 'bg-blue-50'; }
                else if (log.systolic < 120 && (log.diastolic || 0) < 80) { statusLabel = '✅ مثالي'; statusColor = 'text-green-700'; statusBg = 'bg-green-50'; }
                else if (log.systolic < 130) { statusLabel = '✅ طبيعي'; statusColor = 'text-green-600'; statusBg = 'bg-green-50'; }
                else if (log.systolic < 140) { statusLabel = '🟡 مرتفع قليلاً'; statusColor = 'text-amber-700'; statusBg = 'bg-amber-50'; }
                else { statusLabel = '🔴 ضغط مرتفع'; statusColor = 'text-red-700'; statusBg = 'bg-red-50'; }
              }
              return (
                <div key={idx} className={`${statusBg} rounded-xl p-4 flex justify-between items-center border border-gray-100`}>
                  <div>
                    <p className="font-bold text-gray-900">
                      {log.type === 'bloodSugar' ? `🩸 سكر: ${log.bloodSugar} mg/dL` : `💓 ضغط: ${log.systolic}/${log.diastolic} mmHg`}
                    </p>
                    <p className={`text-sm font-bold mt-0.5 ${statusColor}`}>{statusLabel}</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{log.timestamp}</p>
                  </div>
                </div>
              );
            })}
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
