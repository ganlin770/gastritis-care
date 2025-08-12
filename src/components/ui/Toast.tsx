import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-white border-gray-300',
    error: 'bg-black text-white',
    warning: 'bg-gray-800 text-white',
    info: 'bg-white border-gray-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        fixed bottom-8 right-8 z-50
        flex items-center gap-3
        px-6 py-4 rounded-xl
        border-2 shadow-2xl
        min-w-[300px] max-w-[500px]
        ${colors[type]}
      `}
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <p className="flex-1 text-base font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-4 hover:opacity-70 transition-opacity"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

// Toast容器组件
export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  );
};