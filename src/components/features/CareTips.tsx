import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

export interface CareSignal {
  acidReflux?: boolean;
  throatDiscomfort?: boolean;
  appetiteLevel?: number; // 0-5, lower == worse
}

const Section: React.FC<{ title: string; tips: string[] }> = ({ title, tips }) => (
  <div className="mb-6">
    <h4 className="text-lg font-bold text-black mb-2">{title}</h4>
    <ul className="list-disc pl-5 space-y-2 text-gray-700">
      {tips.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  </div>
);

export const CareTips: React.FC<{ signals: CareSignal }> = ({ signals }) => {
  const showReflux = signals.acidReflux;
  const showThroat = signals.throatDiscomfort;
  const showAppetite = typeof signals.appetiteLevel === 'number' && signals.appetiteLevel <= 2;

  if (!showReflux && !showThroat && !showAppetite) {
    return null;
  }

  return (
    <Card className="bg-gray-50">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-xl font-bold text-black mb-4">今日重点照护</h3>
        {showReflux && (
          <Section
            title="反酸缓解要点"
            tips={[
              '三不：餐后不躺、睡前两小时不进食、床头抬高15–20cm',
              '少脂少辣，避免咖啡、酒精、巧克力、薄荷、洋葱、浓肉汤',
              '正餐后静坐或慢走20分钟，避免弯腰与束腹',
              '医嘱下规律使用抑酸剂/胃动力药，可备抗酸剂应急',
            ]}
          />
        )}
        {showThroat && (
          <Section
            title="喉咙异物感（梅核气）护理"
            tips={[
              '情志疏解与放松训练，减少对局部感受的注意',
              '温水、小口含漱淡盐水或金银花菊花水以润喉',
              '可饮生姜红枣水以温中散寒（注意个体耐受）',
              '就医处方下可用半夏厚朴汤类方或逍遥丸/玄麦桔甘颗粒',
            ]}
          />
        )}
        {showAppetite && (
          <Section
            title="提升食欲的做法"
            tips={[
              '少量多餐，正餐前少量开胃汤（如山药扁豆鸡汤）',
              '食物温软易消化：粥/蒸蛋/炖菜，避免生冷与油炸',
              '饭前30分钟可用山楂麦芽茶助消化（胃酸多者慎用）',
              '每天30分钟温和运动与充足睡眠',
            ]}
          />
        )}
        <div className="text-xs text-gray-500">科普信息，不替代医疗诊断；请遵医嘱用药并定期复查。</div>
      </motion.div>
    </Card>
  );
};


