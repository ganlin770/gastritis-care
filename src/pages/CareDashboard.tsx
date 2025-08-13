import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { databaseService } from '../services/database';
import { guestData } from '../services/guestData';
import type { SymptomRecord, Food } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CareTips } from '../components/features/CareTips';
import { Search, Activity, Flame, Soup, ClipboardList, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import mealPlan14d from '../assets/meal_plan_14d';

type ViewMode = 'all' | 'tcm' | 'wm';

const kDayNames = ['一', '二', '三', '四', '五', '六', '日'];

const weeklyMenu: Array<{ breakfast: string; lunch: string; dinner: string; snack: string }> = [
  { breakfast: '小米粥 + 蒸蛋 + 南瓜', lunch: '清蒸鱼 + 软米饭 + 胡萝卜', dinner: '猴头菇炖鸡汤 + 馒头', snack: '红枣山药糕' },
  { breakfast: '山药莲子粥 + 蒸苹果', lunch: '鸡丝面 + 炖菜花', dinner: '南瓜粥 + 嫩豆腐汤', snack: '姜枣水' },
  { breakfast: '红枣小米粥 + 蛋花', lunch: '山药炖牛肉 + 软米饭', dinner: '鸡汤面（面软）', snack: '苏打饼干' },
  { breakfast: '南瓜粥 + 蒸蛋', lunch: '黄鱼清蒸 + 软面条', dinner: '清鸡汤 + 馒头', snack: '香蕉（熟软）' },
  { breakfast: '小米粥 + 蒸苹果', lunch: '山药炖排骨 + 软米饭', dinner: '南瓜粥 + 豆腐羹', snack: '酸奶（耐受者）' },
  { breakfast: '红枣小米粥 + 蛋花', lunch: '鸡肉蘑菇炖 + 软米饭', dinner: '山药瘦肉粥', snack: '温牛奶（耐受者）' },
  { breakfast: '山药莲子粥 + 蒸蛋', lunch: '清蒸鱼 + 胡萝卜泥', dinner: '猴头菇炖鸡 + 馒头', snack: '葡萄（去皮去籽）' },
];

const Sparkline: React.FC<{ values: number[]; color?: string }> = ({ values, color = '#000' }) => {
  const width = 180;
  const height = 40;
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const norm = (v: number) => (max === min ? 0.5 : (v - min) / (max - min));
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - 8) + 4;
    const y = height - norm(v) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  );
};

