import { Question, TestMode } from './types';

// All 72 Questions in reservoir
const ALL_QUESTIONS: Question[] = [
  // --- MODULE 1: 潜意识与天赋 (Subconscious / Innate) ---
  { id: 1, text: "看电影时，我更容易被独特的色调滤镜和光影氛围吸引，而不是剧情逻辑。", category: "creative", module: "subconscious" },
  { id: 2, text: "面对杂乱的书桌或电脑桌面，我本能地想要把物品/文件对齐、分类，构建秩序。", category: "logic", module: "subconscious" },
  { id: 3, text: "走在街上，我会不自觉地观察路牌、导视系统，并思考它们是否让人容易迷路。", category: "empathy", module: "subconscious" },
  { id: 4, text: "比起在屏幕上做图，我更喜欢触摸不同纸张的纹理，闻到印刷品油墨的味道。", category: "spatial", module: "subconscious" },
  { id: 5, text: "看到一款APP的按钮很难点，或者流程反人类，我会感到非常烦躁并想重画它。", category: "execution", module: "subconscious" },
  { id: 6, text: "我脑海中的灵感往往是动态的、有节奏的，而不是一张静止的JPG。", category: "creative", module: "subconscious" },
  { id: 7, text: "在小组作业中，我经常不知不觉成为那个分配任务、催促进度的人。", category: "management", module: "subconscious" },
  { id: 8, text: "我对商业世界很感兴趣，看到爆款产品会思考它背后的营销逻辑和卖点。", category: "commercial", module: "subconscious" },
  { id: 9, text: "我对所有新技术（如AI绘图、VR眼镜、甚至代码）都充满强烈的好奇心，想第一个尝试。", category: "tech", module: "subconscious" },
  { id: 10, text: "我更倾向于用感性的、艺术化的插画来表达情绪，而不是用冷静的数据图表。", category: "creative", module: "subconscious" },
  { id: 11, text: "我是一个细节控，哪怕是一个像素的偏差或字间距的不平衡都会让我抓狂。", category: "execution", module: "subconscious" },
  { id: 12, text: "比起独自埋头画图，我更享受和不同专业的人（如程序员、文案）一起碰撞想法。", category: "management", module: "subconscious" },
  { id: 13, text: "我不仅关注物体本身，更关注物体在空间中的摆放位置以及与人的距离感。", category: "spatial", module: "subconscious" },
  { id: 14, text: "我擅长逻辑推理，喜欢像解数学题一样去推导出一个设计的解决方案。", category: "logic", module: "subconscious" },
  { id: 15, text: "我很容易共情他人的痛苦，希望能通过设计帮助老年人、残障人士等弱势群体。", category: "empathy", module: "subconscious" },
  { id: 16, text: "我对时尚潮流非常敏感，总能第一时间捕捉到当下最火的视觉风格（如酸性、Y2K）。", category: "creative", module: "subconscious" },
  { id: 17, text: "我不排斥重复性的工作，只要能把一套规范（如VI系统）做到极致的统一和标准化。", category: "logic", module: "subconscious" },
  { id: 18, text: "我觉得设计不仅要好看，更要“好卖”，不能变现的设计是空洞的。", category: "commercial", module: "subconscious" },
  { id: 19, text: "我经常幻想创造一个属于自己的虚拟角色或世界观，并赋予它们生命。", category: "creative", module: "subconscious" },
  { id: 20, text: "我对数据很敏感，看到复杂的信息，脑海里会自动浮现出图表和结构。", category: "logic", module: "subconscious" },
  { id: 21, text: "我喜欢动手做手工、模型或折纸，对物理材质的构造结构有天生的直觉。", category: "spatial", module: "subconscious" },
  { id: 22, text: "在遇到问题时，我更习惯去Google/B站搜索技术教程解决，而不是问人或放弃。", category: "tech", module: "subconscious" },
  { id: 23, text: "我喜欢听故事，也喜欢讲故事，我认为设计就是一种视觉化的叙事手段。", category: "creative", module: "subconscious" },
  { id: 24, text: "对于别人的批评，我能理性分析并在下个版本中快速迭代，不会玻璃心。", category: "management", module: "subconscious" },

  // --- MODULE 2: 实战与技能 (Practical / Skills) ---
  { id: 25, text: "为了画出一个完美的贝塞尔曲线图标，我可以反复调整半小时。", category: "execution", module: "practical" },
  { id: 26, text: "我不排斥学习代码（HTML/CSS/Processing），觉得能亲手控制网页效果很酷。", category: "tech", module: "practical" },
  { id: 27, text: "我经常玩 C4D / Blender，对材质节点、布光渲染和UV贴图有深入研究。", category: "tech", module: "practical" },
  { id: 28, text: "做排版时，我会优先建立 Grid（网格系统）和文字规范，而不是凭感觉摆放。", category: "logic", module: "practical" },
  { id: 29, text: "我能熟练绘制分镜脚本（Storyboard），理解推拉摇移等镜头语言。", category: "creative", module: "practical" },
  { id: 30, text: "我对包装的刀版结构很熟悉，知道怎么折叠能既美观又节省印刷成本。", category: "spatial", module: "practical" },
  { id: 31, text: "我能将枯燥的 Excel 数据转化为直观、高颜值的信息可视化图表。", category: "logic", module: "practical" },
  { id: 32, text: "我有较强的手绘功底，有自己独特的插画风格（如板绘、水彩、像素风等）。", category: "creative", module: "practical" },
  { id: 33, text: "做界面时，我会反复测试按钮大小和点击区域，确保用户操作的手感舒适。", category: "empathy", module: "practical" },
  { id: 34, text: "我擅长写设计说明，能逻辑清晰地把我的设计推导过程讲给甲方或老师听。", category: "management", module: "practical" },
  { id: 35, text: "我熟练掌握 Figma 的 Auto Layout 和组件变体（Variants）功能。", category: "tech", module: "practical" },
  { id: 36, text: "我经常使用 Midjourney 或 Stable Diffusion 辅助生成素材，并能修补AI的瑕疵。", category: "tech", module: "practical" },
  { id: 37, text: "我知道什么是 CMYK、出血位、烫金、UV等印刷工艺，并有实际跟厂经验。", category: "spatial", module: "practical" },
  { id: 38, text: "我能剪辑视频，熟练使用 PR/Final Cut，并能用 AE 制作流畅的动效。", category: "creative", module: "practical" },
  { id: 39, text: "我了解电商大促的作图逻辑，能快速产出高点击率的主图和详情页。", category: "commercial", module: "practical" },
  { id: 40, text: "我具备用户调研能力，会设计问卷、绘制用户体验地图（Journey Map）。", category: "empathy", module: "practical" },
  { id: 41, text: "我擅长做 PPT/Keynote，能把平平无奇的内容排版得极具说服力。", category: "management", module: "practical" },
  { id: 42, text: "我对字体的骨架、字重、字间距非常敏感，甚至尝试过自己设计字体。", category: "execution", module: "practical" },
  { id: 43, text: "我了解 Unity 或 Unreal Engine 的基础操作，对游戏美术或虚拟场景搭建感兴趣。", category: "tech", module: "practical" },
  { id: 44, text: "我能策划一个完整的品牌全案，从 Logo 到 VI 再到周边延展。", category: "logic", module: "practical" },
  { id: 45, text: "我关注展陈设计，知道如何在空间中安排动线，引导观众的视线。", category: "spatial", module: "practical" },
  { id: 46, text: "我习惯整理自己的素材库和文件命名规范，绝不会出现“最终版_打死不改.psd”。", category: "management", module: "practical" },
  { id: 47, text: "我有IP角色设计经验，能画出角色的三视图和表情包。", category: "creative", module: "practical" },
  { id: 48, text: "我了解网页无障碍设计（Accessibility），知道如何为色盲或视障用户优化设计。", category: "empathy", module: "practical" },

  // --- MODULE 3: 价值观与野心 (Values / Ambition) ---
  { id: 49, text: "相比做艺术家，我更希望我的设计能直接帮助商家提升销量，哪怕它看起来比较“俗”。", category: "commercial", module: "values" },
  { id: 50, text: "我不介意在互联网大厂的高强度节奏下工作，只要能拿到远高于行业的薪资。", category: "commercial", module: "values" },
  { id: 51, text: "我更向往体系化的大公司，有明确的晋升职级（P5/P6...）和导师带教。", category: "management", module: "values" },
  { id: 52, text: "我希望我的工作是面向未来的，时刻准备着迎接 AR/MR/AI 等新技术的挑战。", category: "tech", module: "values" },
  { id: 53, text: "如果我的设计能改善社会问题（如环保、老龄化），我会获得最大的成就感。", category: "empathy", module: "values" },
  { id: 54, text: "我喜欢实体落地的感觉，看到自己的设计被印在包装上摆在超市里，我会很激动。", category: "spatial", module: "values" },
  { id: 55, text: "我不想只做画图的螺丝钉，我更想成长为懂产品、懂运营的全能型管理者（Product Designer）。", category: "management", module: "values" },
  { id: 56, text: "对于AI取代设计，我并不恐慌，反而觉得这是淘汰低端劳动力、提升我效率的机会。", category: "tech", module: "values" },
  { id: 57, text: "我希望能深耕一个品牌，花几年时间打磨它的视觉资产，而不是每天做不同的海报。", category: "logic", module: "values" },
  { id: 58, text: "我认为设计应该是有趣的、好玩的，工作最大的意义是给平淡的生活带来惊喜。", category: "creative", module: "values" },
  { id: 59, text: "我更喜欢去游戏行业，参与构建一个宏大的虚拟世界，哪怕加班也乐意。", category: "creative", module: "values" },
  { id: 60, text: "比起在大城市卷，我更倾向于考公、进国企或去高校当老师，追求稳定。", category: "management", module: "values" },
  { id: 61, text: "我无法忍受一成不变的工作，我需要不断的创意挑战和新鲜感。", category: "creative", module: "values" },
  { id: 62, text: "我看重工作的灵活性，未来希望能成为一名数字游民或自由插画师。", category: "management", module: "values" },
  { id: 63, text: "我认为数据是检验设计的唯一标准，点击率高就是好设计。", category: "logic", module: "values" },
  { id: 64, text: "我更愿意在只有几个人但充满激情的创业团队工作，和公司一起成长。", category: "management", module: "values" },
  { id: 65, text: "我对实体书店、出版行业有情怀，希望致力于纸质书的设计与传承。", category: "spatial", module: "values" },
  { id: 66, text: "我希望能进入4A广告公司，服务世界500强客户，做那种出街的大创意。", category: "commercial", module: "values" },
  { id: 67, text: "我不喜欢纯粹的执行，我喜欢参与前期的头脑风暴和策略制定。", category: "logic", module: "values" },
  { id: 68, text: "我希望能做一些很酷的、地下的、实验性的设计，哪怕受众很小。", category: "creative", module: "values" },
  { id: 69, text: "我对用户心理学很感兴趣，喜欢研究人们为什么会点击这个按钮。", category: "empathy", module: "values" },
  { id: 70, text: "我希望通过设计实现财富自由，哪个赛道（如短视频、直播）最赚钱我就去哪。", category: "commercial", module: "values" },
  { id: 71, text: "我是一个“成分党”，对设计背后的技术实现原理（如代码、材质）非常执着。", category: "tech", module: "values" },
  { id: 72, text: "我希望能拥有自己的个人IP品牌，通过粉丝经济变现。", category: "commercial", module: "values" }
];

