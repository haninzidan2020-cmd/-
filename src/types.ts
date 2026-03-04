export interface UserProfile {
  id: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'moderate' | 'active';
  waterReminderInterval?: number;
  isDiabetic?: boolean;
  hasHypertension?: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'meat' | 'carbs' | 'sugars' | 'vegetables' | 'egyptian' | 'composite';
  protein: number; 
  carbs: number; 
  sugar: number; 
  fiber?: number; 
  water?: number; 
  fats?: number; 
  calories?: number; 
}

export interface MedicalLog {
  id: string;
  time: string; 
  type: 'bloodSugar' | 'bloodPressure';
  bloodSugar?: number;
  systolic?: number;
  diastolic?: number;
}

// النوع الجديد لتسجيل الأكل بالتفصيل عشان نقدر نحذفه
export interface ConsumedFood {
  id: string;
  food: FoodItem;
  amount: number;
  time: string;
}

export interface DailyIntake {
  water: number; 
  protein: number; 
  carbs: number; 
  sugar: number; 
  veggies: number; 
  fiber: number; 
  calories: number; 
  medicalLogs: MedicalLog[]; 
  consumedFoods: ConsumedFood[]; // قائمة الأكل المستهلك
  walkingMinutes: number; // دقايق المشي اللي عملها
}

export interface DailyGoals {
  water: number;
  protein: number;
  carbs: number;
  sugar: number;
  veggies: number;
  fiber: number;
  calories: number; 
  walkingMinutes: number; // هدف المشي المطلوب
}

export interface DailyRecord {
  id: string;
  date: string;
  intake: DailyIntake;
  goals: DailyGoals;
}