import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, Sparkles } from 'lucide-react';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { databaseService } from '../../services/database';
import type { Food } from '../../types';
import { askFoodAdvisor } from '../../services/ai/foodAdvisor';

const FoodCard: React.FC<{ food: Food }> = ({ food }) => {
  const safetyColors = {
    safe: 'border-gray-300 bg-white',
    caution: 'border-gray-500 bg-gray-100',
    avoid: 'border-black bg-gray-200'
  };

  const safetyLabels = {
    safe: '推荐食用 ✓',
    caution: '谨慎食用 !',
    avoid: '避免食用 ✗'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-xl border-2 transition-all ${safetyColors[food.safety_level]}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-black">{food.name}</h3>
        <motion.span
          whileHover={{ scale: 1.1 }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            food.safety_level === 'avoid' ? 'bg-black text-white' : 'bg-gray-200 text-black'
          }`}
        >
          {safetyLabels[food.safety_level]}
        </motion.span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        分类：{food.category}
      </div>
      
      {food.for_throat_discomfort && (
        <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm mb-3">
          <span className="mr-1">💊</span>
          缓解喉咙不适
        </div>
      )}
      
      {food.preparation_tips && (
        <p className="text-gray-600 mb-3 text-sm leading-relaxed">
          {food.preparation_tips}
        </p>
      )}
      
      {food.alternatives && food.alternatives.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">替代选择：</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {food.alternatives.map((alt, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                {alt}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const FoodSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [forThroat, setForThroat] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<{
    level: 'safe' | 'caution' | 'avoid';
    reason: string;
    alternatives?: string[];
    preparationTips?: string;
  } | null>(null);

  const searchFoods = useCallback(async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      let results = await databaseService.foods.search(searchTerm);
      if (forThroat) {
        results = results.filter(f => f.for_throat_discomfort);
      }
      setFoods(results);
    } catch (error) {
      console.error('Error searching foods:', error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, forThroat]);

  const askAI = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setAiLoading(true);
    setAiAnswer(null);
    try {
      const res = await askFoodAdvisor(searchTerm.trim());
      setAiAnswer(res);
    } catch (e) {
      console.error(e);
      setAiAnswer({ level: 'caution', reason: '智能建议暂不可用，请稍后重试或咨询医生。' });
    } finally {
      setAiLoading(false);
    }
  }, [searchTerm]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchFoods();
    }
  };

  // 分组食物
  const groupedFoods = {
    safe: foods.filter(f => f.safety_level === 'safe'),
    caution: foods.filter(f => f.safety_level === 'caution'),
    avoid: foods.filter(f => f.safety_level === 'avoid')
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 搜索框 */}
      <Card className="mb-8">
        {/* Apple-style glass effect */}
        <div className="flex gap-4 items-center backdrop-blur-md bg-white/60 border border-gray-200 rounded-2xl p-4">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入食物名称查询..."
            icon={<Search className="w-5 h-5" />}
            className="flex-1"
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={forThroat} onChange={(e) => setForThroat(e.target.checked)} />
            只看可缓解喉咙不适
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={searchFoods}
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? '搜索中...' : '查询'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={askAI}
            disabled={aiLoading}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold flex items-center gap-2 shadow-sm disabled:opacity-50"
            title="GPT-5 nano 智能建议"
          >
            <Sparkles className="w-4 h-4" />{aiLoading ? '分析中...' : '智能建议'}
          </motion.button>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          饮食原则：清淡、温软、少油；避免辛辣/生冷/油炸与高盐腌熏。优选小米粥、蒸蛋、炖菜、瘦肉鱼类、熟软蔬菜。
        </div>
        {aiAnswer && (
          <div className="mt-4 rounded-2xl p-4 border-2"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(240,240,240,0.5))',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-black" />
              <span className="text-sm text-gray-700">GPT-5 nano 智能分析</span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${aiAnswer.level === 'safe' ? 'bg-green-600 text-white' : aiAnswer.level === 'avoid' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-black'}`}>{aiAnswer.level}</span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">{aiAnswer.reason}</p>
            {aiAnswer.preparationTips && (
              <p className="text-sm text-gray-600 mt-2">做法建议：{aiAnswer.preparationTips}</p>
            )}
            {aiAnswer.alternatives && aiAnswer.alternatives.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {aiAnswer.alternatives.map((alt, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 rounded-lg text-sm">{alt}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 搜索结果 */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600">正在搜索...</p>
          </motion.div>
        ) : hasSearched && foods.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">未找到相关食物</p>
            <p className="text-gray-500 mt-2">请尝试其他关键词</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* 推荐食物 */}
            {groupedFoods.safe.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-black mb-4 flex items-center">
                  <span className="w-2 h-8 bg-green-600 mr-3 rounded"></span>
                  推荐食物
                </h3>
                <div className="space-y-4">
                  {groupedFoods.safe.map(food => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </div>
              </div>
            )}

            {/* 谨慎食物 */}
            {groupedFoods.caution.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-black mb-4 flex items-center">
                  <span className="w-2 h-8 bg-yellow-600 mr-3 rounded"></span>
                  谨慎食用
                </h3>
                <div className="space-y-4">
                  {groupedFoods.caution.map(food => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </div>
              </div>
            )}

            {/* 避免食物 */}
            {groupedFoods.avoid.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-black mb-4 flex items-center">
                  <span className="w-2 h-8 bg-red-600 mr-3 rounded"></span>
                  避免食用
                </h3>
                <div className="space-y-4">
                  {groupedFoods.avoid.map(food => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};