// Helper to get questions by mode
export const getQuestionsForMode = (mode: TestMode): Question[] => {
  switch (mode) {
    case 'basic':
      // 12 Questions: High-level preference across all categories
      // Selected IDs to be balanced: 1, 2, 4, 5, 7, 8, 9, 13, 15, 18, 22, 23
      return ALL_QUESTIONS.filter(q => [1, 2, 4, 5, 7, 8, 9, 13, 15, 18, 22, 23].includes(q.id));
    case 'standard':
      // 30 Questions: Module 1 + some Practical
      // First 30 questions of the list, they are already well mixed
      return ALL_QUESTIONS.slice(0, 30);
    case 'deep':
      // 62 Questions: Almost full set, excluding a few very niche or redundant ones
      return ALL_QUESTIONS.slice(0, 62);
    default:
      return ALL_QUESTIONS.slice(0, 30);
  }
};

export const MODE_INFO = {
  basic: {
    title: "基础版",
    subtitle: "快速摸底测试",
    count: 12,
    time: "2分钟",
    desc: "核心性格与设计直觉扫描，适合大一/大二初步探索。",
    color: "from-blue-400 to-cyan-400"
  },
  standard: {
    title: "综合版",
    subtitle: "全维能力评估",
    count: 30,
    time: "5分钟",
    desc: "结合性格与核心技能树，精准定位主流就业赛道。",
    color: "from-purple-400 to-pink-400"
  },
  deep: {
    title: "深度版",
    subtitle: "专家级职业诊断",
    count: 62,
    time: "10分钟",
    desc: "包含价值观、隐性痛点与高阶野心，提供Offer级咨询报告。",
    color: "from-orange-400 to-red-400"
  }
};

export const CATEGORY_LABELS: Record<string, string> = {
  creative: "创意叙事",
  logic: "逻辑体系",
  empathy: "用户体验",
  execution: "极致执行",
  commercial: "商业嗅觉",
  tech: "技术驱动",
  spatial: "空间感知",
  management: "统筹沟通"
};

export const MODULE_TITLES: Record<string, string> = {
  subconscious: "第一阶段：潜意识与天赋挖掘",
  practical: "第二阶段：核心技能与实战力",
  values: "第三阶段：职业价值观与野心"
};

// --- ACCESS CODES ---
// 商业化关键：你可以在这里放入成百上千个码
// 运营方法：用Excel生成一批 "VIP" + 随机数字，粘贴在这里
// 卖出一个，就在你的Excel里标记“已售出”
export const VALID_ACCESS_CODES = [
  // 测试用
  "VIP2026", "TEST", "ADMIN", "VIP888", "VIP666", 
  
  // 预埋批次 A (示例)
  "DESIGN001", "DESIGN002", "DESIGN003", "JOB2026",
  // ... 你可以在这里无限添加
];
