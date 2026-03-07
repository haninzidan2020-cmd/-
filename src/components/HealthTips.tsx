import React from 'react';
import { UserProfile, DailyIntake, DailyGoals } from '../types';
import { Lightbulb, Heart, Droplet, Activity, Apple, CheckCircle, Sun } from 'lucide-react';

interface HealthTipsProps {
  profile: UserProfile;
  intake: DailyIntake;
  goals: DailyGoals;
}

export default function HealthTips({ profile, intake, goals }: HealthTipsProps) {
  
  const tips = [
    {
      title: 'شرب الماء أول الصباح',
      icon: Droplet,
      color: 'from-blue-500 to-cyan-500',
      tip: 'ابدأ يومك بكوبين من الماء الفاتر على الريق لتنشيط الجسم وتحفيز عملية الأيض.'
    },
    {
      title: 'المشي بعد الوجبات',
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      tip: 'امشِ 10-15 دقيقة بعد كل وجبة لتحسين الهضم وضبط مستوى السكر في الدم.'
    },
    {
      title: 'البروتين في كل وجبة',
      icon: Apple,
      color: 'from-orange-500 to-red-500',
      tip: 'احرص على تناول مصدر بروتين في كل وجبة (بيض، لحوم، أسماك، بقوليات) للشعور بالشبع لفترة أطول.'
    },
    {
      title: 'النوم الكافي',
      icon: Sun,
      color: 'from-indigo-500 to-purple-500',
      tip: 'النوم 7-8 ساعات يومياً ضروري لتنظيم الهرمونات والحفاظ على وزن صحي.'
    },
    {
      title: 'الخضراوات أولاً',
      icon: Heart,
      color: 'from-green-400 to-teal-500',
      tip: 'ابدأ وجبتك بطبق سلطة كبير - الألياف تساعد على الشبع وتحسن الهضم.'
    },
  ];

  // Check achievements
  const achievements = [];
  
  if ((intake.water / goals.water) >= 1) {
    achievements.push({
      title: 'أكملت هدف المياه! 💧',
      message: 'ممتاز! شرب الماء الكافي يحسن الطاقة والتركيز والبشرة.',
      color: 'from-blue-500 to-cyan-500'
    });
  }

  if ((intake.walkingMinutes / goals.walkingMinutes) >= 1) {
    achievements.push({
      title: 'أكملت هدف المشي! 🚶',
      message: 'رائع! النشاط البدني المنتظم يحسن صحة القلب والمزاج.',
      color: 'from-green-500 to-emerald-500'
    });
  }

  if ((intake.protein / goals.protein) >= 1) {
    achievements.push({
      title: 'أكملت هدف البروتين! 🥩',
      message: 'عظيم! البروتين الكافي يساعد في بناء العضلات والشبع.',
      color: 'from-orange-500 to-red-500'
    });
  }

  // Personalized tips
  const personalizedTips = [];

  const waterPercentage = (intake.water / goals.water) * 100;
  if (waterPercentage < 50) {
    personalizedTips.push({
      title: 'زد شرب الماء!',
      tip: `شربت فقط ${intake.water.toFixed(1)} لتر من ${goals.water} لتر. اشرب كوب ماء كل ساعة للوصول لهدفك.`,
      color: 'from-blue-500 to-cyan-500',
      icon: Droplet
    });
  }

  const walkingPercentage = (intake.walkingMinutes / goals.walkingMinutes) * 100;
  if (walkingPercentage < 50) {
    personalizedTips.push({
      title: 'حان وقت الحركة!',
      tip: `مشيت ${intake.walkingMinutes || 0} دقيقة فقط من ${goals.walkingMinutes} دقيقة. جرب المشي 15 دقيقة الآن!`,
      color: 'from-purple-500 to-indigo-500',
      icon: Activity
    });
  }

  const proteinPercentage = (intake.protein / goals.protein) * 100;
  if (proteinPercentage < 40) {
    personalizedTips.push({
      title: 'نقص في البروتين',
      tip: `تناولت ${intake.protein.toFixed(0)}جم فقط من ${goals.protein}جم. أضف بيضة أو قطعة دجاج لوجبتك القادمة.`,
      color: 'from-red-500 to-rose-500',
      icon: Apple
    });
  }

  return (
    <div className="space-y-6">
      
      {/* Daily Tip */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <Lightbulb className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">💡 نصيحة اليوم</p>
              <h2 className="text-2xl font-black">نصائح صحية مهمة</h2>
            </div>
          </div>
          <p className="text-lg leading-relaxed font-medium text-white/95">
            اتبع هذه النصائح البسيطة يومياً لحياة أكثر صحة ونشاطاً. التغييرات الصغيرة تصنع فرقاً كبيراً!
          </p>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            إنجازات اليوم
          </h3>
          <div className="grid gap-3">
            {achievements.map((achievement, idx) => (
              <div key={idx} className={`bg-gradient-to-r ${achievement.color} rounded-2xl p-5 shadow-lg text-white`}>
                <h4 className="text-lg font-black mb-2">{achievement.title}</h4>
                <p className="text-sm text-white/90 font-medium">{achievement.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Tips */}
      {personalizedTips.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-orange-600" />
            نصائح مخصصة لك
          </h3>
          <div className="grid gap-3">
            {personalizedTips.map((tip, idx) => (
              <div key={idx} className={`bg-gradient-to-r ${tip.color} rounded-2xl p-5 shadow-lg text-white`}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-black mb-2">{tip.title}</h4>
                    <p className="text-sm text-white/95 font-medium leading-relaxed">{tip.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Health Tips */}
      <div className="space-y-3">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-600" />
          نصائح صحية عامة
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${tip.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <tip.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-black text-gray-900 text-lg">{tip.title}</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Diabetes Tips */}
      {profile.isDiabetic && (
        <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-3xl p-6 shadow-xl text-white">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
            <Heart className="w-7 h-7" />
            نصائح خاصة لمريض السكري
          </h3>
          <div className="space-y-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <p className="text-sm text-white/90 font-medium leading-relaxed">
                • تناول وجبات صغيرة كل 3-4 ساعات للحفاظ على استقرار مستوى السكر في الدم
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <p className="text-sm text-white/90 font-medium leading-relaxed">
                • ابتعد عن النشويات البيضاء (الخبز الأبيض، الأرز الأبيض) واستبدلها بالأسمر
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <p className="text-sm text-white/90 font-medium leading-relaxed">
                • اشرب الماء بكثرة - يساعد على التحكم في مستوى السكر
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hypertension Tips */}
      {profile.hasHypertension && (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 shadow-xl text-white">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
            <Heart className="w-7 h-7" />
            نصائح خاصة لضغط الدم
          </h3>
          <div className="space-y-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <p className="text-sm text-white/90 font-medium leading-relaxed">
                • تجنب الملح الزائد والأطعمة المعلبة - استبدل الملح بالليمون والأعشاب
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <p className="text-sm text-white/90 font-medium leading-relaxed">
                • مارس تمارين التنفس والاسترخاء يومياً للتحكم في التوتر
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <p className="text-sm text-white/90 font-medium leading-relaxed">
                • اشرب الماء بكمية كافية - يساعد على تنظيم ضغط الدم
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Health Resources */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-yellow-600" />
          قواعد صحية ذهبية
        </h3>
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
            <h4 className="font-bold mb-2 text-green-900">🥗 التغذية الصحية</h4>
            <p className="text-sm text-gray-700 leading-relaxed">تناول طعام متنوع يشمل جميع المجموعات الغذائية بكميات متوازنة.</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
            <h4 className="font-bold mb-2 text-blue-900">💪 النشاط البدني</h4>
            <p className="text-sm text-gray-700 leading-relaxed">مارس 150 دقيقة من النشاط المعتدل أسبوعياً (30 دقيقة × 5 أيام).</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100">
            <h4 className="font-bold mb-2 text-purple-900">🧘 الصحة النفسية</h4>
            <p className="text-sm text-gray-700 leading-relaxed">خصص وقتاً للاسترخاء والهوايات - الصحة النفسية لا تقل أهمية عن الجسدية.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
