import React from 'react';
import { motion } from 'framer-motion';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  labels?: string[];
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  label,
  showValue = true,
  labels = []
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg font-medium text-gray-700">
            {label}
          </label>
          {showValue && (
            <motion.span
              key={value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-black"
            >
              {value}/{max}
            </motion.span>
          )}
        </div>
      )}
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #000 0%, #000 ${percentage}%, #E5E5E5 ${percentage}%, #E5E5E5 100%)`
          }}
        />
        
        {/* 动画指示器 */}
        <motion.div
          className="absolute top-0 h-3 bg-black rounded-lg pointer-events-none"
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
      
      {labels.length > 0 && (
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          {labels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
};