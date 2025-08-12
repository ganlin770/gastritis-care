import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 实时订阅症状恶化
export const subscribeToSymptomAlerts = (userId: string, callback: (severity: string, data: any) => void) => {
  return supabase
    .channel('symptom-alerts')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'symptom_records',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      if (payload.new.pain_level >= 8) {
        callback('severe', payload.new);
      } else if (payload.new.pain_level >= 6) {
        callback('moderate', payload.new);
      }
    })
    .subscribe();
};