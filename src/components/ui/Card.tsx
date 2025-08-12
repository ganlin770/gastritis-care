import React from 'react';
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
  onClick
}) => {
  const Component = hoverable ? motion.div : 'div';
  const props = hoverable ? {
    whileHover: { scale: 1.02, borderColor: '#404040' },
    transition: { type: "spring", stiffness: 300, damping: 25 }
  } : {};

  return (
    <Component
      className={`
        bg-white rounded-2xl p-6 border border-gray-200
        transition-all duration-300
        ${hoverable ? 'cursor-pointer hover:shadow-lg' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};