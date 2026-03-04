import React, { useState } from 'react';
import { FoodItem } from '../types';
import { foodDatabase } from '../data';
import { Plus, Search, Salad, Edit3 } from 'lucide-react';

interface Props {
  onAddFood: (food: FoodItem, amount: number) => void;
  onAddWater: (amount: number) => void;
}

export default function FoodLogger({ onAddFood, onAddWater }: Props) {
  const [activeTab, setActiveTab] = useState<'database' | 'manual'>('database');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [amount, setAmount] = useState<number>(100);

  // Manual Entry State
  const [manualFood, setManualFood] = useState({
    name: '',
    protein: '',
    carbs: '',
    sugar: '',
    calories: '',
    amount: '100',
  });

  const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'meat', name: 'اللحوم' },
    { id: 'carbs', name: 'النشويات' },
    { id: 'sugars', name: 'السكريات' },
    { id: 'vegetables', name: 'الخضروات' },
    { id: 'egyptian', name: 'أكلات مصرية' },
    { id: 'composite', name: 'وجبات مركبة' },
  ];

  const filteredFoods = foodDatabase.filter((food) => {
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFood && amount > 0) {
      onAddFood(selectedFood, amount);
      setSelectedFood(null);
      setAmount(100);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const food: FoodItem = {
      id: 'manual_' + Date.now(),
      name: manualFood.name || 'وجبة مضافة يدوياً',
      category: 'composite',
      protein: Number(manualFood.protein) || 0,
      carbs: Number(manualFood.carbs) || 0,
      sugar: Number(manualFood.sugar) || 0,
      calories: Number(manualFood.calories) || 0,
      fiber: 0,
    };
    onAddFood(food, Number(manualFood.amount) || 100);
    setManualFood({ name: '', protein: '', carbs: '', sugar: '', calories: '', amount: '100' });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-600" />
          إضافة وجبة أو مشروب
        </h2>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'database' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            من القائمة
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'manual' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            إضافة يدوية
          </button>
        </div>
      </div>

      {activeTab === 'database' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Food Selection */}
          <div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="relative mb-4">
              <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن طعام..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100">
              {filteredFoods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className={`w-full text-right px-4 py-3 hover:bg-emerald-50 transition-colors flex justify-between items-center ${
                    selectedFood?.id === food.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''
                  }`}
                >
                  <span className="font-medium text-gray-800">{food.name}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    لكل 100 جم
                  </span>
                </button>
              ))}
              {filteredFoods.length === 0 && (
                <div className="p-4 text-center text-gray-500 text-sm">لا توجد نتائج</div>
              )}
            </div>
          </div>

          {/* Add Form & Quick Actions */}
          <div className="space-y-6">
            {selectedFood ? (
              <form onSubmit={handleAddFood} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">إضافة {selectedFood.name}</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">الكمية بالجرام</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    required
                    min="1"
                  />
                </div>
                <div className="flex gap-2 text-xs text-gray-500 mb-4 bg-white p-3 rounded-lg border border-gray-100">
                  <span>بروتين: {((selectedFood.protein * amount) / 100).toFixed(1)} جم</span>
                  <span>•</span>
                  <span>نشويات: {((selectedFood.carbs * amount) / 100).toFixed(1)} جم</span>
                  <span>•</span>
                  <span>سكر: {((selectedFood.sugar * amount) / 100).toFixed(1)} جم</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-xl transition-colors"
                >
                  إضافة لليوميات
                </button>
              </form>
            ) : (
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 h-full flex flex-col items-center justify-center text-gray-400 text-center">
                <p>اختر طعاماً من القائمة لإضافته</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => {
                  const salad = foodDatabase.find(f => f.id === 'leafy');
                  if (salad) onAddFood(salad, 200);
                }}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <Salad className="w-6 h-6" />
                <span className="font-medium text-sm">طبق سلطة (200 جم)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-2xl mx-auto">
          <h3 className="font-bold text-gray-800 mb-6 text-center">إدخال وجبة يدوياً (لكل 100 جرام)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الوجبة</label>
              <input
                type="text"
                value={manualFood.name}
                onChange={(e) => setManualFood({ ...manualFood, name: e.target.value })}
                placeholder="مثال: مكرونة بشاميل بيتي"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">بروتين (جم)</label>
                <input
                  type="number"
                  value={manualFood.protein}
                  onChange={(e) => setManualFood({ ...manualFood, protein: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نشويات (جم)</label>
                <input
                  type="number"
                  value={manualFood.carbs}
                  onChange={(e) => setManualFood({ ...manualFood, carbs: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">سكر (جم)</label>
                <input
                  type="number"
                  value={manualFood.sugar}
                  onChange={(e) => setManualFood({ ...manualFood, sugar: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">سعرات (سعر)</label>
                <input
                  type="number"
                  value={manualFood.calories}
                  onChange={(e) => setManualFood({ ...manualFood, calories: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">الكمية المستهلكة (بالجرام)</label>
              <input
                type="number"
                value={manualFood.amount}
                onChange={(e) => setManualFood({ ...manualFood, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
                min="1"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة لليوميات
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
