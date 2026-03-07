import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Clock, Pill, Droplet, Check, X } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  withFood: boolean;
  color: string;
}

interface Reminder {
  id: string;
  type: 'medicine' | 'water';
  time: string;
  completed: boolean;
  medicineId?: string;
}

interface MedicineRemindersProps {
  profileId: string;
}

export default function MedicineReminders({ profileId }: MedicineRemindersProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    times: [''],
    withFood: false,
    color: 'from-blue-500 to-cyan-500'
  });

  const colors = [
    { value: 'from-blue-500 to-cyan-500', label: 'أزرق' },
    { value: 'from-green-500 to-emerald-500', label: 'أخضر' },
    { value: 'from-red-500 to-rose-500', label: 'أحمر' },
    { value: 'from-purple-500 to-indigo-500', label: 'بنفسجي' },
    { value: 'from-orange-500 to-yellow-500', label: 'برتقالي' },
    { value: 'from-pink-500 to-rose-500', label: 'وردي' },
  ];

  useEffect(() => {
    // Load medicines from localStorage
    const saved = localStorage.getItem(`medicines_${profileId}`);
    if (saved) {
      setMedicines(JSON.parse(saved));
    }

    // Load today's reminders
    const today = new Date().toISOString().split('T')[0];
    const savedReminders = localStorage.getItem(`reminders_${profileId}_${today}`);
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    } else {
      generateTodayReminders();
    }
  }, [profileId]);

  useEffect(() => {
    localStorage.setItem(`medicines_${profileId}`, JSON.stringify(medicines));
    generateTodayReminders();
  }, [medicines]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`reminders_${profileId}_${today}`, JSON.stringify(reminders));
  }, [reminders]);

  const generateTodayReminders = () => {
    const today = new Date().toISOString().split('T')[0];
    const newReminders: Reminder[] = [];

    // Add medicine reminders
    medicines.forEach(med => {
      med.times.forEach(time => {
        newReminders.push({
          id: `${med.id}-${time}`,
          type: 'medicine',
          time,
          completed: false,
          medicineId: med.id
        });
      });
    });

    // Add water reminders (every 2 hours from 8 AM to 10 PM)
    const waterTimes = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    waterTimes.forEach(time => {
      newReminders.push({
        id: `water-${time}`,
        type: 'water',
        time,
        completed: false
      });
    });

    // Sort by time
    newReminders.sort((a, b) => a.time.localeCompare(b.time));
    
    setReminders(newReminders);
  };

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage || newMedicine.times[0] === '') return;

    const medicine: Medicine = {
      id: Date.now().toString(),
      name: newMedicine.name,
      dosage: newMedicine.dosage,
      times: newMedicine.times.filter(t => t !== ''),
      withFood: newMedicine.withFood,
      color: newMedicine.color
    };

    setMedicines([...medicines, medicine]);
    setNewMedicine({
      name: '',
      dosage: '',
      times: [''],
      withFood: false,
      color: 'from-blue-500 to-cyan-500'
    });
    setShowAddMedicine(false);
  };

  const handleDeleteMedicine = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الدواء؟')) {
      setMedicines(medicines.filter(m => m.id !== id));
    }
  };

  const handleCompleteReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const addTimeSlot = () => {
    setNewMedicine({ ...newMedicine, times: [...newMedicine.times, ''] });
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...newMedicine.times];
    newTimes[index] = value;
    setNewMedicine({ ...newMedicine, times: newTimes });
  };

  const removeTimeSlot = (index: number) => {
    setNewMedicine({ ...newMedicine, times: newMedicine.times.filter((_, i) => i !== index) });
  };

  const getCurrentReminders = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return reminders.filter(r => r.time <= currentTime && !r.completed);
  };

  const upcomingReminders = reminders.filter(r => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return r.time > currentTime;
  });

  const currentReminders = getCurrentReminders();
  const completedToday = reminders.filter(r => r.completed).length;

  return (
    <div className="space-y-6">
      
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg">
          <Pill className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-black">{medicines.length}</p>
          <p className="text-sm font-medium opacity-90">دواء مسجل</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-5 text-white shadow-lg">
          <Check className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-black">{completedToday}</p>
          <p className="text-sm font-medium opacity-90">جرعة مكتملة</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg">
          <Bell className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-black">{currentReminders.length}</p>
          <p className="text-sm font-medium opacity-90">تذكير حالي</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-5 text-white shadow-lg">
          <Clock className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-black">{upcomingReminders.length}</p>
          <p className="text-sm font-medium opacity-90">تذكير قادم</p>
        </div>
      </div>

      {/* Current Reminders Alert */}
      {currentReminders.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl p-6 text-white shadow-2xl border-4 border-white animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Bell className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h3 className="text-2xl font-black">تنبيه! حان الوقت</h3>
              <p className="text-sm text-white/90 font-medium">{currentReminders.length} تذكير بانتظارك</p>
            </div>
          </div>
          <div className="space-y-2">
            {currentReminders.map(reminder => {
              const medicine = reminder.medicineId ? medicines.find(m => m.id === reminder.medicineId) : null;
              return (
                <div key={reminder.id} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {reminder.type === 'medicine' ? (
                        <Pill className="w-6 h-6" />
                      ) : (
                        <Droplet className="w-6 h-6" />
                      )}
                      <div>
                        <p className="font-black text-lg">
                          {reminder.type === 'medicine' && medicine ? medicine.name : 'اشرب كوب ماء'}
                        </p>
                        {reminder.type === 'medicine' && medicine && (
                          <p className="text-sm text-white/80">{medicine.dosage} {medicine.withFood && '• مع الطعام'}</p>
                        )}
                        <p className="text-xs text-white/70">الوقت: {reminder.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCompleteReminder(reminder.id)}
                      className="bg-white/30 hover:bg-white/50 backdrop-blur-sm p-3 rounded-xl transition-all"
                    >
                      <Check className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Medicines List */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Pill className="w-7 h-7 text-emerald-600" />
            أدويتي
          </h3>
          <button
            onClick={() => setShowAddMedicine(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-5 h-5" /> إضافة دواء
          </button>
        </div>

        {medicines.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">لم تضف أي أدوية بعد</p>
            <p className="text-sm text-gray-400 mt-1">اضغط "إضافة دواء" لبدء التتبع</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {medicines.map(medicine => (
              <div key={medicine.id} className={`bg-gradient-to-br ${medicine.color} rounded-2xl p-5 text-white shadow-lg`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-black mb-1">{medicine.name}</h4>
                    <p className="text-sm text-white/90 font-medium">{medicine.dosage}</p>
                    {medicine.withFood && (
                      <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-lg text-xs font-bold">
                        🍽️ مع الطعام
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteMedicine(medicine.id)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-white/80 mb-2">مواعيد الجرعات:</p>
                  <div className="flex flex-wrap gap-2">
                    {medicine.times.map((time, idx) => (
                      <div key={idx} className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-bold text-sm">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-7 h-7 text-blue-600" />
          جدول اليوم
        </h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {reminders.map(reminder => {
            const medicine = reminder.medicineId ? medicines.find(m => m.id === reminder.medicineId) : null;
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const isPast = reminder.time <= currentTime;

            return (
              <div
                key={reminder.id}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  reminder.completed
                    ? 'bg-green-50 border-green-200 opacity-60'
                    : isPast
                    ? 'bg-red-50 border-red-200 shadow-md'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    reminder.completed ? 'bg-green-200' : isPast ? 'bg-red-200' : 'bg-gray-200'
                  }`}>
                    {reminder.type === 'medicine' ? (
                      <Pill className={`w-6 h-6 ${reminder.completed ? 'text-green-700' : isPast ? 'text-red-700' : 'text-gray-700'}`} />
                    ) : (
                      <Droplet className={`w-6 h-6 ${reminder.completed ? 'text-green-700' : isPast ? 'text-blue-700' : 'text-gray-700'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-lg text-gray-900">{reminder.time}</span>
                      {isPast && !reminder.completed && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">فاتك!</span>
                      )}
                    </div>
                    <p className="font-bold text-gray-700">
                      {reminder.type === 'medicine' && medicine ? medicine.name : 'اشرب كوب ماء'}
                    </p>
                    {reminder.type === 'medicine' && medicine && (
                      <p className="text-sm text-gray-500">{medicine.dosage}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleCompleteReminder(reminder.id)}
                  className={`p-3 rounded-xl transition-all ${
                    reminder.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 hover:bg-emerald-500 hover:text-white text-gray-600'
                  }`}
                >
                  <Check className="w-6 h-6" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="text-2xl font-black text-gray-900">إضافة دواء جديد</h3>
              <button
                onClick={() => setShowAddMedicine(false)}
                className="bg-gray-100 p-2 rounded-xl text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اسم الدواء *</label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  placeholder="مثال: أسبرين"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الجرعة *</label>
                <input
                  type="text"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                  placeholder="مثال: 100 مجم"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">مواعيد الجرعات *</label>
                {newMedicine.times.map((time, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateTime(idx, e.target.value)}
                      className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold"
                    />
                    {newMedicine.times.length > 1 && (
                      <button
                        onClick={() => removeTimeSlot(idx)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-4 rounded-xl transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addTimeSlot}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" /> إضافة موعد آخر
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اللون</label>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setNewMedicine({ ...newMedicine, color: color.value })}
                      className={`p-4 rounded-xl bg-gradient-to-r ${color.value} text-white font-bold text-sm transition-all ${
                        newMedicine.color === color.value ? 'ring-4 ring-gray-900 scale-105' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  id="withFood"
                  checked={newMedicine.withFood}
                  onChange={(e) => setNewMedicine({ ...newMedicine, withFood: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <label htmlFor="withFood" className="font-bold text-gray-700 cursor-pointer">
                  يؤخذ مع الطعام
                </label>
              </div>

              <button
                onClick={handleAddMedicine}
                disabled={!newMedicine.name || !newMedicine.dosage || newMedicine.times[0] === ''}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:cursor-not-allowed"
              >
                حفظ الدواء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
