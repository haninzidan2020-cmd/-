export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'moderate' | 'active';
  isDiabetic: boolean;
  hasHypertension: boolean;
}

export interface FoodItem {
  id?: string;
  name: string;
  category: 'protein' | 'carbs' | 'vegetables' | 'fruits' | 'dairy' | 'fats' | 'other';
  protein: number;
  carbs: number;
  sugar: number;
  fiber?: number;
  fats?: number;
  water?: number;
  calories?: number;
}

export interface ConsumedFood {
  id: string;
  food: FoodItem;
  amount: number;
  time: string;
}

export interface MedicalLog {
  type: 'bloodSugar' | 'bloodPressure';
  bloodSugar?: number;
  systolic?: number;
  diastolic?: number;
  timestamp: string;
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
  consumedFoods: ConsumedFood[];
  walkingMinutes: number;
}

export interface DailyGoals {
  water: number;
  protein: number;
  carbs: number;
  sugar: number;
  veggies: number;
  fiber: number;
  calories: number;
  walkingMinutes: number;
}

export interface DailyRecord {
  id: string;
  date: string;
  intake: DailyIntake;
  goals: DailyGoals;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  timestamp: number;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  withFood: boolean;
  color: string;
}

export interface Reminder {
  id: string;
  type: 'medicine' | 'water';
  time: string;
  completed: boolean;
  medicineId?: string;
}
