import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import planMd from '../assets/care_plan_54f.md?raw';

export const CarePlan: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b-2 border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-black text-black">综合诊疗与饮食调理方案</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-6"
      >
        <article className="prose prose-gray max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{planMd}</ReactMarkdown>
        </article>
      </motion.div>
    </div>
  );
};


