import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { databaseService } from '../services/database';
import { useAuth } from '../hooks/useAuth';
import type { SymptomRecord, Food } from '../types';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [todaySymptom, setTodaySymptom] = useState<SymptomRecord | null>(null);
  const [recommendations, setRecommendations] = useState<Food[]>([]);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // 获取今日症状
      const symptom = await databaseService.symptoms.getTodaySymptom(user.id);
      setTodaySymptom(symptom);

      // 根据症状推荐食物
      const foods = await databaseService.foods.getSafe(symptom?.throat_discomfort || false);
      setRecommendations(foods.slice(0, 6));

      // 计算风险等级
      if (symptom) {
        if (symptom.pain_level >= 8) {
          setRiskLevel('high');
        } else if (symptom.pain_level >= 5) {
          setRiskLevel('medium');
        } else {
          setRiskLevel('low');
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high': return 'bg-black text-white';
      case 'medium': return 'bg-gray-600 text-white';
      default: return 'bg-gray-200 text-black';
    }
  };

  const getRiskText = () => {
    switch (riskLevel) {
      case 'high': return '⚠️ 需要关注';
      case 'medium': return '📊 一般';
      default: return '✓ 良好';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 状态栏 */}
      <div className="bg-white border-b-2 border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-black text-black mb-2">健康状态</h1>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center px-4 py-2 rounded-full ${getRiskColor()}`}
              >
                <span className="text-lg font-medium">{getRiskText()}</span>
              </motion.div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">今日日期</p>
              <p className="text-xl font-bold">{new Date().toLocaleDateString('zh-CN')}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto p-6 space-y-6"
      >
        {/* 今日症状 */}
        <motion.div variants={item}>
          <Card>
            <h2 className="text-xl font-bold text-black mb-4">今日症状</h2>
            {todaySymptom ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">疼痛程度</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="text-2xl font-bold text-black"
                  >
                    {todaySymptom.pain_level}/10
                  </motion.span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">食欲状况</span>
                  <span className="text-2xl font-bold text-black">
                    {todaySymptom.appetite_level}/5
                  </span>
                </div>

                {todaySymptom.throat_discomfort && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="px-4 py-3 bg-gray-100 rounded-lg"
                  >
                    <span className="text-gray-700">🗣️ 存在喉咙异物感</span>
                  </motion.div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {todaySymptom.bloating && (
                    <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">🎈 腹胀</span>
                  )}
                  {todaySymptom.acid_reflux && (
                    <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">🔥 反酸</span>
                  )}
                  {todaySymptom.nausea && (
                    <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">🤢 恶心</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">今日还未记录症状</p>
                <Button variant="secondary" size="lg">
                  立即记录
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* 饮食建议 */}
        <motion.div variants={item}>
          <Card>
            <h2 className="text-xl font-bold text-black mb-4">今日饮食建议</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recommendations.map((food, index) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 border border-gray-200 rounded-xl hover:border-black transition-all cursor-pointer"
                >
                  <div className="text-lg font-medium text-black mb-1">
                    {food.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {food.category}
                  </div>
                  {food.for_throat_discomfort && (
                    <div className="mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">缓解喉咙</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 快速操作 */}
        <motion.div variants={item} className="grid grid-cols-2 gap-4">
          <Button variant="secondary" size="xl" className="w-full">
            📝 记录症状
          </Button>
          <Button variant="secondary" size="xl" className="w-full">
            🍽️ 记录饮食
          </Button>
        </motion.div>

        {/* 健康提示 */}
        <motion.div variants={item}>
          <Card className="bg-gray-50 border-gray-300">
            <div className="flex items-start">
              <span className="text-2xl mr-4">💡</span>
              <div>
                <h3 className="font-bold text-black mb-2">健康提示</h3>
                <p className="text-gray-600">
                  记得少食多餐，每餐七分饱。避免辛辣、油腻食物，多喝温开水。
                  如症状持续或加重，请及时就医。
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};