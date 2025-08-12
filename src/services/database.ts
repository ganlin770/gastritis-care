import { supabase } from '../config/supabase';
import type { Profile, SymptomRecord, Food, MealRecord, HealthInsight } from '../types';

export const databaseService = {
  // 用户档案管理
  profiles: {
    async get(userId: string): Promise<Profile | null> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },

    async update(userId: string, updates: Partial<Profile>) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
  },

  // 症状记录管理
  symptoms: {
    async create(symptom: Omit<SymptomRecord, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('symptom_records')
        .insert(symptom)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getByUser(userId: string, limit = 30): Promise<SymptomRecord[]> {
      const { data, error } = await supabase
        .from('symptom_records')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    },

    async getTodaySymptom(userId: string): Promise<SymptomRecord | null> {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('symptom_records')
        .select('*')
        .eq('user_id', userId)
        .gte('recorded_at', today)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async getByDateRange(userId: string, startDate: string, endDate: string): Promise<SymptomRecord[]> {
      const { data, error } = await supabase
        .from('symptom_records')
        .select('*')
        .eq('user_id', userId)
        .gte('recorded_at', startDate)
        .lte('recorded_at', endDate)
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  },

  // 食物数据管理
  foods: {
    async search(query: string): Promise<Food[]> {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('safety_level');
      
      if (error) throw error;
      return data || [];
    },

    async getByCategory(category: string): Promise<Food[]> {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('category', category)
        .order('safety_level');
      
      if (error) throw error;
      return data || [];
    },

    async getSafe(forThroat: boolean = false): Promise<Food[]> {
      let query = supabase
        .from('foods')
        .select('*')
        .eq('safety_level', 'safe');
      
      if (forThroat) {
        query = query.eq('for_throat_discomfort', true);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data || [];
    },

    async getAll(): Promise<Food[]> {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .order('category, name');
      
      if (error) throw error;
      return data || [];
    },
  },

  // 饮食记录管理
  meals: {
    async create(meal: Omit<MealRecord, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('meal_records')
        .insert(meal)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getByUser(userId: string, limit = 30): Promise<MealRecord[]> {
      const { data, error } = await supabase
        .from('meal_records')
        .select('*')
        .eq('user_id', userId)
        .order('meal_date', { ascending: false })
        .order('meal_type')
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    },

    async getByDate(userId: string, date: string): Promise<MealRecord[]> {
      const { data, error } = await supabase
        .from('meal_records')
        .select('*')
        .eq('user_id', userId)
        .eq('meal_date', date)
        .order('meal_type');
      
      if (error) throw error;
      return data || [];
    },

    async update(id: string, updates: Partial<MealRecord>) {
      const { data, error } = await supabase
        .from('meal_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('meal_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
  },

  // 健康洞察管理
  insights: {
    async getLatest(userId: string): Promise<HealthInsight | null> {
      const { data, error } = await supabase
        .from('health_insights')
        .select('*')
        .eq('user_id', userId)
        .order('insight_date', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async getByType(userId: string, type: 'daily' | 'weekly' | 'monthly', limit = 10): Promise<HealthInsight[]> {
      const { data, error } = await supabase
        .from('health_insights')
        .select('*')
        .eq('user_id', userId)
        .eq('type', type)
        .order('insight_date', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    },
  },
};