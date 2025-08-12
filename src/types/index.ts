// 用户档案类型
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  diagnosis_date?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  has_intestinal_metaplasia: boolean;
  throat_foreign_sensation: boolean;
  medications: any[];
  allergies: string[];
  created_at: string;
  updated_at: string;
}

// 症状记录类型
export interface SymptomRecord {
  id: string;
  user_id: string;
  recorded_at: string;
  pain_level: number;
  throat_discomfort: boolean;
  bloating: boolean;
  acid_reflux: boolean;
  nausea: boolean;
  appetite_level: number;
  triggers: string[];
  notes?: string;
  created_at: string;
}

// 食物类型
export interface Food {
  id: string;
  name: string;
  category: string;
  safety_level: 'safe' | 'caution' | 'avoid';
  calories_per_100g?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  fiber?: number;
  preparation_tips?: string;
  alternatives?: string[];
  for_throat_discomfort: boolean;
  created_at: string;
}

// 饮食记录类型
export interface MealRecord {
  id: string;
  user_id: string;
  meal_date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Array<{
    food_id: string;
    amount: number;
    unit: string;
  }>;
  symptoms_after?: any;
  photo_url?: string;
  notes?: string;
  created_at: string;
}

// 健康洞察类型
export interface HealthInsight {
  id: string;
  user_id: string;
  insight_date: string;
  type: 'daily' | 'weekly' | 'monthly';
  metrics: any;
  recommendations: string[];
  risk_level: 'low' | 'medium' | 'high';
  created_at: string;
}