import type React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
}) => {
  const baseClass = `
    bg-white rounded-2xl p-6 border border-gray-200
    transition-all duration-300
    ${hoverable ? 'cursor-pointer hover:shadow-lg' : ''}
    ${className}
  `;

  if (hoverable) {
    return (
      <motion.div
        className={baseClass}
        onClick={onClick}
        whileHover={{ scale: 1.02, borderColor: '#404040' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 } as any}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClass} onClick={onClick}>
      {children}
    </div>
  );
};