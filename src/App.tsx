import React, { useState, useEffect } from 'react';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import FoodLogger from './components/FoodLogger';
import Alerts from './components/Alerts';
import Stats from './components/Stats';
import { UserProfile, DailyIntake, DailyGoals, FoodItem, DailyRecord, MedicalLog, ConsumedFood } from './types';
import { Activity, BarChart2, Home, Settings, Users, Plus, Trash2, X, AlertOctagon } from 'lucide-react';

const PROFILES_KEY = 'health_tracker_profiles';
const ACTIVE_PROFILE_KEY = 'health_tracker_active_profile';
const HISTORY_PREFIX = 'health_tracker_history_';
const TODAY_PREFIX = 'health_tracker_today_';
const LAST_DATE_PREFIX = 'health_tracker_last_date_';

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'stats'>('today');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showProfileSwitch, setShowProfileSwitch] = useState(false);
  const [showMedicalWarning, setShowMedicalWarning] = useState<{show: boolean, message: string}>({show: false, message: ''});
  
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(PROFILES_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => localStorage.getItem(ACTIVE_PROFILE_KEY));
  const profile = profiles.find(p => p.id === activeProfileId) || null;

  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [intake, setIntake] = useState<DailyIntake>({ water: 0, protein: 0, carbs: 0, sugar: 0, veggies: 0, fiber: 0, calories: 0, medicalLogs: [], consumedFoods: [], walkingMinutes: 0 });
  const [goals, setGoals] = useState<DailyGoals>({ water: 2.5, protein: 100, carbs: 200, sugar: 50, veggies: 500, fiber: 30, calories: 2000, walkingMinutes: 30 });

  useEffect(() => {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    if (activeProfileId) localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId);
    else localStorage.removeItem(ACTIVE_PROFILE_KEY);
  }, [profiles, activeProfileId]);

  useEffect(() => {
    if (!profile) return;
    const historyKey = `${HISTORY_PREFIX}${profile.id}`;
    const todayKey = `${TODAY_PREFIX}${profile.id}`;
    const lastDateKey = `${LAST_DATE_PREFIX}${profile.id}`;

    const savedHistory = localStorage.getItem(historyKey);
    setHistory(savedHistory ? JSON.parse(savedHistory) : []);

    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem(lastDateKey);
    let currentIntake: DailyIntake = { water: 0, protein: 0, carbs: 0, sugar: 0, veggies: 0, fiber: 0, calories: 0, medicalLogs: [], consumedFoods: [], walkingMinutes: 0 };

    let bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age);
    bmr += profile.gender === 'male' ? 5 : -161;
    const activityMultiplier = profile.activityLevel === 'sedentary' ? 1.2 : profile.activityLevel === 'moderate' ? 1.55 : 1.725;
    
    let baseWalking = profile.activityLevel === 'sedentary' ? 30 : profile.activityLevel === 'moderate' ? 45 : 60;
    if (profile.isDiabetic || profile.hasHypertension) baseWalking += 15;

    let calcGoals: DailyGoals = {
      water: profile.hasHypertension ? Number((profile.weight * 0.042).toFixed(1)) : Number((profile.weight * 0.035).toFixed(1)),
      protein: Number((profile.weight * 1.8).toFixed(1)),
      carbs: Number((profile.weight * 4).toFixed(1)),
      sugar: profile.isDiabetic ? 25 : 50,
      veggies: 500,
      fiber: 30,
      calories: Math.round(bmr * activityMultiplier),
      walkingMinutes: baseWalking
    };

    if (lastDate === today) {
      const savedIntake = localStorage.getItem(todayKey);
      if (savedIntake) currentIntake = JSON.parse(savedIntake);
    } else {
      localStorage.setItem(lastDateKey, today);
    }

    if (!currentIntake.consumedFoods) currentIntake.consumedFoods = [];
    if (!currentIntake.medicalLogs) currentIntake.medicalLogs = [];
    if (!currentIntake.walkingMinutes) currentIntake.walkingMinutes = 0;

    setIntake(currentIntake);
    setGoals(calcGoals);
  }, [activeProfileId, profile?.weight, profile?.age, profile?.height, profile?.activityLevel, profile?.isDiabetic, profile?.hasHypertension]);

  useEffect(() => {
    if (profile) localStorage.setItem(`${TODAY_PREFIX}${profile.id}`, JSON.stringify(intake));
  }, [intake, profile]);

  const playWarningSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play();
    } catch (e) { console.log('Audio error'); }
  };

  const handleAddMedicalLog = (log: MedicalLog) => {
    setIntake(prev => {
      const newLogs = [...prev.medicalLogs, log];
      if (log.type === 'bloodSugar' && log.bloodSugar && log.bloodSugar > 180) {
        setGoals(g => ({ ...g, sugar: 10, carbs: Number((g.carbs * 0.8).toFixed(1)), water: Number((g.water + 0.5).toFixed(1)) }));
        playWarningSound();
        setShowMedicalWarning({ show: true, message: `قراءة السكر مرتفعة (${log.bloodSugar})! قمنا بتقليل السكر المسموح وتقليل النشويات، وزيادة هدف المياه لضبط السكر.` });
      }
      if (log.type === 'bloodPressure' && log.systolic && log.systolic >= 140) {
        playWarningSound();
        setShowMedicalWarning({ show: true, message: `قراءة الضغط مرتفعة (${log.systolic}/${log.diastolic})! يرجى تجنب الأملاح تماماً اليوم وزيادة شرب المياه.` });
      }
      return { ...prev, medicalLogs: newLogs };
    });
  };

  const handleAddFood = (food: FoodItem, amount: number) => {
    const multiplier = amount / 100;
    const foodCalories = food.calories || ((food.protein * 4) + (food.carbs * 4) + ((food.fats || 0) * 9));
    const newFoodLog: ConsumedFood = {
      id: Date.now().toString(),
      food,
      amount,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setIntake((prev) => ({
      ...prev,
      protein: prev.protein + (food.protein * multiplier),
      carbs: prev.carbs + (food.carbs * multiplier),
      sugar: prev.sugar + (food.sugar * multiplier),
      veggies: prev.veggies + (food.category === 'vegetables' ? amount : 0),
      fiber: prev.fiber + ((food.fiber || 0) * multiplier),
      water: prev.water + (food.water ? (food.water * multiplier) / 1000 : 0),
      calories: prev.calories + (foodCalories * multiplier),
      consumedFoods: [newFoodLog, ...prev.consumedFoods] 
    }));
  };

  const handleRemoveFood = (logId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الوجبة؟')) return;
    setIntake(prev => {
      const logToRemove = prev.consumedFoods.find(f => f.id === logId);
      if (!logToRemove) return prev;
      const multiplier = logToRemove.amount / 100;
      const food = logToRemove.food;
      const foodCalories = food.calories || ((food.protein * 4) + (food.carbs * 4) + ((food.fats || 0) * 9));

      return {
        ...prev,
        protein: Math.max(0, prev.protein - (food.protein * multiplier)),
        carbs: Math.max(0, prev.carbs - (food.carbs * multiplier)),
        sugar: Math.max(0, prev.sugar - (food.sugar * multiplier)),
        veggies: Math.max(0, prev.veggies - (food.category === 'vegetables' ? logToRemove.amount : 0)),
        fiber: Math.max(0, prev.fiber - ((food.fiber || 0) * multiplier)),
        water: Math.max(0, prev.water - (food.water ? (food.water * multiplier) / 1000 : 0)),
        calories: Math.max(0, prev.calories - (foodCalories * multiplier)),
        consumedFoods: prev.consumedFoods.filter(f => f.id !== logId)
      };
    });
  };

  const handleAddWater = (amount: number) => setIntake(prev => ({ ...prev, water: prev.water + amount }));

  const handleAddWalking = (minutes: number) => setIntake(prev => ({ ...prev, walkingMinutes: (prev.walkingMinutes || 0) + minutes }));

  const handleDeleteRecord = (id: string) => {
    if (!profile) return;
    setHistory(prev => {
      const newHistory = prev.filter(r => r.id !== id);
      localStorage.setItem(`${HISTORY_PREFIX}${profile.id}`, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfiles(prev => {
      const exists = prev.find(p => p.id === newProfile.id);
      return exists ? prev.map(p => p.id === newProfile.id ? newProfile : p) : [...prev, newProfile];
    });
    setActiveProfileId(newProfile.id);
    setShowProfileEdit(false);
    setShowProfileSwitch(false);
  };

  const handleDeleteProfile = (id: string, name: string) => {
    if(confirm(`هل أنت متأكد من حذف (${name}) وجميع بياناته وتقاريره نهائياً؟`)) {
      const newProfiles = profiles.filter(p => p.id !== id);
      setProfiles(newProfiles);
      localStorage.removeItem(`${HISTORY_PREFIX}${id}`);
      localStorage.removeItem(`${TODAY_PREFIX}${id}`);
      localStorage.removeItem(`${LAST_DATE_PREFIX}${id}`);
      
      if (activeProfileId === id) {
        setActiveProfileId(newProfiles.length > 0 ? newProfiles[0].id : null);
      }
    }
  };

  const realTimeHistory = (): DailyRecord[] => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord: DailyRecord = { id: 'today', date: today, intake, goals };
    const filteredHistory = history.filter(r => r.date !== today);
    return [todayRecord, ...filteredHistory];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      
      {/* 🚀 الشريط العلوي الجديد للمبرمج أعلى الواجهة */}
      <div className="bg-emerald-900 text-emerald-50 py-2 px-4 text-xs sm:text-sm flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-1 sm:gap-4 z-20 shadow-inner">
        <span className="font-bold tracking-wide">برمجة وتصميم: م/ مصطفى زيدان</span>
        <span dir="ltr" className="font-medium opacity-90 hover:opacity-100 transition-opacity flex items-center gap-1">
          للدعم والطلبات: 
          <a href="tel:01211638551" className="font-black text-white hover:text-emerald-300 transition-colors">01211638551</a>
        </span>
      </div>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2 text-emerald-600">
              <Activity className="w-8 h-8" />
              <h1 className="text-2xl font-black tracking-tight">صحتك بالدنيا</h1>
            </div>
            {profile && (
              <div className="md:hidden flex items-center gap-2">
                <button onClick={() => setShowProfileSwitch(true)} className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-xl">
                  <Users className="w-4 h-4" /> {profile.name}
                </button>
                <button onClick={() => setShowProfileEdit(true)} className="p-2 text-gray-500 hover:text-emerald-600 bg-gray-100 rounded-xl transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4">
            {profile && (
              <div className="hidden md:flex items-center gap-2">
                <button onClick={() => setShowProfileSwitch(true)} className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors">
                  <Users className="w-4 h-4" /> {profile.name} (تبديل)
                </button>
                <button onClick={() => setShowProfileEdit(true)} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        {!profile ? (
          <ProfileSetup onSave={handleSaveProfile} buttonText="حفظ وبدء الحساب" />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-md mx-auto">
              <button onClick={() => setActiveTab('today')} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'today' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}>
                <Home className="w-4 h-4" /> اليوم
              </button>
              <button onClick={() => setActiveTab('stats')} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'stats' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}>
                <BarChart2 className="w-4 h-4" /> التقارير
              </button>
            </div>

            {activeTab === 'today' ? (
              <div className="space-y-8">
                <Alerts intake={intake} goals={goals} />
<Dashboard 
  intake={intake} 
  goals={goals} 
  profile={profile} 
  onAddMedicalLog={handleAddMedicalLog} 
  onRemoveFood={handleRemoveFood} 
  onAddWalking={handleAddWalking}
  onAddWater={handleAddWater}  // ⚠️ تأكد من وجود هذا السطر
/>
```

                <FoodLogger onAddFood={handleAddFood} onAddWater={handleAddWater} />
              </div>
            ) : (
              <Stats history={realTimeHistory()} profile={profile} onDeleteRecord={handleDeleteRecord} />
            )}
          </div>
        )}
      </main>

      {showMedicalWarning.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border-t-8 border-rose-600 animate-in zoom-in-95 duration-300 text-center">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <AlertOctagon className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">تحذير طبي!</h2>
            <p className="text-gray-700 font-medium mb-6 leading-relaxed">{showMedicalWarning.message}</p>
            <button onClick={() => setShowMedicalWarning({show: false, message: ''})} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md">
              فهمت، سألتزم
            </button>
          </div>
        </div>
      )}

      {showProfileSwitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl relative">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5"/> الأشخاص</h2>
              <button onClick={() => setShowProfileSwitch(false)} className="bg-gray-100 p-1 rounded-lg text-gray-500 hover:text-red-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-3">
              {profiles.map(p => (
                <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border ${p.id === activeProfileId ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <button onClick={() => { setActiveProfileId(p.id); setShowProfileSwitch(false); }} className="flex-1 text-right font-bold text-gray-800">
                    {p.name} {p.id === activeProfileId && <span className="text-xs text-emerald-600 mr-2">(نشط)</span>}
                  </button>
                  <button 
                    onClick={() => handleDeleteProfile(p.id, p.name)} 
                    className="text-red-400 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    title="حذف هذا الشخص"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <button onClick={() => { setShowProfileSwitch(false); setShowProfileEdit(true); setActiveProfileId(null); }} className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl flex justify-center gap-2"><Plus className="w-5 h-5" /> إضافة شخص</button>
            </div>
          </div>
        </div>
      )}
      
      {showProfileEdit && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">{profile ? 'تعديل بيانات الشخص' : 'إضافة شخص جديد'}</h2>
              <button onClick={() => { setShowProfileEdit(false); if (!profile && profiles.length > 0) setActiveProfileId(profiles[0].id); }} className="bg-gray-100 p-1 rounded-lg text-gray-500 hover:text-red-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <ProfileSetup initialProfile={profile} buttonText="حفظ البيانات" hideTitle={true} onSave={handleSaveProfile} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
