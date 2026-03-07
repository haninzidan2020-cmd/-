import React, { useState, useEffect } from 'react';
import { DailyIntake, DailyGoals } from '../types';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

interface Props {
  intake: DailyIntake;
  goals: DailyGoals;
}

export default function Alerts({ intake, goals }: Props) {
  const [showSugarPopup, setShowSugarPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  useEffect(() => {
    if (intake.sugar > goals.sugar && !hasShownPopup) {
      setShowSugarPopup(true);
      setHasShownPopup(true);
    }
  }, [intake.sugar, goals.sugar, hasShownPopup]);

  const alerts = [];

  // General Exceeding Alerts
  if (intake.protein > goals.protein) {
    alerts.push({
      id: 'high-protein',
      type: 'warning',
      message: `لقد تجاوزت هدف البروتين اليومي بـ ${Number((intake.protein - goals.protein).toFixed(1))} جم.`,
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    });
  }

  if (intake.carbs > goals.carbs) {
    alerts.push({
      id: 'high-carbs',
      type: 'warning',
      message: `لقد تجاوزت هدف النشويات اليومي بـ ${Number((intake.carbs - goals.carbs).toFixed(1))} جم.`,
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    });
  }

  if (intake.calories > goals.calories) {
    alerts.push({
      id: 'high-calories',
      type: 'danger',
      message: `لقد تجاوزت السعرات الحرارية المسموحة بـ ${Number((intake.calories - goals.calories).toFixed(0))} سعر حراري!`,
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
    });
  }

  // Sugar Alert (80% to 100%)
  if (intake.sugar >= goals.sugar * 0.8 && intake.sugar <= goals.sugar) {
    alerts.push({
      id: 'warning-sugar',
      type: 'warning',
      message: 'تحذير: لقد اقتربت من الحد الأقصى المسموح به من السكر اليوم!',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    });
  } else if (intake.sugar > goals.sugar) {
    alerts.push({
      id: 'high-sugar',
      type: 'danger',
      message: 'خطر، استهلاك السكر مرتفع! لقد تجاوزت الحد الأقصى المسموح به (50 جم).',
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
    });
  }

  // Water Alert
  if (intake.water < goals.water * 0.5) {
    alerts.push({
      id: 'low-water',
      type: 'warning',
      message: 'جسمك محتاج ميه دلوقتي! لم تصل حتى لنصف احتياجك اليومي.',
      icon: <Info className="w-5 h-5 text-amber-600" />,
    });
  }

  // Veggies/Fiber Encouragement
  if (intake.veggies > 0) {
    alerts.push({
      id: 'good-fiber',
      type: 'success',
      message: 'الألياف تساعد في تقليل سرعة امتصاص السكريات التي تناولتها.',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    });
  }

  return (
    <>
      {showSugarPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border-t-4 border-red-600 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowSugarPopup(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">تجاوز الحد الأقصى!</h3>
              <p className="text-red-600 font-medium">
                ⚠️ تحذير: لقد تجاوزت الحد المسموح به من السكر اليوم! هذا قد يؤدي للخمول وزيادة الوزن.
              </p>
              <button
                onClick={() => setShowSugarPopup(false)}
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-xl transition-colors"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="space-y-3 mb-8">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                alert.type === 'danger'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : alert.type === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <div className="mt-0.5">{alert.icon}</div>
              <p className="font-medium">{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
