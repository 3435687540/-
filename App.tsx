
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, ArrowLeft, RefreshCw, Sparkles, 
  TrendingUp, CheckCircle2, 
  BrainCircuit, Layers, Hexagon, 
  UserCircle2, Clock, GraduationCap, 
  BookOpen, Building2, Rocket, BriefcaseBusiness, Lock, Printer, DollarSign, AlertTriangle, ShieldCheck, Coins, Flame
} from 'lucide-react';
import { getQuestionsForMode, MODE_INFO, CATEGORY_LABELS, MODULE_TITLES, VALID_ACCESS_CODES } from './constants';
import { Answer, AppState, AnalysisResult, TestMode, Question } from './types';
import { generateCareerAnalysis } from './services/geminiService';
import AbilityRadar from './components/RadarChart';

// --- TROLL / SPAM RESULT ---
const TROLL_RESULT: AnalysisResult = {
  userPersona: "淡定佛系·人类复读机",
  marketAnalysis: "根据大数据分析，您这种“一招鲜吃遍天”的填表风格，在2026年可能会被自动化脚本取代。市场建议：稍微走点心，毕竟这可是为了您的搞钱大计。",
  topMatches: [
    {
      jobTitle: "Ctrl+C/V 资深工程师",
      matchScore: 99.9,
      tags: ["极度稳定", "毫无波澜", "莫得感情"],
      description: "您展现出了惊人的稳定性！无论问题如何变化，您的答案始终如一。这种特质非常适合不需要思考的重复性工作。",
      fitReason: "全选同一个选项，说明您有着“以不变应万变”的顶级哲学思维，或者...您只是想看看乱填会发生什么？",
      dailyWork: "每天按同一个按钮，重复 10000 次。不需要开会，因为您的意见永远是“一样”。",
      curriculumFocus: ["复制粘贴学", "手指肌肉耐力训练"],
      softwareStack: ["记事本", "按键精灵"],
      selfStudyGoals: ["尝试点击一下不同的选项", "找回失去的耐心"],
      portfolioFocus: "展示一张全是同一个像素点的画布。",
      internshipPath: "建议去流水线体验生活，感受重复的艺术。",
      salaryRange: "¥0.5 - 0.8k (包吃)",
      salaryCompetitiveness: 1,
      involutionIndex: "低 - 没人跟您抢",
      futureOutlook: "可能会被更勤奋的物理按键取代。",
      careerGrowth: "从按键专员 -> 高级按键经理 -> 按键之神",
      sideHustleChannels: ["暂无，建议先认真做完测试"],
      painPoints: ["可能会很无聊", "手指容易抽筋"],
      educationFit: { vocational: "适合", college: "适合", bachelor: "适合", master: "适合" }
    },
    {
      jobTitle: "极简主义行为艺术家",
      matchScore: 88,
      tags: ["极简", "抽象", "行为艺术"],
      description: "您的答题轨迹构成了一条完美的直线，这是对现代社会复杂性的无声抗议。",
      fitReason: "并不是谁都能坚持把所有题都选一样的。这是一种坚持，一种信仰，一种对AI测评的反叛。",
      dailyWork: "坐在空白的房间里，思考“虚无”。",
      // Keep strictly required fields valid to prevent crash
      curriculumFocus: [], softwareStack: [], selfStudyGoals: [], sideHustleChannels: [], painPoints: []
    } as any,
    {
      jobTitle: "神秘的测试员",
      matchScore: 60,
      tags: ["Bug Hunter", "捣乱"],
      description: "恭喜您发现了我们的彩蛋！但为了得到真正的职业建议，请您高抬贵手，重新测一次吧。",
      fitReason: "您成功触发了系统的“防敷衍机制”。",
      dailyWork: "寻找系统的边缘情况，试图把AI整不会。",
      curriculumFocus: [], softwareStack: [], selfStudyGoals: [], sideHustleChannels: [], painPoints: []
    } as any
  ],
  abilityRadar: [
    { subject: '创意审美', A: 10, fullMark: 100 },
    { subject: '逻辑思维', A: 10, fullMark: 100 },
    { subject: '软件技法', A: 100, fullMark: 100 }, // Full mark for "Copy Paste" technique
    { subject: '商业闭环', A: 10, fullMark: 100 },
    { subject: '沟通协作', A: 10, fullMark: 100 },
    { subject: '用户共情', A: 10, fullMark: 100 }
  ]
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [testMode, setTestMode] = useState<TestMode>('standard');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [unlockError, setUnlockError] = useState('');
  
  const questionRef = useRef<HTMLDivElement>(null);
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const currentModule = currentQuestion?.module || 'subconscious';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [appState, currentQuestionIndex]);

  const goToModeSelect = () => {
    setAppState(AppState.MODE_SELECT);
  };

  const handleModeSelection = (mode: TestMode) => {
    setTestMode(mode);
    if (mode === 'basic') {
      startQuiz(mode);
    } else {
      setAppState(AppState.LOCKED_GATE);
      setAccessCode('');
      setUnlockError('');
    }
  };

  const validateAccessCode = () => {
    const input = accessCode.trim().toUpperCase();
    if (VALID_ACCESS_CODES.includes(input)) {
      startQuiz(testMode);
    } else {
      setUnlockError('激活码无效，请检查输入 (测试码: VIP2026)');
    }
  };

  const startQuiz = (mode: TestMode) => {
    setCurrentQuestions(getQuestionsForMode(mode));
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setAppState(AppState.QUIZ);
  };

  const handleAnswer = (value: number) => {
    if (questionRef.current) {
      questionRef.current.classList.add('opacity-0', '-translate-x-10');
    }

    setTimeout(() => {
      const newAnswers = [...answers, { questionId: currentQuestions[currentQuestionIndex].id, value }];
      setAnswers(newAnswers);

      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        if (questionRef.current) {
          questionRef.current.classList.remove('opacity-0', '-translate-x-10');
          questionRef.current.classList.add('animate-fade-in-up');
        }
      } else {
        submitAnswers(newAnswers);
      }
    }, 200);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setAnswers(prev => prev.slice(0, -1));
      setCurrentQuestionIndex(prev => prev - 1);
      if (questionRef.current) {
        questionRef.current.classList.remove('opacity-0', '-translate-x-10');
        questionRef.current.classList.add('animate-fade-in-up');
      }
    } else {
      setAppState(AppState.MODE_SELECT);
    }
  };

  // --- SPAM CHECK LOGIC ---
  const checkForSpam = (finalAnswers: Answer[]): boolean => {
    if (finalAnswers.length < 5) return false;
    
    // 1. Check if all values are identical
    const firstValue = finalAnswers[0].value;
    const allSame = finalAnswers.every(a => a.value === firstValue);
    
    // 2. Check if variance is extremely low (e.g. 90% same)
    // For simplicity, just checking "all same" or "only 2 unique values but mostly one" is often enough.
    // Let's stick to strict "all same" for the joke effect, or maybe just variance < 0.2
    
    return allSame;
  };

  const submitAnswers = async (finalAnswers: Answer[]) => {
    // 1. Check for spam/troll
    if (checkForSpam(finalAnswers)) {
      setResult(TROLL_RESULT);
      setAppState(AppState.RESULT);
      return;
    }

    // 2. Normal Flow
    setAppState(AppState.ANALYZING);
    try {
      const analysis = await generateCareerAnalysis(finalAnswers, testMode);
      setResult(analysis);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setErrorMsg("AI 思考超时，可能是网络波动。您的答案已保存，请点击重试。");
      setAppState(AppState.ERROR);
    }
  };

  const handleRestart = () => {
    setResult(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setAppState(AppState.WELCOME);
  };
  
  const handleRetryAnalysis = () => {
    submitAnswers(answers);
  };

  const handlePrint = () => {
    window.print();
  };

  const BackgroundGradient = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FAFAFA] print:bg-white">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end opacity-80 print:hidden"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob print:hidden"></div>
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 print:hidden"></div>
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 print:hidden"></div>
    </div>
  );

  const renderWelcome = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <BackgroundGradient />
      <div className="mb-6 animate-fade-in-up">
        <span className="px-3 py-1 rounded-full border border-indigo-200 bg-white/60 text-[10px] font-bold text-indigo-600 tracking-wider shadow-sm backdrop-blur-md">
          ✨ V4.0 2026 全新升级 | 专为中国视传学子定制
        </span>
      </div>

      <div className="w-full max-w-md space-y-8 animate-fade-in-up animation-delay-200">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-xl shadow-indigo-200 mb-2 transform rotate-3 hover:rotate-6 transition-transform duration-500 ring-4 ring-white/50">
            <Layers className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-[1.15]">
            2026 视觉传达<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">就业风向标 Pro</span>
          </h1>
          <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase opacity-80">
             Design Career Compass · AI Powered
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4 rounded-2xl border border-white/60 shadow-lg shadow-indigo-100/40 hover:scale-[1.02] transition-transform duration-300">
             <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mb-3 text-indigo-600">
                <BrainCircuit size={18}/>
             </div>
             <h3 className="font-bold text-slate-800 text-sm">潜意识深扫</h3>
             <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
               超越MBTI，基于设计心理学挖掘你的核心天赋与隐性短板。
             </p>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/60 shadow-lg shadow-purple-100/40 hover:scale-[1.02] transition-transform duration-300">
             <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mb-3 text-purple-600">
                <TrendingUp size={18}/>
             </div>
             <h3 className="font-bold text-slate-800 text-sm">2026 红利预测</h3>
             <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
               对标BOSS直聘/猎聘/脉脉千万级数据，预判AIGC时代高薪赛道。
             </p>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/60 shadow-lg shadow-pink-100/40 hover:scale-[1.02] transition-transform duration-300">
             <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center mb-3 text-pink-600">
                <GraduationCap size={18}/>
             </div>
             <h3 className="font-bold text-slate-800 text-sm">学历/能力匹配</h3>
             <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
               精准分析专/本/硕竞争力，打破信息差，拒绝盲目内卷。
             </p>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/60 shadow-lg shadow-orange-100/40 hover:scale-[1.02] transition-transform duration-300">
             <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mb-3 text-orange-600">
                <Rocket size={18}/>
             </div>
             <h3 className="font-bold text-slate-800 text-sm">Offer通关攻略</h3>
             <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
               定制化作品集策略 + 大厂实习路径规划，直击就业痛点。
             </p>
          </div>
        </div>

        <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
           <button 
            onClick={goToModeSelect}
            className="relative w-full py-4 rounded-full bg-slate-900 text-white font-bold text-lg shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            立即开启职业诊断 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </div>
        
        <p className="text-center text-[10px] text-slate-400">
           已累计服务 50,000+ 设计相关专业在校生
        </p>
      </div>
    </div>
  );

  const renderModeSelect = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative max-w-md mx-auto">
      <BackgroundGradient />
      <div className="w-full space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">选择测评模式</h2>
          <p className="text-slate-500 text-sm mt-2">根据您的年级和需求选择适合的版本</p>
        </div>

        {(Object.keys(MODE_INFO) as TestMode[]).map((mode) => {
          const isPro = mode !== 'basic';
          return (
            <button
              key={mode}
              onClick={() => handleModeSelection(mode)}
              className={`w-full glass-card glass-card-hover p-5 rounded-2xl flex items-center gap-4 text-left transition-all group relative overflow-hidden border ${isPro ? 'border-indigo-100/50' : 'border-white/60'}`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${MODE_INFO[mode].color}`} />
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${MODE_INFO[mode].color} flex items-center justify-center text-white shadow-md shrink-0 relative`}>
                {mode === 'basic' && <CheckCircle2 size={20} />}
                {mode === 'standard' && <Layers size={20} />}
                {mode === 'deep' && <BrainCircuit size={20} />}
                {isPro && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-sm border border-white">
                    <Lock size={8} className="text-yellow-900" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    {MODE_INFO[mode].title}
                    {isPro && <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 text-[9px] px-1.5 py-0.5 rounded-sm shadow-sm">Pro</span>}
                  </h3>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 flex items-center gap-1">
                    <Clock size={10} /> {MODE_INFO[mode].time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-snug mb-2">{MODE_INFO[mode].desc}</p>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-white/50 px-2 py-0.5 rounded border border-slate-100 text-slate-400 font-medium">
                    {MODE_INFO[mode].count} 题
                  </span>
                </div>
              </div>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
            </button>
          );
        })}
        
        <button onClick={() => setAppState(AppState.WELCOME)} className="text-sm text-slate-400 hover:text-slate-600 w-full text-center py-2">
          返回首页
        </button>
      </div>
    </div>
  );

  const renderLockedGate = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative max-w-md mx-auto">
      <BackgroundGradient />
      <div className="glass-card p-8 rounded-3xl w-full text-center shadow-xl border border-white/80">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
          <Lock className="text-white w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">解锁{MODE_INFO[testMode].title}</h2>
        <p className="text-xs text-slate-500 mb-8 leading-relaxed px-4">
          该模式包含深度市场数据分析与Offer级作品集指导，属于付费内容。请输入激活码开启。
        </p>
        <div className="space-y-4">
          <div className="relative">
            <input 
              type="text" 
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="请输入激活码 (例: VIP2026)"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-center font-bold tracking-widest text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400"
            />
            {unlockError && <p className="text-red-500 text-xs mt-2 font-medium">{unlockError}</p>}
          </div>
          <button 
            onClick={validateAccessCode}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <Sparkles size={18} /> 立即解锁
          </button>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 mb-3">还没有激活码？</p>
          <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
            点击获取激活码
          </button>
        </div>
      </div>
      <button onClick={() => setAppState(AppState.MODE_SELECT)} className="mt-6 text-sm text-slate-400 hover:text-slate-600">
        返回重选
      </button>
    </div>
  );

  const renderQuiz = () => {
    if (!currentQuestion) return null;
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    const moduleMap = { subconscious: 1, practical: 2, values: 3 };
    const currentModuleNum = moduleMap[currentModule];

    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto relative">
        <BackgroundGradient />
        <div className="px-6 pt-8 pb-2 z-10 sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-md transition-colors">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
               {/* 返回按钮 */}
               <button 
                 onClick={handlePrevious} 
                 className="mr-1 p-1 -ml-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                 title="返回上一题"
               >
                 <ArrowLeft size={20} />
               </button>
               
               <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold shadow-md">
                 {currentModuleNum}
               </span>
               <span className="text-sm font-bold text-slate-800 tracking-wide truncate max-w-[180px]">
                 {MODULE_TITLES[currentModule]}
               </span>
            </div>
            <span className="text-xs font-medium text-slate-400 font-mono">
              {currentQuestionIndex + 1} / {currentQuestions.length}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex gap-0.5 shadow-inner">
            <div className={`h-full bg-gradient-to-r ${MODE_INFO[testMode].color} transition-all duration-300 rounded-full`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="flex-1 flex flex-col px-6 py-6 justify-center overflow-hidden pb-20">
          <div ref={questionRef} className="transition-all duration-300 ease-out transform">
            <div className="mb-6">
               <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
                 <Hexagon size={12} className="text-blue-500" /> {CATEGORY_LABELS[currentQuestion.category]}
               </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug mb-10 tracking-tight">
              {currentQuestion.text}
            </h2>
            <div className="space-y-3">
              {[
                { val: 1, label: "非常不符合", emoji: "😶" },
                { val: 2, label: "比较不符合", emoji: "🤔" },
                { val: 3, label: "一般", emoji: "😐" },
                { val: 4, label: "比较符合", emoji: "🙂" },
                { val: 5, label: "非常符合", emoji: "😍" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => handleAnswer(opt.val)}
                  className="w-full py-4 px-6 glass-card glass-card-hover rounded-2xl text-left text-slate-700 font-medium transition-all flex justify-between items-center group active:scale-[0.98] duration-200"
                >
                  <span className="group-hover:text-slate-900">{opt.label}</span>
                  <span className="text-xl opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all">{opt.emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalyzing = () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center max-w-md mx-auto relative">
      <BackgroundGradient />
      <div className="relative mb-10 scale-125">
        <div className="w-24 h-24 rounded-full border-4 border-white/30 animate-[spin_3s_linear_infinite]"></div>
        <div className={`absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin`}></div>
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-800 w-8 h-8 animate-pulse" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">正在生成{MODE_INFO[testMode].subtitle}...</h2>
      <p className="text-sm text-slate-500 animate-pulse">分析 {currentQuestions.length} 维数据 / 检索 2026 岗位库</p>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;
    const isBasic = testMode === 'basic';
    // Check if it's the troll result by checking userPersona text
    const isTroll = result.userPersona === "淡定佛系·人类复读机";

    return (
      <div className="min-h-screen bg-[#FAFAFA] pb-12 max-w-md mx-auto relative print:max-w-none print:bg-white print:pb-0">
        <BackgroundGradient />
        
        <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 border-b border-slate-100 shadow-sm flex justify-between items-center print:static print:border-none print:shadow-none print:px-0 print:mb-8">
           <div className="print:hidden">
             <h2 className="font-bold text-slate-800">{isTroll ? "彩蛋报告" : MODE_INFO[testMode].title + "报告"}</h2>
             <p className="text-[10px] text-slate-400 font-mono">Career Compass © 2026</p>
           </div>
           <div className="hidden print:block text-center w-full">
             <h1 className="text-3xl font-bold text-slate-900 mb-2">2026 视觉传达就业深度诊断报告</h1>
             <p className="text-sm text-slate-500">Design Career Compass Pro | 2026 Edition</p>
           </div>
           <div className="flex gap-2 print:hidden">
             <button onClick={handlePrint} className="p-2 rounded-full bg-slate-100 text-indigo-600 hover:bg-indigo-50 transition-colors" title="保存报告">
                <Printer size={18} />
             </button>
             <button onClick={handleRestart} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
                <RefreshCw size={18} />
             </button>
           </div>
        </div>

        <div className="px-5 pt-6 space-y-6 print:px-8 print:space-y-8">
          
          {/* Persona Card */}
          <div className="glass-card p-6 rounded-3xl shadow-lg shadow-indigo-100/50 relative overflow-hidden print:shadow-none print:border print:border-slate-200 print:break-inside-avoid">
             <div className="absolute top-0 right-0 bg-gradient-to-bl from-indigo-500 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm print:hidden">
               核心画像
             </div>
             <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md print:border print:border-slate-900 print:bg-white print:text-slate-900">
                  <UserCircle2 className="text-white w-7 h-7 print:text-slate-900" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">测评结果分析</p>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight pr-4">{result.userPersona}</h3>
                </div>
             </div>
             <div className="h-56 -mx-2 print:h-64 print:mb-4">
               <AbilityRadar data={result.abilityRadar} />
             </div>
             <div className="mt-2 p-4 bg-white/60 rounded-2xl border border-white shadow-sm print:border-slate-100 print:bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-slate-800" />
                  <span className="text-xs font-bold text-slate-800">2026 市场洞察</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed text-justify">
                  {result.marketAnalysis}
                </p>
             </div>
          </div>

          {/* Top Jobs */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider pl-2 flex items-center gap-2 print:text-slate-900 print:text-lg print:border-b print:pb-2 print:mb-6">
              <Sparkles size={14}/> 推荐职业方向
            </h3>
            
            <div className="space-y-10 print:space-y-12">
              {result.topMatches.map((job, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] p-1 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden print:shadow-none print:border print:border-slate-300 print:rounded-xl print:break-inside-avoid">
                  
                  {/* Header */}
                  <div className={`p-6 rounded-[1.8rem] print:rounded-t-xl print:rounded-b-none ${idx === 0 ? 'bg-slate-900 text-white print:bg-slate-100 print:text-slate-900' : 'bg-slate-50 text-slate-800'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-2xl font-bold tracking-tight">{job.jobTitle}</h4>
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${idx === 0 ? 'bg-white/20 print:bg-slate-200 print:text-slate-800' : 'bg-white border border-slate-200 text-slate-600'}`}>
                        {job.matchScore}% 匹配
                      </div>
                    </div>
                    <p className={`text-xs mb-3 ${idx === 0 ? 'text-slate-400 print:text-slate-600' : 'text-slate-500'}`}>{job.description}</p>
                    <div className="flex flex-wrap gap-2">
                       {job.tags.map(tag => (
                         <span key={tag} className={`text-[10px] px-2.5 py-1 rounded-md font-bold ${idx === 0 ? 'bg-white/10 text-white/90 print:bg-white print:border print:border-slate-300 print:text-slate-600' : 'bg-white border border-slate-200 text-slate-500'}`}>
                           {tag}
                         </span>
                       ))}
                    </div>
                  </div>

                  {/* Detailed Content */}
                  <div className="p-5 space-y-6 print:p-6 print:text-sm">
                    
                    {/* 1. Why & Reality - Always Visible */}
                    <div className="grid gap-4 print:grid-cols-2">
                       <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 print:bg-white print:border-slate-200">
                         <h5 className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-2 print:text-slate-900">
                           <BrainCircuit size={14}/> 核心适配逻辑
                         </h5>
                         <p className="text-xs text-slate-600 leading-relaxed text-justify print:text-slate-800">
                           {job.fitReason}
                         </p>
                       </div>

                       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 print:bg-white print:border-slate-200">
                         <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                           <BriefcaseBusiness size={14}/> 真实工作日常
                         </h5>
                         <p className="text-xs text-slate-600 leading-relaxed print:text-slate-800">
                           {job.dailyWork}
                         </p>
                       </div>
                    </div>

                    {/* 2. School & Learning Strategy - BLURRED IN BASIC MODE */}
                    <div className={`print:border-t print:border-slate-100 print:pt-4 relative transition-all duration-300 ${isBasic && !isTroll ? 'blur-sm select-none grayscale opacity-70' : ''}`}>
                       {isBasic && !isTroll && (
                         <div className="absolute inset-0 z-20 flex items-center justify-center">
                           <div className="bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2">
                             <Lock size={12} /> 付费版解锁 [在校通关攻略]
                           </div>
                         </div>
                       )}
                       <div className="flex items-center gap-2 mb-3">
                          <span className="bg-indigo-100 text-indigo-600 p-1 rounded print:bg-slate-200 print:text-slate-800"><BookOpen size={12}/></span>
                          <span className="text-xs font-bold text-slate-800 uppercase">在校通关攻略</span>
                       </div>
                       <div className="space-y-2">
                          <div className="flex gap-3 text-xs border-l-2 border-indigo-100 pl-3 py-1 print:border-slate-300">
                             <span className="font-bold text-slate-500 min-w-[60px]">课程重点:</span>
                             <div className="flex flex-wrap gap-1">
                                {(job.curriculumFocus || ['排版设计', '字体设计', '品牌形象']).map(c => <span key={c} className="text-slate-700 bg-slate-100 px-1.5 rounded print:border print:border-slate-200">{c}</span>)}
                             </div>
                          </div>
                          <div className="flex gap-3 text-xs border-l-2 border-indigo-100 pl-3 py-1 print:border-slate-300">
                             <span className="font-bold text-slate-500 min-w-[60px]">必学软件:</span>
                             <div className="flex flex-wrap gap-1">
                                {(job.softwareStack || ['Ps', 'Ai', 'Ae']).map(s => <span key={s} className="text-slate-700 bg-slate-100 px-1.5 rounded print:border print:border-slate-200">{s}</span>)}
                             </div>
                          </div>
                          <div className="flex gap-3 text-xs border-l-2 border-indigo-100 pl-3 py-1 print:border-slate-300">
                             <span className="font-bold text-slate-500 min-w-[60px]">行动目标:</span>
                             <ul className="flex-1 space-y-1">
                                {(job.selfStudyGoals || ['参加一次设计比赛', '完成3个完整作品']).map(g => <li key={g} className="text-slate-700">• {g}</li>)}
                             </ul>
                          </div>
                       </div>
                    </div>

                    {/* 3. Portfolio & Internship - BLURRED IN BASIC MODE */}
                    <div className={`print:border-t print:border-slate-100 print:pt-4 relative transition-all duration-300 ${isBasic && !isTroll ? 'blur-sm select-none grayscale opacity-70' : ''}`}>
                       {isBasic && !isTroll && (
                         <div className="absolute inset-0 z-20 flex items-center justify-center">
                           <div className="bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2">
                             <Lock size={12} /> 付费版解锁 [作品集 & 实习]
                           </div>
                         </div>
                       )}
                       <div className="flex items-center gap-2 mb-3">
                          <span className="bg-pink-100 text-pink-600 p-1 rounded print:bg-slate-200 print:text-slate-800"><Building2 size={12}/></span>
                          <span className="text-xs font-bold text-slate-800 uppercase">作品集 & 实习规划</span>
                       </div>
                       <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100 space-y-3 print:bg-white print:border-slate-200">
                          <div>
                            <span className="block text-[10px] font-bold text-pink-400 mb-1 print:text-slate-500">作品集核心策略</span>
                            <p className="text-xs text-slate-700">{job.portfolioFocus || "你需要准备3-4个完整的商业案例，体现设计推导过程。"}</p>
                          </div>
                          <div className="pt-2 border-t border-pink-100/50 print:border-slate-100">
                            <span className="block text-[10px] font-bold text-purple-400 mb-1 print:text-slate-500">最佳实习路径</span>
                            <p className="text-xs text-slate-700">{job.internshipPath || "建议大三开始在广告公司实习，积累实战经验。"}</p>
                          </div>
                       </div>
                    </div>

                    {/* 4. Money & Growth - BLURRED IN BASIC MODE */}
                    <div className={`print:border-t print:border-slate-100 print:pt-4 relative transition-all duration-300 ${isBasic && !isTroll ? 'blur-sm select-none grayscale opacity-70' : ''}`}>
                       {isBasic && !isTroll && (
                         <div className="absolute inset-0 z-20 flex items-center justify-center">
                           <div className="bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2">
                             <Lock size={12} /> 付费版解锁 [薪资 & 钱途]
                           </div>
                         </div>
                       )}
                       <div className="grid grid-cols-2 gap-3">
                          <div className="bg-green-50 p-3 rounded-xl border border-green-100 print:bg-white print:border-slate-200">
                             <div className="flex items-center gap-1.5 mb-1 text-green-700">
                                <DollarSign size={12} />
                                <span className="text-[10px] font-bold">起薪预测 (一线)</span>
                             </div>
                             <p className="text-sm font-bold text-green-800">{job.salaryRange || "¥8k - 12k"}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 print:bg-white print:border-slate-200">
                             <h6 className="text-[10px] font-bold text-slate-500 mb-1">晋升路径</h6>
                             <p className="text-xs text-slate-600">{job.careerGrowth}</p>
                          </div>
                       </div>
                    </div>

                     {/* 5. PAIN POINTS & INVOLUTION (NEW - RED THEME) */}
                    <div className={`print:border-t print:border-slate-100 print:pt-4 relative transition-all duration-300 ${isBasic && !isTroll ? 'blur-sm select-none grayscale opacity-70' : ''}`}>
                        {isBasic && !isTroll && (
                         <div className="absolute inset-0 z-20 flex items-center justify-center">
                           <div className="bg-red-900/90 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2">
                             <ShieldCheck size={12} /> 付费版解锁 [行业内幕 & 避坑]
                           </div>
                         </div>
                       )}
                       <div className="flex items-center gap-2 mb-3">
                          <span className="bg-red-100 text-red-600 p-1 rounded print:bg-slate-200 print:text-slate-800"><AlertTriangle size={12}/></span>
                          <span className="text-xs font-bold text-slate-800 uppercase">行业真相 & 现实痛点</span>
                       </div>
                       <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 space-y-4 print:bg-white print:border-slate-200">
                           <div>
                             <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold bg-red-200 text-red-800 px-1.5 rounded">内卷指数</span>
                                <span className="text-xs font-bold text-red-700">{job.involutionIndex || "高"}</span>
                             </div>
                             <p className="text-xs text-slate-600 leading-relaxed mb-3">{job.futureOutlook}</p>
                           </div>
                           <div>
                             <h6 className="text-[10px] font-bold text-red-800 mb-2">必看劝退指南 (Pain Points)</h6>
                             <ul className="space-y-1.5">
                                {(job.painPoints || ["长期久坐职业病", "35岁发展瓶颈", "加班强度大"]).map((p, i) => (
                                   <li key={i} className="text-xs text-slate-700 flex gap-2 items-start">
                                     <span className="text-red-400 mt-0.5">×</span> {p}
                                   </li>
                                ))}
                             </ul>
                           </div>
                       </div>
                    </div>

                     {/* 6. SIDE HUSTLE & WEALTH (NEW - GOLD THEME) */}
                    <div className={`print:border-t print:border-slate-100 print:pt-4 relative transition-all duration-300 ${isBasic && !isTroll ? 'blur-sm select-none grayscale opacity-70' : ''}`}>
                       {isBasic && !isTroll && (
                         <div className="absolute inset-0 z-20 flex items-center justify-center">
                           <div className="bg-yellow-900/90 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2">
                             <Coins size={12} /> 付费版解锁 [独家接单渠道]
                           </div>
                         </div>
                       )}
                       <div className="flex items-center gap-2 mb-3">
                          <span className="bg-yellow-100 text-yellow-700 p-1 rounded print:bg-slate-200 print:text-slate-800"><Flame size={12}/></span>
                          <span className="text-xs font-bold text-slate-800 uppercase">搞钱 & 接单渠道</span>
                       </div>
                       <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-200/60 print:bg-white print:border-slate-200">
                          <div className="flex flex-wrap gap-2">
                             {(job.sideHustleChannels || ["米画师", "特赞", "站酷", "小红书接单"]).map((channel, i) => (
                               <span key={i} className="px-3 py-1.5 bg-white border border-yellow-200 rounded-lg text-xs font-bold text-yellow-800 shadow-sm flex items-center gap-1">
                                  <DollarSign size={10} className="text-yellow-500"/> {channel}
                               </span>
                             ))}
                          </div>
                          <p className="text-[10px] text-yellow-800/60 mt-3 text-center">
                            * 来源于2026副业兼职数据中心
                          </p>
                       </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isBasic && !isTroll && (
           <div className="sticky bottom-4 mx-4 mt-8 print:hidden">
              <div className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20">
                 <div>
                   <p className="text-xs font-bold text-yellow-300">解锁完整版《行业劝退指南》</p>
                   <p className="text-[10px] text-slate-300">含 35+ 岗位痛点 & 100+ 接单变现渠道</p>
                 </div>
                 <button onClick={() => {setResult(null); handleModeSelection('deep');}} className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-100">
                   去解锁 Pro 版
                 </button>
              </div>
           </div>
        )}
      </div>
    );
  };

  const renderError = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto relative">
      <BackgroundGradient />
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">生成报告时遇到一点阻碍</h2>
      <p className="text-sm text-slate-600 mb-2 font-medium">别担心，您的答题记录<span className="text-indigo-600 font-bold">已自动保存</span>。</p>
      <p className="text-xs text-slate-400 mb-8">可能是网络波动或访问人数过多，请点击下方按钮重试。</p>
      
      <div className="space-y-3 w-full">
        <button 
          onClick={handleRetryAnalysis}
          className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} /> 再次尝试生成 (保留答案)
        </button>
        
        <button 
          onClick={handleRestart}
          className="w-full px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50"
        >
          放弃并返回首页
        </button>
      </div>
    </div>
  );

  return (
    <>
      {appState === AppState.WELCOME && renderWelcome()}
      {appState === AppState.MODE_SELECT && renderModeSelect()}
      {appState === AppState.LOCKED_GATE && renderLockedGate()}
      {appState === AppState.QUIZ && renderQuiz()}
      {appState === AppState.ANALYZING && renderAnalyzing()}
      {appState === AppState.RESULT && renderResult()}
      {appState === AppState.ERROR && renderError()}
    </>
  );
};

export default App;
