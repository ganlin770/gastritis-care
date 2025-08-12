import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { authService } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取初始用户状态
    authService.getCurrentUser().then(setUser).finally(() => setLoading(false));

    // 监听认证状态变化
    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};