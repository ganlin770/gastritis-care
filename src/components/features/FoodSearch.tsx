import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { databaseService } from '../../services/database';
import type { Food } from '../../types';

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

  const searchFoods = useCallback(async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const results = await databaseService.foods.search(searchTerm);
      setFoods(results);
    } catch (error) {
      console.error('Error searching foods:', error);
      setFoods([]);
    } finally {
      setLoading(false);
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
        <div className="flex gap-4">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入食物名称查询..."
            icon={<Search className="w-5 h-5" />}
            className="flex-1"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={searchFoods}
            disabled={loading}
            className="px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? '搜索中...' : '查询'}
          </motion.button>
        </div>
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