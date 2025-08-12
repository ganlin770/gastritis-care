import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/features/AuthForm';
import { Home } from './pages/Home';
import { SymptomTracker } from './components/features/SymptomTracker';
import { FoodSearch } from './components/features/FoodSearch';
import { ToastContainer, Toast } from './components/ui/Toast';
import { subscribeToSymptomAlerts } from './config/supabase';
import { 
  Home as HomeIcon, 
  Search, 
  Activity, 
  User,
  LogOut
} from 'lucide-react';
import { authService } from './services/auth';

type TabType = 'home' | 'symptoms' | 'foods' | 'profile';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  useEffect(() => {
    if (user) {
      // 订阅症状恶化提醒
      const subscription = subscribeToSymptomAlerts(user.id, (severity, data) => {
        if (severity === 'severe') {
          setToast({
            message: '⚠️ 检测到严重症状，建议立即就医或联系医生',
            type: 'error'
          });
        } else if (severity === 'moderate') {
          setToast({
            message: '症状较重，请注意休息并遵医嘱用药',
            type: 'warning'
          });
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setActiveTab('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const tabs = [
    { id: 'home' as TabType, label: '首页', icon: HomeIcon },
    { id: 'symptoms' as TabType, label: '症状', icon: Activity },
    { id: 'foods' as TabType, label: '食物', icon: Search },
    { id: 'profile' as TabType, label: '我的', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主内容区 */}
      <div className="pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Home />
            </motion.div>
          )}
          
          {activeTab === 'symptoms' && (
            <motion.div
              key="symptoms"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <h1 className="text-3xl font-black text-black mb-6">症状记录</h1>
              <SymptomTracker />
            </motion.div>
          )}
          
          {activeTab === 'foods' && (
            <motion.div
              key="foods"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <h1 className="text-3xl font-black text-black mb-6">食物查询</h1>
              <FoodSearch />
            </motion.div>
          )}
          
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6 max-w-4xl mx-auto"
            >
              <h1 className="text-3xl font-black text-black mb-6">个人中心</h1>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500">当前用户</p>
                    <p className="text-xl font-bold text-black">{user.email}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </motion.button>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">用户ID</p>
                    <p className="font-mono text-xs">{user.id}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">注册时间</p>
                    <p>{new Date(user.created_at).toLocaleDateString('zh-CN')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-0 right-0 h-1 bg-black"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-6 h-6 mb-1 transition-colors ${
                    isActive ? 'text-black' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs transition-colors ${
                    isActive ? 'text-black font-semibold' : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Toast提示 */}
      <ToastContainer>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </ToastContainer>
    </div>
  );
}

export default App;