export const CareDashboard: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<ViewMode>('all');
  const [acidReflux, setAcidReflux] = useState(false);
  const [throat, setThroat] = useState(false);
  const [appetitePoor, setAppetitePoor] = useState(false);
  const [recent, setRecent] = useState<SymptomRecord[]>([]);
  const [today, setToday] = useState<SymptomRecord | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [menuIdx, setMenuIdx] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [list, todaySymptom] = await Promise.all([
          (user
            ? databaseService.symptoms.getByUser(user.id, 14)
            : guestData.symptoms.getByUser('guest', 14)
          ).catch(() => []),
          (user
            ? databaseService.symptoms.getTodaySymptom(user.id)
            : guestData.symptoms.getTodaySymptom('guest')
          ).catch(() => null),
        ]);
        if (!mounted) return;
        setRecent(list || []);
        setToday(todaySymptom);
        if (todaySymptom) {
          setAcidReflux(!!todaySymptom.acid_reflux);
          setThroat(!!todaySymptom.throat_discomfort);
          setAppetitePoor((todaySymptom.appetite_level ?? 3) <= 2);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  useEffect(() => {
    (async () => {
       const kw = throat ? '喉' : (acidReflux ? '粥' : '温');
       const list = await databaseService.foods.search(kw).catch(() => []);
      setFoods(list?.slice(0, 6) || []);
    })();
  }, [user, throat, acidReflux]);

  const painSeries = useMemo(() => recent.map(r => r.pain_level).reverse(), [recent]);
  const appetiteSeries = useMemo(() => recent.map(r => r.appetite_level).reverse(), [recent]);

  const risk: 'low' | 'medium' | 'high' = useMemo(() => {
    const p = today?.pain_level ?? 0;
    if (p >= 8 || acidReflux) return 'high';
    if (p >= 5) return 'medium';
    return 'low';
  }, [today, acidReflux]);

  const riskColor = risk === 'high' ? 'bg-black text-white' : risk === 'medium' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black';

  const openFoodSearch = (relief?: string) => {
    const url = new URL(window.location.href);
    url.hash = '';
    // 简单跳转至应用内“食物”页：触发底部导航点击由上层完成；这里提供提示
    window.sessionStorage.setItem('gc.food.relief', relief || '');
    alert('已为你预置筛选，点击底部“食物”进入查看');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b-2 border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto p-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-black">个性化方案看板</h1>
            <div className="mt-2 inline-flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${riskColor}`}>今日风险：{risk === 'high' ? '高' : risk === 'medium' ? '中' : '低'}</span>
              <div className="text-sm text-gray-600">根据今日症状动态生成</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setAcidReflux(v => !v)} className={`px-3 py-1 rounded-full text-sm ${acidReflux ? 'bg-black text-white' : 'bg-gray-100'}`}>反酸</button>
              <button onClick={() => setThroat(v => !v)} className={`px-3 py-1 rounded-full text-sm ${throat ? 'bg-black text-white' : 'bg-gray-100'}`}>喉异</button>
              <button onClick={() => setAppetitePoor(v => !v)} className={`px-3 py-1 rounded-full text-sm ${appetitePoor ? 'bg-black text-white' : 'bg-gray-100'}`}>食欲差</button>
            </div>
            <div className="ml-2 bg-gray-100 rounded-lg p-1">
              {(['all','tcm','wm'] as ViewMode[]).map(m => (
                <button key={m} onClick={() => setView(m)} className={`px-3 py-1 rounded-md text-sm ${view===m?'bg-black text-white':'text-gray-700'}`}>{m==='all'?'全部':m==='tcm'?'中医':'西医'}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-28">
        {/* KPIs */}
        <Card hoverable className="lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border-2 border-gray-200">
              <div className="text-sm text-gray-500">今日疼痛</div>
              <div className="text-3xl font-black text-black">{today?.pain_level ?? '—'}/10</div>
              <div className="mt-2"><Sparkline values={painSeries} /></div>
            </div>
            <div className="p-4 rounded-xl border-2 border-gray-200">
              <div className="text-sm text-gray-500">今日食欲</div>
              <div className="text-3xl font-black text-black">{today?.appetite_level ?? '—'}/5</div>
              <div className="mt-2"><Sparkline values={appetiteSeries} color="#555" /></div>
            </div>
            <div className="p-4 rounded-xl border-2 border-gray-200">
              <div className="text-sm text-gray-500">反酸</div>
              <div className="text-3xl font-black text-black">{(today?.acid_reflux || acidReflux) ? '是' : '否'}</div>
            </div>
            <div className="p-4 rounded-xl border-2 border-gray-200">
              <div className="text-sm text-gray-500">喉咙异物感</div>
              <div className="text-3xl font-black text-black">{(today?.throat_discomfort || throat) ? '有' : '无'}</div>
            </div>
          </div>
        </Card>

        {/* 今日重点照护（动态） */}
        <div className="space-y-6 lg:col-span-2">
          <Card hoverable>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black flex items-center gap-2"><Activity className="w-5 h-5"/>今日重点照护</h2>
              <div className="flex items-center gap-2 md:hidden">
                <button onClick={() => setAcidReflux(v=>!v)} className={`px-3 py-1 rounded-full text-sm ${acidReflux?'bg-black text-white':'bg-gray-100'}`}>反酸</button>
                <button onClick={() => setThroat(v=>!v)} className={`px-3 py-1 rounded-full text-sm ${throat?'bg-black text-white':'bg-gray-100'}`}>喉异</button>
                <button onClick={() => setAppetitePoor(v=>!v)} className={`px-3 py-1 rounded-full text-sm ${appetitePoor?'bg-black text-white':'bg-gray-100'}`}>食欲差</button>
              </div>
            </div>
            <CareTips signals={{ acidReflux, throatDiscomfort: throat, appetiteLevel: appetitePoor ? 1 : 3 }} />
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => openFoodSearch(throat ? 'throat' : acidReflux ? 'reflux' : undefined)}>
                <Search className="w-4 h-4 mr-2"/>去检索可食
              </Button>
              <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>回到顶部</Button>
            </div>
          </Card>

          {/* 可选视角：根据 view 过滤提示（此处以文案标签体现，不隐藏内容，保持信息完整） */}
          <AnimatePresence>
            {view !== 'all' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card>
                  <div className="text-sm text-gray-600">
                    当前已切换到 {view==='tcm'?'中医':'西医'} 视角优先展示。完整内容仍可在各模块展开查看。
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 今日建议食物（简版列表） */}
          <Card>
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2"><Flame className="w-5 h-5"/>今日建议食物</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {foods.map(f => (
                <div key={f.id} className="p-3 rounded-xl border-2 border-gray-200">
                  <div className="text-black font-medium mb-1">{f.name}</div>
                  <div className="text-xs text-gray-500">{f.category}</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => openFoodSearch(throat ? 'throat' : undefined)}>
                <Search className="w-4 h-4 mr-2"/>查看更多
              </Button>
            </div>
          </Card>
        </div>

        {/* 一周菜单（交互卡片） */}
        <Card hoverable>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-black flex items-center gap-2"><Soup className="w-5 h-5"/>一周温软菜单</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-gray-100" onClick={() => setMenuIdx((menuIdx+6)%7)}><ChevronLeft className="w-4 h-4"/></button>
              <div className="px-3 py-1 rounded-full bg-black text-white text-sm">周{kDayNames[menuIdx]}</div>
              <button className="p-2 rounded-lg bg-gray-100" onClick={() => setMenuIdx((menuIdx+1)%7)}><ChevronRight className="w-4 h-4"/></button>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg"><span className="text-gray-500 mr-2">早餐</span>{weeklyMenu[menuIdx].breakfast}</div>
            <div className="p-3 bg-gray-50 rounded-lg"><span className="text-gray-500 mr-2">午餐</span>{weeklyMenu[menuIdx].lunch}</div>
            <div className="p-3 bg-gray-50 rounded-lg"><span className="text-gray-500 mr-2">晚餐</span>{weeklyMenu[menuIdx].dinner}</div>
            <div className="p-3 bg-gray-50 rounded-lg"><span className="text-gray-500 mr-2">加餐</span>{weeklyMenu[menuIdx].snack}</div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            菜单以温软少油为原则；可根据个体耐受微调。
          </div>
        </Card>

        {/* 14天脾胃调理食谱（精简卡片浏览） */}
        <Card hoverable className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-black flex items-center gap-2"><CalendarDays className="w-5 h-5"/>14天脾胃调理食谱</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mealPlan14d.map((d, idx) => (
              <div key={idx} className="p-4 rounded-xl border-2 border-gray-200 bg-white">
                <div className="mb-2 font-bold text-black">第{idx+1}天</div>
                <div className="text-sm text-gray-800"><span className="text-gray-500 mr-2">早餐</span>{d.breakfast}</div>
                <div className="text-sm text-gray-800 mt-1"><span className="text-gray-500 mr-2">午餐</span>{d.lunch}</div>
                <div className="text-sm text-gray-800 mt-1"><span className="text-gray-500 mr-2">晚餐</span>{d.dinner}</div>
                {d.snack && <div className="text-sm text-gray-800 mt-1"><span className="text-gray-500 mr-2">加餐</span>{d.snack}</div>}
              </div>
            ))}
          </div>
        </Card>

        {/* 执行清单 */}
        <Card hoverable className="lg:col-span-3">
          <h2 className="text-xl font-bold text-black mb-3 flex items-center gap-2"><ClipboardList className="w-5 h-5"/>今日执行清单</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-gray-800">
            <li>餐后不立即平卧，睡前两小时不进食，床头抬高 15–20cm</li>
            <li>避免辣/油炸/生冷/高盐；选择粥/蒸蛋/炖菜等温软食物</li>
            <li>今日 20–30 分钟温和运动（饭后散步/太极）</li>
            {acidReflux && (<li>夜间反酸明显者，可与医生沟通夜间抑酸或抗酸剂方案</li>)}
            {throat && (<li>温水含漱或金银花菊花水；情志放松，减少过度关注</li>)}
            {appetitePoor && (<li>采用少量多餐；正餐前少量开胃汤，必要时山楂麦芽茶（胃酸多慎）</li>)}
          </ul>
        </Card>
      </div>

      {!loading && recent.length === 0 && (
        <div className="max-w-6xl mx-auto p-6 text-sm text-gray-500">暂无历史记录。可在“症状”页先记录一次以获得更精准建议。</div>
      )}
    </div>
  );
};

export default CareDashboard;


