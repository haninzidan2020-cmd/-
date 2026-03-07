import React, { useState } from 'react';
import { UserProfile } from '../types';

interface Props {
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
  buttonText?: string;
  hideTitle?: boolean;
}

export default function ProfileSetup({ onSave, initialProfile, buttonText = 'حفظ وبدء الحساب', hideTitle = false }: Props) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    id: Date.now().toString(), // إنشاء كود فريد للمستخدم الجديد
    name: '',
    age: 30,
    height: 170,
    weight: 70,
    gender: 'male',
    activityLevel: 'moderate',
    waterReminderInterval: 60,
    isDiabetic: false,
    hasHypertension: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'gender' || name === 'activityLevel' || name === 'name' ? value : Number(value)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      alert("برجاء إدخال اسم المستخدم");
      return;
    }
    onSave(profile);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {!hideTitle && <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">إعداد الملف الشخصي</h2>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} placeholder="مثال: أحمد، الوالدة، إلخ..." className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">السن (سنوات)</label>
          <input type="number" name="age" value={profile.age} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" required min="10" max="120" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الطول (سم)</label>
            <input type="number" name="height" value={profile.height} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" required min="100" max="250" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الوزن (كجم)</label>
            <input type="number" name="weight" value={profile.weight} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" required min="30" max="300" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الجنس</label>
            <select name="gender" value={profile.gender} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مستوى النشاط</label>
            <select name="activityLevel" value={profile.activityLevel} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="sedentary">خامل</option>
              <option value="moderate">نشاط متوسط</option>
              <option value="active">رياضي</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تنبيه شرب المياه (بالدقائق)</label>
          <input type="number" name="waterReminderInterval" value={profile.waterReminderInterval || 60} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" required min="15" max="300" />
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4 space-y-3">
          <h3 className="font-bold text-gray-800 text-sm mb-2">الحالة الصحية (اختياري)</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="isDiabetic" checked={profile.isDiabetic || false} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
            <span className="text-gray-700 font-medium">مريض سكري</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="hasHypertension" checked={profile.hasHypertension || false} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
            <span className="text-gray-700 font-medium">مريض ضغط</span>
          </label>
        </div>

        <button type="submit" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors">
          {buttonText}
        </button>
      </form>
    </div>
  );
}