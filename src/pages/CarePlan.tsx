import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import planMd from '../assets/care_plan_54f.md?raw';
import { Button } from '../components/ui/Button';

export const CarePlan: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(planMd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    const blob = new Blob([planMd], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '胃炎健康管理_综合方案.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b-2 border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto p-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-black">综合诊疗与饮食调理方案</h1>
            <p className="text-gray-600 text-sm mt-1">
              面向“糜烂萎缩性胃炎伴轻度肠化生”的中西医结合与每日饮食建议（科普信息，不替代医疗诊断）。
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="md" onClick={handleCopy}>
              {copied ? '已复制' : '复制全文'}
            </Button>
            <Button variant="primary" size="md" onClick={handleDownload}>
              下载MD
            </Button>
          </div>
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

        <div className="mt-8 text-xs text-gray-500">
          本内容仅作健康科普与饮食参考，请遵医嘱用药并定期复查。
        </div>
      </motion.div>
    </div>
  );
};


