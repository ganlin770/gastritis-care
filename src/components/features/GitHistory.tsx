import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, GitCommit, Clock, User, Hash, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';

interface Commit {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  message: string;
  branch: string;
  parentHash?: string;
}

export const GitHistory: React.FC = () => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟从后端获取git历史
    // 在实际应用中，这些数据应该从服务器API获取
    const mockCommits: Commit[] = [
      {
        hash: '3cc0e1f8d2a9b4c5e6f7a8b9c0d1e2f3g4h5i6j7',
        shortHash: '3cc0e1f',
        author: 'Developer',
        date: new Date().toISOString(),
        message: 'Initial commit: 胃炎患者饮食管理系统 - 黑白灰极简设计',
        branch: 'master'
      },
      {
        hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
        shortHash: 'a1b2c3d',
        author: 'Developer',
        date: new Date(Date.now() + 3600000).toISOString(),
        message: '✨ feat: 添加Git历史可视化组件',
        branch: 'master',
        parentHash: '3cc0e1f8d2a9b4c5e6f7a8b9c0d1e2f3g4h5i6j7'
      },
      {
        hash: 'x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0',
        shortHash: 'x1y2z3a',
        author: 'Developer',
        date: new Date(Date.now() + 7200000).toISOString(),
        message: '🎨 style: 优化UI动画效果和响应式布局',
        branch: 'master',
        parentHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
      },
      {
        hash: 'p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0',
        shortHash: 'p1q2r3s',
        author: 'Developer',
        date: new Date(Date.now() + 10800000).toISOString(),
        message: '📦 build: 配置生产环境部署',
        branch: 'master',
        parentHash: 'x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0'
      }
    ];

    setTimeout(() => {
      setCommits(mockCommits);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (hours < 48) return '昨天';
    return date.toLocaleDateString('zh-CN');
  };

  const getCommitTypeColor = (message: string) => {
    if (message.includes('feat:')) return 'bg-green-100 text-green-800 border-green-300';
    if (message.includes('fix:')) return 'bg-red-100 text-red-800 border-red-300';
    if (message.includes('style:')) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (message.includes('docs:')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (message.includes('build:')) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部信息 */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <GitBranch className="w-6 h-6" />
            <h2 className="text-2xl font-black text-black">Git 提交历史</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
              {commits.length} 次提交
            </span>
            <span className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium">
              master
            </span>
          </div>
        </div>

        {/* 提交历史图表 */}
        <div className="relative">
          {/* 时间线 */}
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          
          {/* 提交列表 */}
          <div className="space-y-4">
            {commits.map((commit, index) => (
              <motion.div
                key={commit.hash}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* 连接线 */}
                {index < commits.length - 1 && (
                  <div className="absolute left-7 top-14 h-full w-0.5 bg-gray-300"></div>
                )}
                
                {/* 提交点 */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="absolute left-5 top-5 w-5 h-5 bg-black rounded-full border-4 border-white shadow-lg z-10 cursor-pointer"
                  onClick={() => setSelectedCommit(commit)}
                />
                
                {/* 提交内容 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCommit(commit)}
                  className="ml-14 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-black transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      {/* 提交消息 */}
                      <h3 className="text-lg font-bold text-black mb-1">
                        {commit.message}
                      </h3>
                      
                      {/* 提交元信息 */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          <code className="font-mono">{commit.shortHash}</code>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {commit.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(commit.date)}
                        </span>
                      </div>
                    </div>
                    
                    {/* 提交类型标签 */}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCommitTypeColor(commit.message)}`}>
                      {commit.message.includes('feat:') && '新功能'}
                      {commit.message.includes('fix:') && '修复'}
                      {commit.message.includes('style:') && '样式'}
                      {commit.message.includes('docs:') && '文档'}
                      {commit.message.includes('build:') && '构建'}
                      {!commit.message.includes(':') && '提交'}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* 提交详情弹窗 */}
      <AnimatePresence>
        {selectedCommit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCommit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-black">提交详情</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCommit(null)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                >
                  ✕
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">提交哈希</p>
                  <code className="font-mono text-sm">{selectedCommit.hash}</code>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">提交消息</p>
                  <p className="text-lg font-medium">{selectedCommit.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">作者</p>
                    <p className="font-medium">{selectedCommit.author}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">提交时间</p>
                    <p className="font-medium">
                      {new Date(selectedCommit.date).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">分支</p>
                  <span className="inline-flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    <span className="font-medium">{selectedCommit.branch}</span>
                  </span>
                </div>
                
                {selectedCommit.parentHash && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">父提交</p>
                    <code className="font-mono text-sm">{selectedCommit.parentHash}</code>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};