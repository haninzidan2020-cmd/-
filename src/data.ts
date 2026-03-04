import { FoodItem } from './types';

export const foodDatabase: FoodItem[] = [
  // Meats
  { id: 'chicken', name: 'دجاج (صدور)', category: 'meat', protein: 31, carbs: 0, sugar: 0, fiber: 0 },
  { id: 'beef', name: 'لحم بقري', category: 'meat', protein: 26, carbs: 0, sugar: 0, fiber: 0 },
  { id: 'fish', name: 'سمك (بلطي)', category: 'meat', protein: 26, carbs: 0, sugar: 0, fiber: 0 },
  
  // Carbs
  { id: 'rice', name: 'أرز مطبوخ', category: 'carbs', protein: 2.7, carbs: 28, sugar: 0.1, fiber: 0.4 },
  { id: 'pasta', name: 'مكرونة مطبوخة', category: 'carbs', protein: 5, carbs: 31, sugar: 0.6, fiber: 1.8 },
  { id: 'bread', name: 'عيش بلدي', category: 'carbs', protein: 9, carbs: 50, sugar: 2, fiber: 4 },
  { id: 'potato', name: 'بطاطس مسلوقة', category: 'carbs', protein: 2, carbs: 20, sugar: 0.8, fiber: 1.8 },
  
  // Sugars
  { id: 'chocolate', name: 'شوكولاتة', category: 'sugars', protein: 5, carbs: 60, sugar: 50, fiber: 7 },
  { id: 'basbousa', name: 'بسبوسة / حلويات شرقية', category: 'sugars', protein: 3, carbs: 65, sugar: 40, fiber: 1 },
  { id: 'juice', name: 'عصير مُحلى', category: 'sugars', protein: 0.5, carbs: 10, sugar: 10, fiber: 0.2 },
  
  // Vegetables
  { id: 'leafy', name: 'خضروات ورقية (جرجير/سبانخ)', category: 'vegetables', protein: 2, carbs: 3, sugar: 1, fiber: 2 },
  { id: 'watery', name: 'خضروات مائية (خيار/طماطم)', category: 'vegetables', protein: 1, carbs: 3, sugar: 2, fiber: 1, water: 95 },
  { id: 'starchy_veg', name: 'خضروات نشوية (بسلة/فاصوليا)', category: 'vegetables', protein: 5, carbs: 14, sugar: 3, fiber: 5 },
  
  // Egyptian
  { id: 'foul', name: 'فول مدمس', category: 'egyptian', protein: 8, carbs: 18, sugar: 1, fiber: 5 },
  { id: 'taameya', name: 'طعمية (فلافل)', category: 'egyptian', protein: 13, carbs: 31, sugar: 1, fiber: 4 },
  { id: 'arish', name: 'جبنة قريش', category: 'egyptian', protein: 11, carbs: 3, sugar: 3, fiber: 0 },
  
  // Composite Meals
  { id: 'goulash_meat', name: 'جلاش باللحمة المفرومة', category: 'composite', protein: 12, carbs: 25, sugar: 2, fiber: 2, fats: 15 },
  { id: 'macaroni_bechamel', name: 'مكرونة بشاميل', category: 'composite', protein: 10, carbs: 20, sugar: 3, fiber: 1.5, fats: 12 },
  { id: 'kabsa', name: 'كبسة دجاج', category: 'composite', protein: 15, carbs: 30, sugar: 2, fiber: 2, fats: 10 },
  { id: 'pizza', name: 'بيتزا مارجريتا', category: 'composite', protein: 11, carbs: 33, sugar: 3, fiber: 2, fats: 10 },
];
