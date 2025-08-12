import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { Card } from '../ui/Card';
import { databaseService } from '../../services/database';
import { useAuth } from '../../hooks/useAuth';

interface SymptomButtonProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

const SymptomButton: React.FC<SymptomButtonProps> = ({ icon, label, selected, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`
      p-6 rounded-xl border-2 transition-all
      ${selected 
        ? 'border-black bg-gray-100' 
        : 'border-gray-300 bg-white hover:border-gray-400'}
    `}
  >
    <motion.div
      initial={false}
      animate={{ scale: selected ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-base font-medium">{label}</div>
    </motion.div>
  </motion.button>
);

export const SymptomTracker: React.FC = () => {
  const { user } = useAuth();
  const [painLevel, setPainLevel] = useState(5);
  const [appetiteLevel, setAppetiteLevel] = useState(3);
  const [symptoms, setSymptoms] = useState({
    throatDiscomfort: false,
    bloating: false,
    acidReflux: false,
    nausea: false
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const symptomIcons = [
    { key: 'throatDiscomfort' as keyof typeof symptoms, label: '喉咙异物感', icon: '🗣️' },
    { key: 'bloating' as keyof typeof symptoms, label: '腹胀', icon: '🎈' },
    { key: 'acidReflux' as keyof typeof symptoms, label: '反酸', icon: '🔥' },
    { key: 'nausea' as keyof typeof symptoms, label: '恶心', icon: '🤢' }
  ];

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await databaseService.symptoms.create({
        user_id: user.id,
        pain_level: painLevel,
        throat_discomfort: symptoms.throatDiscomfort,
        bloating: symptoms.bloating,
        acid_reflux: symptoms.acidReflux,
        nausea: symptoms.nausea,
        appetite_level: appetiteLevel,
        recorded_at: new Date().toISOString(),
        triggers: [],
        notes
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // 重置表单
      setPainLevel(5);
      setAppetiteLevel(3);
      setSymptoms({
        throatDiscomfort: false,
        bloating: false,
        acidReflux: false,
        nausea: false
      });
      setNotes('');
    } catch (error) {
      console.error('Error recording symptoms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-black mb-6">症状记录</h2>
        
        {/* 疼痛评分 */}
        <div className="mb-8">
          <Slider
            value={painLevel}
            onChange={setPainLevel}
            min={0}
            max={10}
            label="疼痛程度"
            labels={['无痛', '轻微', '中等', '严重', '剧痛']}
          />
        </div>

        {/* 食欲评分 */}
        <div className="mb-8">
          <Slider
            value={appetiteLevel}
            onChange={setAppetiteLevel}
            min={0}
            max={5}
            label="食欲状况"
            labels={['无', '差', '一般', '好']}
          />
        </div>

        {/* 症状选择 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">其他症状</h3>
          <div className="grid grid-cols-2 gap-4">
            {symptomIcons.map(({ key, label, icon }) => (
              <SymptomButton
                key={key}
                icon={icon}
                label={label}
                selected={symptoms[key]}
                onClick={() => setSymptoms(prev => ({ ...prev, [key]: !prev[key] }))}
              />
            ))}
          </div>
        </div>

        {/* 备注 */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            备注（可选）
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition-colors"
            rows={3}
            placeholder="记录其他相关信息..."
          />
        </div>

        {/* 提交按钮 */}
        <Button
          variant="primary"
          size="xl"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          记录症状
        </Button>

        {/* 成功提示 */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-4 bg-gray-100 rounded-lg text-center"
            >
              <span className="text-lg font-medium">✓ 症状已成功记录</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Card>
  );
};