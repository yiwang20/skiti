# SKTI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Next.js skiing personality test site where users answer 30 questions, get matched to one of 25 personalities, and share results via URL.

**Architecture:** Next.js 14 App Router with static export. All data (questions, personalities, dimensions) lives in TypeScript files under `data/`. Scoring logic computes dimension scores from answers, maps to a personality type, and encodes scores into a URL parameter. No backend — everything runs client-side.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, html2canvas

---

## File Structure

```
ski-mbti/
├── app/
│   ├── layout.tsx              # Root layout: font, metadata, Navbar, Footer
│   ├── page.tsx                # Home page
│   ├── test/page.tsx           # Test page (client component, manages quiz state)
│   ├── result/[type]/page.tsx  # Result page (reads URL params, shows personality)
│   ├── types/page.tsx          # All personalities grid
│   ├── type/[slug]/page.tsx    # Single personality detail
│   ├── about/page.tsx          # About the test
│   └── globals.css             # Tailwind directives + custom styles
├── components/
│   ├── Navbar.tsx              # Top nav with links
│   ├── Footer.tsx              # Site footer
│   ├── QuestionCard.tsx        # Single question with A/B/C buttons
│   ├── ProgressBar.tsx         # Quiz progress indicator
│   ├── DimensionChart.tsx      # Bar chart for one dimension
│   ├── PersonalityCard.tsx     # Card showing personality preview
│   └── ShareButtons.tsx        # Copy link + download share card
├── data/
│   ├── dimensions.ts           # 6 dimension definitions
│   ├── questions.ts            # 30 questions with dimension mappings
│   └── personalities.ts        # 25 personality definitions
├── lib/
│   ├── scoring.ts              # Answer → dimension scores → personality type
│   └── encoding.ts             # Encode/decode dimension scores to/from URL param
├── public/
│   └── images/
│       └── personalities/      # AI-generated personality images (placeholder)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/peter/dev/ski-mbti
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --no-git
```

If prompted about existing files, allow overwrite. The `docs/` folder will be preserved.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install framer-motion html2canvas
```

- [ ] **Step 3: Configure static export**

Edit `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

- [ ] **Step 4: Set up global styles**

Replace `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #4a7c6f;
  --color-primary-light: #e8f0ed;
  --color-bg: #f5f7f5;
  --color-text: #1a2e1a;
  --color-text-secondary: #5a6e5a;
  --color-border: #d4ddd4;
  --color-card: #ffffff;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

- [ ] **Step 5: Create root layout**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKTI 滑雪人格测试",
  description: "测测你是哪种滑雪人格 - Ski Type Indicator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Create placeholder home page**

Replace `app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <h1 className="text-4xl font-bold">SKTI 滑雪人格测试</h1>
    </main>
  );
}
```

- [ ] **Step 7: Verify build**

```bash
npm run build
```

Expected: Build succeeds with static export to `out/`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind and static export"
```

---

## Task 2: Data Layer — Dimensions, Questions, Personalities

**Files:**
- Create: `data/dimensions.ts`, `data/questions.ts`, `data/personalities.ts`

- [ ] **Step 1: Define dimension types and data**

Create `data/dimensions.ts`:

```ts
export interface Dimension {
  id: string;
  name: string;
  lowLabel: string;
  highLabel: string;
  type: "serious" | "funny" | "mixed";
}

export const dimensions: Dimension[] = [
  {
    id: "s1",
    name: "技术风格",
    lowLabel: "稳健派",
    highLabel: "莽夫派",
    type: "serious",
  },
  {
    id: "s2",
    name: "选道偏好",
    lowLabel: "道内安全员",
    highLabel: "野雪探险家",
    type: "serious",
  },
  {
    id: "s3",
    name: "社交属性",
    lowLabel: "独狼",
    highLabel: "雪场社牛",
    type: "mixed",
  },
  {
    id: "s4",
    name: "装扮执念",
    lowLabel: "随便套个羽绒服",
    highLabel: "雪场时装周",
    type: "funny",
  },
  {
    id: "s5",
    name: "摸鱼指数",
    lowLabel: "滑到缆车停",
    highLabel: "第三趟就去吃火锅",
    type: "funny",
  },
  {
    id: "s6",
    name: "装备心态",
    lowLabel: "能用就行",
    highLabel: "全套顶配还没学会刹车",
    type: "funny",
  },
];
```

- [ ] **Step 2: Define question types and data**

Create `data/questions.ts`:

```ts
export interface Question {
  id: number;
  text: string;
  options: [string, string, string]; // A, B, C
  /** Which dimensions this question affects: [dimensionId, scoreA, scoreB, scoreC] */
  effects: Array<{ dim: string; scores: [number, number, number] }>;
}

export const questions: Question[] = [
  {
    id: 1,
    text: "缆车上你一般在干嘛？",
    options: [
      "复盘刚才那条线",
      "刷手机",
      "跟旁边陌生人聊今天雪况",
    ],
    effects: [
      { dim: "s1", scores: [3, 2, 1] },
      { dim: "s3", scores: [1, 2, 3] },
    ],
  },
  {
    id: 2,
    text: "你摔倒的时候雪镜飞了，帽子也飞了，手套也飞了，你第一反应？",
    options: [
      "先找手机看碎没碎",
      "保持摔倒的姿势不动，假装在做雪天使",
      "大喊"有没有人帮我录到了"",
    ],
    effects: [
      { dim: "s3", scores: [1, 2, 3] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 3,
    text: "如果你的滑雪板会说话，它最可能说的是？",
    options: [
      "求你了轻点",
      "我们又来这条道了？第47次了",
      "你根本配不上我",
    ],
    effects: [
      { dim: "s1", scores: [3, 1, 2] },
      { dim: "s6", scores: [1, 2, 3] },
    ],
  },
  {
    id: 4,
    text: "你在雪场看到有人穿西装打领带在滑雪，你？",
    options: [
      "这人比我有排面",
      "过去问他是不是刚开完会",
      "明天我也穿",
    ],
    effects: [
      { dim: "s4", scores: [2, 1, 3] },
      { dim: "s3", scores: [1, 3, 2] },
    ],
  },
  {
    id: 5,
    text: "你在缆车上，前面的人雪板上绑了一只毛绒企鹅，你？",
    options: [
      "我也想要一只",
      "默默拍照发朋友圈"今日雪场显眼包"",
      "下缆车后跟着他滑了三趟试图搭讪问哪买的",
    ],
    effects: [
      { dim: "s4", scores: [2, 1, 3] },
      { dim: "s3", scores: [1, 2, 3] },
    ],
  },
  {
    id: 6,
    text: "雪具室里你的板子是？",
    options: [
      "租的，能滑就行",
      "自己的板，用了几年了",
      "限量联名款，比我滑得好",
    ],
    effects: [{ dim: "s6", scores: [1, 2, 3] }],
  },
  {
    id: 7,
    text: "下午三点，你在？",
    options: [
      "还在刷道",
      "休息室喝杯咖啡准备最后几趟",
      "已经在山下吃火锅了",
    ],
    effects: [{ dim: "s5", scores: [1, 2, 3] }],
  },
  {
    id: 8,
    text: "面对一条你没滑过的黑道，你？",
    options: [
      "先在旁边观察别人怎么滑的",
      "深呼吸然后慢慢下去",
      "直接冲，大不了摔一跤",
    ],
    effects: [
      { dim: "s1", scores: [1, 2, 3] },
      { dim: "s2", scores: [1, 2, 3] },
    ],
  },
  {
    id: 9,
    text: "你的雪服颜色是？",
    options: [
      "黑灰为主，低调实用",
      "有点颜色但不夸张",
      "全身荧光色，生怕别人看不见我",
    ],
    effects: [{ dim: "s4", scores: [1, 2, 3] }],
  },
  {
    id: 10,
    text: "有人在你面前摔了一个超夸张的跟头，你？",
    options: [
      "赶紧上去问他没事吧",
      "先确认他没事，然后忍不住笑",
      "掏出手机——这段可以发抖音",
    ],
    effects: [
      { dim: "s3", scores: [2, 2, 3] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 11,
    text: "你买滑雪装备的决策依据是？",
    options: [
      "性价比，够用就行",
      "看测评研究一番",
      "好看就行，性能什么的再说",
    ],
    effects: [
      { dim: "s6", scores: [1, 2, 3] },
      { dim: "s4", scores: [1, 2, 3] },
    ],
  },
  {
    id: 12,
    text: "你的滑雪朋友圈画风是？",
    options: [
      "很少发，滑就完了",
      "偶尔发个风景或者滑行视频",
      "九宫格精修图+详细文案+定位",
    ],
    effects: [
      { dim: "s3", scores: [1, 2, 3] },
      { dim: "s4", scores: [1, 2, 3] },
    ],
  },
  {
    id: 13,
    text: "如果雪场有蹦迪夜场，你去吗？",
    options: [
      "不去，我是来滑雪的",
      "看情况，人多热闹去凑个乐",
      "我就是为这个来的，雪都不用下",
    ],
    effects: [
      { dim: "s3", scores: [1, 2, 3] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 14,
    text: "你摔了一个大跟头，旁边有人在看，你会？",
    options: [
      "立刻站起来假装没事然后默默检查有没有骨折",
      "躺在雪地上不动等人来问你还好吗",
      "摔得太帅了，让朋友把刚才那段发给我",
    ],
    effects: [
      { dim: "s3", scores: [1, 2, 3] },
      { dim: "s1", scores: [2, 1, 3] },
    ],
  },
  {
    id: 15,
    text: "你在雪道上被一个小朋友超了，你？",
    options: [
      "无所谓，小孩子嘛",
      "加速追上去然后假装只是顺路",
      "当场宣布退役",
    ],
    effects: [
      { dim: "s1", scores: [1, 3, 2] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 16,
    text: "你对请教练的态度是？",
    options: [
      "必须请，科学进步",
      "看YouTube自学就够了",
      "教练能教我在缆车上自拍的角度吗",
    ],
    effects: [
      { dim: "s1", scores: [1, 2, 3] },
      { dim: "s4", scores: [1, 1, 3] },
    ],
  },
  {
    id: 17,
    text: "你的滑雪包里一定有？",
    options: [
      "备用手套和暖宝宝",
      "零食和充电宝",
      "自拍杆和补妆镜",
    ],
    effects: [
      { dim: "s4", scores: [1, 2, 3] },
      { dim: "s5", scores: [1, 3, 2] },
    ],
  },
  {
    id: 18,
    text: "下雪天你的反应是？",
    options: [
      "查雪场实时雪况，计划周末出发",
      "发朋友圈"又到滑雪季"配一张去年的照片",
      "翘班去滑雪，今天的雪明天就没了",
    ],
    effects: [
      { dim: "s1", scores: [2, 1, 3] },
      { dim: "s5", scores: [1, 3, 1] },
    ],
  },
  {
    id: 19,
    text: "你选雪场最看重？",
    options: [
      "雪道难度和雪质",
      "交通方便、设施好",
      "餐厅好不好吃、酒店舒不舒服",
    ],
    effects: [
      { dim: "s2", scores: [3, 2, 1] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 20,
    text: "你第一次上高级道是因为？",
    options: [
      "循序渐进练到了那个水平",
      "朋友拉我去的，我也不知道怎么下来的",
      "走错了",
    ],
    effects: [
      { dim: "s1", scores: [1, 3, 2] },
      { dim: "s2", scores: [3, 2, 1] },
    ],
  },
  {
    id: 21,
    text: "如果你可以给雪场加一个设施，你选？",
    options: [
      "更多高级道和野雪区域",
      "山顶温泉和观景台",
      "道内WiFi全覆盖和充电站",
    ],
    effects: [
      { dim: "s2", scores: [3, 2, 1] },
      { dim: "s5", scores: [1, 3, 2] },
    ],
  },
  {
    id: 22,
    text: "你在雪场排队等缆车，前面至少要等20分钟，你？",
    options: [
      "等，这条道值得",
      "换一条不排队的道",
      "算了去喝咖啡，等人少了再来",
    ],
    effects: [
      { dim: "s2", scores: [3, 2, 1] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 23,
    text: "你的滑雪技术主要是怎么学的？",
    options: [
      "请教练系统学习",
      "看视频自学加实战",
      "纯靠摔，摔会了算",
    ],
    effects: [
      { dim: "s1", scores: [1, 2, 3] },
    ],
  },
  {
    id: 24,
    text: "你跟一群朋友去滑雪，到了雪场你？",
    options: [
      "自己先冲了，回头见",
      "一起滑几趟，然后各玩各的",
      "全程不分开，一起滑一起拍照一起吃饭",
    ],
    effects: [
      { dim: "s3", scores: [1, 2, 3] },
    ],
  },
  {
    id: 25,
    text: "你觉得滑雪最爽的瞬间是？",
    options: [
      "完美刻滑一条长弯",
      "粉雪里飘起来的那一刻",
      "躺在雪地里看蓝天什么都不想",
    ],
    effects: [
      { dim: "s1", scores: [1, 3, 2] },
      { dim: "s2", scores: [1, 3, 1] },
    ],
  },
  {
    id: 26,
    text: "你发现今天雪况很冰，你？",
    options: [
      "调整技术，冰面也是训练",
      "减少难度，安全第一",
      "去餐厅坐着等它化",
    ],
    effects: [
      { dim: "s1", scores: [3, 1, 1] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 27,
    text: "你怎么形容自己的滑雪风格？",
    options: [
      "稳如老狗",
      "偶尔浪一下",
      "每次都像在拍极限运动纪录片",
    ],
    effects: [
      { dim: "s1", scores: [1, 2, 3] },
      { dim: "s2", scores: [1, 2, 3] },
    ],
  },
  {
    id: 28,
    text: "如果给你一天无限缆车不排队，你会？",
    options: [
      "从早刷到晚，一趟不浪费",
      "上午刷道，下午试试没去过的区域",
      "上午滑两趟，然后找个好位置拍延时摄影",
    ],
    effects: [
      { dim: "s5", scores: [1, 1, 3] },
      { dim: "s2", scores: [2, 3, 1] },
    ],
  },
  {
    id: 29,
    text: "你的护具情况是？",
    options: [
      "头盔护甲护膝全套",
      "就一个头盔",
      "护具是什么，能吃吗",
    ],
    effects: [
      { dim: "s1", scores: [1, 2, 3] },
      { dim: "s6", scores: [3, 2, 1] },
    ],
  },
  {
    id: 30,
    text: "赛季结束了，你的第一反应是？",
    options: [
      "开始体能训练备战下个雪季",
      "把滑雪视频剪个合集发出来",
      "终于可以把钱花在别的地方了",
    ],
    effects: [
      { dim: "s1", scores: [3, 2, 1] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
];
```

- [ ] **Step 3: Define personality types**

Create `data/personalities.ts`:

```ts
export interface Personality {
  slug: string;
  code: string;
  name: string;
  slogan: string;
  description: string;
  /** Ideal dimension profile: [s1, s2, s3, s4, s5, s6] each 0-100 */
  profile: [number, number, number, number, number, number];
  image: string;
}

export const personalities: Personality[] = [
  {
    slug: "sofa",
    code: "SOFA",
    name: "沙发客",
    slogan: "我来雪场是为了那碗火锅",
    description:
      "你的滑雪日常：滑两趟→休息室点杯热巧→刷一会儿手机→再滑一趟→午饭时间到了。朋友圈里你的滑雪照片背景永远是餐厅。别人问你今天滑了几趟，你掰着手指头数得出来。但你活得最明白——雪场的意义不在于刷了多少道，而在于那碗热气腾腾的火锅。你的快乐，别人不懂。",
    profile: [30, 20, 50, 60, 95, 40],
    image: "/images/personalities/sofa.png",
  },
  {
    slug: "yolo",
    code: "YOLO",
    name: "莽王",
    slogan: "这条道没死过人吧？那我试试",
    description:
      "你滑雪的方式和你做人一样——先冲再说。黑道？冲。树林？冲。没去过的野雪？更要冲。你的技术可能不是最好的，但你的勇气一定是最猛的。你的护具永远在家里吃灰，你的骨科医生已经记住了你的名字。摔倒了？拍拍雪站起来，这不算什么。在你的字典里，没有"绕路"这个词。",
    profile: [95, 90, 50, 30, 10, 40],
    image: "/images/personalities/yolo.png",
  },
  {
    slug: "gucci",
    code: "GUCCI",
    name: "雪场名媛",
    slogan: "雪服比雪技重要一万倍",
    description:
      "你出现在雪场的那一刻，所有人都会看过来——不是因为你的滑行，是因为你的穿搭。你的雪服配色是精心搭配的，雪镜要配今天的造型，连手套都是当季新款。滑雪对你来说只是拍照的背景板。你可能在初级道上优雅地划过，但那个姿态，那个气场，足以让所有高级道选手自惭形秽。",
    profile: [20, 15, 70, 95, 70, 80],
    image: "/images/personalities/gucci.png",
  },
  {
    slug: "gps",
    code: "GPS",
    name: "领航员",
    slogan: "跟我走，这条道我闭眼都能滑",
    description:
      "你是朋友圈里的人形雪场地图。哪条道几点钟太阳晒到、哪个弯有冰、哪个缆车最快，你门清。每次组队滑雪你都自动变成领队，新人跟着你永远不会迷路。你的技术稳健扎实，但你最享受的不是自己刷道，而是看到你带的新手从摔跤到能独立下中级道的那个瞬间。",
    profile: [30, 40, 95, 40, 30, 50],
    image: "/images/personalities/gps.png",
  },
  {
    slug: "404",
    code: "404",
    name: "失联者",
    slogan: "别找我，我在树林里",
    description:
      "你的手机永远没信号，因为你永远在别人找不到的地方。树林、野雪、未开放区域——越是没人去的地方你越兴奋。朋友约你滑雪，到了雪场你就消失了，下午四点在停车场才能重新找到你。你不需要社交，不需要拍照，只需要一片没被破坏过的粉雪和绝对的安静。",
    profile: [70, 95, 5, 20, 5, 50],
    image: "/images/personalities/404.png",
  },
  {
    slug: "bling",
    code: "BLING",
    name: "装备党",
    slogan: "板还没开封，但先发个开箱视频",
    description:
      "你的装备室比很多雪具店都豪华。最新款的板子、限量版的固定器、联名的雪镜——你全有。唯一的问题是，你的技术可能还配不上这些装备。但没关系，在雪具室里你就是最靓的仔。别人看你的板子都会倒吸一口凉气，直到他们看到你在初级道上的表现。",
    profile: [25, 20, 60, 80, 50, 95],
    image: "/images/personalities/bling.png",
  },
  {
    slug: "npc",
    code: "NPC",
    name: "背景板",
    slogan: "我就在初级道来回，你们玩你们的",
    description:
      "你是雪场里最佛系的存在。初级道来回刷了三年，技术没怎么进步，但快乐指数一直很高。不跟别人比，不给自己压力，也不在乎别人怎么看。你就是来享受在雪上滑行的那种简单快乐。有时候你甚至觉得，那些拼命刷高级道的人，不如你活得明白。",
    profile: [15, 10, 40, 30, 50, 20],
    image: "/images/personalities/npc.png",
  },
  {
    slug: "drama",
    code: "DRAMA",
    name: "戏精",
    slogan: "啊——我的膝盖——算了没事继续滑",
    description:
      "你摔跤的方式比你滑雪的方式更有观赏性。每次摔倒都像一出精心编排的话剧，表情到位、声音洪亮、肢体夸张。但三秒后你就站起来了，拍拍雪继续滑。你是雪场的开心果，缆车上的段子手，休息室里的社交中心。没有你，这个雪场会安静50%。",
    profile: [50, 40, 95, 60, 60, 40],
    image: "/images/personalities/drama.png",
  },
  {
    slug: "ice",
    code: "ICE",
    name: "冷面杀手",
    slogan: "少说话，多刷道",
    description:
      "你是雪场里的幽灵。开门第一个上缆车，关门最后一个下山。中间不吃饭、不社交、不拍照、不休息。你的目标只有一个：刷道。你的技术精湛到可以在任何雪况下保持完美的刻滑。别人觉得你冷漠，但你只是不想把时间浪费在滑雪以外的事情上。雪季结束时你的滑行公里数是别人的三倍。",
    profile: [80, 70, 5, 10, 5, 50],
    image: "/images/personalities/ice.png",
  },
  {
    slug: "wifi",
    code: "WIFI",
    name: "信号猎人",
    slogan: "这个位置有4G吗",
    description:
      "对你来说，滑雪是内容创作的一种形式。缆车上拍vlog，雪道上开直播，休息时修图发小红书。你对雪场每个角落的信号强度了如指掌。你的滑雪技术其实不差，但你的手机电量永远比体力先耗完。你的粉丝觉得你每天都在滑雪，其实你一半时间在拍素材。",
    profile: [40, 30, 80, 80, 60, 60],
    image: "/images/personalities/wifi.png",
  },
  {
    slug: "sensei",
    code: "SENSEI",
    name: "民间教练",
    slogan: "来，我教你，膝盖弯一点",
    description:
      "你可能没有教练证，但你教过的人比很多持证教练都多。看到新手摔跤你就忍不住上前指导，而且你教得还真不错。你的朋友圈子里一半人的滑雪技术都是你手把手教的。你最大的成就感不是自己滑了多难的道，而是你的学生第一次独立完成中级道时给你发的那条感谢消息。",
    profile: [40, 30, 90, 30, 40, 40],
    image: "/images/personalities/sensei.png",
  },
  {
    slug: "vip",
    code: "VIP",
    name: "雪场贵宾",
    slogan: "我的季卡比你的年薪贵",
    description:
      "你不排队，因为你有VIP通道。你不租装备，因为你有专属储物柜。你不在公共休息室吃饭，因为你有包厢。滑雪对你来说是一种生活方式，而不仅仅是一项运动。你的技术说不上顶尖，但你的体验永远是满分。别人在排队的时候，你已经多滑了五趟。",
    profile: [40, 40, 60, 90, 70, 90],
    image: "/images/personalities/vip.png",
  },
  {
    slug: "penguin",
    code: "PENGUIN",
    name: "企鹅",
    slogan: "我不是在摔，我是在跟地球拥抱",
    description:
      "你和地面的关系非常亲密——因为你大部分时间都趴在上面。但你从不放弃！每次摔倒你都会站起来，然后再摔倒。你的进步速度可能是全雪场最慢的，但你的乐观程度绝对是最高的。你用实际行动证明了一件事：滑雪的快乐跟技术水平完全无关。",
    profile: [10, 5, 60, 40, 50, 30],
    image: "/images/personalities/penguin.png",
  },
  {
    slug: "pro",
    code: "PRO",
    name: "大神",
    slogan: "这个雪场的道不够我滑的",
    description:
      "你是传说中的存在。在你眼里，国内的雪场都太简单了。你的朋友圈全是日本、欧洲、北美的雪场打卡。你的技术无可挑剔，你的装备是真正为性能选的而不是为了好看。每次你出现在雪道上，旁边的人都会停下来看你滑。你从不炫耀，但你的存在本身就是一种炫耀。",
    profile: [90, 85, 30, 40, 10, 70],
    image: "/images/personalities/pro.png",
  },
  {
    slug: "couple",
    code: "COUPLE",
    name: "雪场情侣",
    slogan: "我来滑雪是因为ta也来",
    description:
      "你的滑雪动力100%来自你的另一半。ta滑你就滑，ta不滑你绝对不会自己去。你们在雪道上手牵手（虽然这样很危险），在缆车上亲亲，在山顶拍合照。你的滑雪技术取决于你对象的耐心程度。如果有一天你们分手了，你的滑雪生涯可能也就结束了。",
    profile: [20, 15, 80, 70, 60, 40],
    image: "/images/personalities/couple.png",
  },
  {
    slug: "collector",
    code: "COLLECTOR",
    name: "打卡收集者",
    slogan: "这个雪场我来过了，下一个",
    description:
      "你的目标不是把一个雪场滑好，而是把所有雪场都滑一遍。你有一个清单，上面列着国内外所有知名雪场，划掉一个开心一天。你对每个雪场的评价精确到缆车速度和厕所清洁度。你不一定是最厉害的滑手，但你一定是去过最多雪场的那个人。",
    profile: [50, 60, 50, 50, 40, 60],
    image: "/images/personalities/collector.png",
  },
  {
    slug: "park",
    code: "PARK",
    name: "公园老鼠",
    slogan: "不跳一个就不算滑过雪",
    description:
      "对你来说，滑雪场只有一个区域是有意义的——地形公园。跳台、rails、box，这些才是真正的快乐。你可以在kicker前面排一下午的队也不觉得无聊。你的身上永远带着伤，但你的脸上永远带着笑。你的朋友都觉得你疯了，但在公园里，你才是最清醒的那个。",
    profile: [85, 80, 60, 50, 15, 60],
    image: "/images/personalities/park.png",
  },
  {
    slug: "photo",
    code: "PHOTO",
    name: "摄影师",
    slogan: "等一下别动，光线刚好",
    description:
      "你来雪场带的最重要的装备不是雪板，是相机。你能在零下二十度的山顶趴在雪地上等一个完美的光线角度。你的朋友们又爱又恨你——爱你是因为你拍的照片确实好看，恨你是因为每次都要停下来给你当模特。你自己滑雪的时间可能不多，但你记录下了所有人最好的瞬间。",
    profile: [30, 30, 60, 70, 60, 70],
    image: "/images/personalities/photo.png",
  },
  {
    slug: "drunk",
    code: "DRUNK",
    name: "雪场醉侠",
    slogan: "滑前来一杯，滑后来一箱",
    description:
      "你坚信：微醺状态下滑雪才是最佳体验。午餐的热红酒是必须的，下午茶的啤酒是标配的，收板后的居酒屋是神圣的。你的转弯越来越飘逸，不是因为技术进步了，是因为酒劲上来了。大家都说你这样很危险，但你觉得这才是生活。",
    profile: [50, 40, 80, 50, 85, 40],
    image: "/images/personalities/drunk.png",
  },
  {
    slug: "early",
    code: "EARLY",
    name: "首班缆车侠",
    slogan: "七点的雪道是我一个人的",
    description:
      "你的闹钟永远比同行的朋友早两个小时。当别人还在酒店赖床的时候，你已经在空无一人的雪道上完成了第一趟。你热爱清晨刚压完的绒雪面条，那种只属于你一个人的安静和完美。缺点是你下午两点就困了，经常在休息室睡着。",
    profile: [60, 60, 20, 20, 10, 40],
    image: "/images/personalities/early.png",
  },
  {
    slug: "rental",
    code: "RENTAL",
    name: "万年租客",
    slogan: "买板子？滑几次值回票价啊",
    description:
      "你滑了五年雪，用的还是租的装备。不是因为你不爱滑雪，是因为你算过一笔账：一块板子的钱够你租50次了。你用着雪场最破的板子，滑出了不输自带装备选手的水平。装备党看到你都会陷入沉思：我花那么多钱到底图什么？",
    profile: [50, 40, 40, 10, 40, 5],
    image: "/images/personalities/rental.png",
  },
  {
    slug: "safety",
    code: "SAFETY",
    name: "安全委员",
    slogan: "你们慢一点！前面有人！",
    description:
      "你是雪道上的移动交通警察。看到有人滑太快你会皱眉，看到有人不戴头盔你会上前提醒，看到有人在雪道中间停下来你会认真科普安全知识。你自己的装备永远是全套护具，你的滑行速度永远在安全范围内。你可能不是最受欢迎的人，但你一定是最负责任的。",
    profile: [10, 10, 70, 30, 30, 60],
    image: "/images/personalities/safety.png",
  },
  {
    slug: "groupie",
    code: "GROUPIE",
    name: "团建之王",
    slogan: "一个人滑雪有什么意思",
    description:
      "你从不独自滑雪。每次出行都是十几个人的大团，微信群从出发前一周就开始热闹。你负责订酒店、租车、分配房间、制定行程。到了雪场你一半时间在协调大家去哪条道，另一半时间在拍集体照。你的滑雪水平一般，但你的组织能力是专业级的。",
    profile: [30, 25, 95, 50, 60, 40],
    image: "/images/personalities/groupie.png",
  },
  {
    slug: "zen",
    code: "ZEN",
    name: "禅者",
    slogan: "雪山即道场",
    description:
      "你滑雪的时候不听音乐、不说话、不拍照。你只是静静地感受脚下的雪、脸上的风、和远处的山。对你来说，滑雪是一种冥想，是城市生活的解毒剂。你不在乎今天刷了几趟道，只在乎那几个完全沉浸在当下的瞬间。你的朋友觉得你很奇怪，但你觉得他们才奇怪。",
    profile: [50, 50, 10, 15, 30, 30],
    image: "/images/personalities/zen.png",
  },
  {
    slug: "flex",
    code: "FLEX",
    name: "凡尔赛",
    slogan: "哎呀这个雪场一般般啦",
    description:
      "你去过的雪场永远比在座各位都高级。你不经意间提到"上次在二世谷"、"阿尔卑斯那边的雪比这好多了"、"惠斯勒的道才叫道"。你的滑雪技术确实不错，但你最擅长的技术是凡尔赛。不过平心而论，你推荐的雪场确实都挺好的。",
    profile: [65, 70, 70, 70, 40, 70],
    image: "/images/personalities/flex.png",
  },
];
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add data/
git commit -m "feat: add dimensions, questions, and personality data"
```

---

## Task 3: Scoring and Encoding Logic

**Files:**
- Create: `lib/scoring.ts`, `lib/encoding.ts`
- Test: `lib/__tests__/scoring.test.ts`, `lib/__tests__/encoding.test.ts`

- [ ] **Step 1: Install test runner**

```bash
npm install -D jest @types/jest ts-jest
```

Create `jest.config.js`:

```js
/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
```

- [ ] **Step 2: Write encoding tests**

Create `lib/__tests__/encoding.test.ts`:

```ts
import { encodeScores, decodeScores } from "../encoding";

describe("encodeScores", () => {
  it("encodes 6 dimension scores (0-100) into a 12-char string", () => {
    const scores: [number, number, number, number, number, number] = [50, 75, 25, 100, 0, 60];
    const encoded = encodeScores(scores);
    expect(encoded).toHaveLength(12);
    expect(typeof encoded).toBe("string");
  });

  it("round-trips correctly", () => {
    const scores: [number, number, number, number, number, number] = [50, 75, 25, 100, 0, 60];
    const encoded = encodeScores(scores);
    const decoded = decodeScores(encoded);
    expect(decoded).toEqual(scores);
  });

  it("handles all zeros", () => {
    const scores: [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];
    const decoded = decodeScores(encodeScores(scores));
    expect(decoded).toEqual(scores);
  });

  it("handles all 100s", () => {
    const scores: [number, number, number, number, number, number] = [100, 100, 100, 100, 100, 100];
    const decoded = decodeScores(encodeScores(scores));
    expect(decoded).toEqual(scores);
  });
});

describe("decodeScores", () => {
  it("returns null for invalid input", () => {
    expect(decodeScores("")).toBeNull();
    expect(decodeScores("abc")).toBeNull();
    expect(decodeScores("toolongstring123")).toBeNull();
  });
});
```

- [ ] **Step 3: Run encoding tests to verify they fail**

```bash
npx jest lib/__tests__/encoding.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 4: Implement encoding**

Create `lib/encoding.ts`:

```ts
type Scores = [number, number, number, number, number, number];

/**
 * Encode 6 dimension scores (0-100) into a 12-char base36 string.
 * Each score is clamped to 0-100 and encoded as 2 base36 digits.
 */
export function encodeScores(scores: Scores): string {
  return scores
    .map((s) => {
      const clamped = Math.round(Math.min(100, Math.max(0, s)));
      return clamped.toString(36).padStart(2, "0");
    })
    .join("");
}

/**
 * Decode a 12-char base36 string back into 6 dimension scores.
 * Returns null if the input is invalid.
 */
export function decodeScores(encoded: string): Scores | null {
  if (!encoded || encoded.length !== 12) return null;
  try {
    const scores = Array.from({ length: 6 }, (_, i) => {
      const chunk = encoded.slice(i * 2, i * 2 + 2);
      const val = parseInt(chunk, 36);
      if (isNaN(val) || val < 0 || val > 100) throw new Error("invalid");
      return val;
    }) as Scores;
    return scores;
  } catch {
    return null;
  }
}
```

- [ ] **Step 5: Run encoding tests to verify they pass**

```bash
npx jest lib/__tests__/encoding.test.ts
```

Expected: All PASS.

- [ ] **Step 6: Write scoring tests**

Create `lib/__tests__/scoring.test.ts`:

```ts
import { computeScores, matchPersonality } from "../scoring";
import { questions } from "../../data/questions";
import { personalities } from "../../data/personalities";

describe("computeScores", () => {
  it("returns 6 scores between 0 and 100", () => {
    // Answer all B (index 1)
    const answers = new Array(questions.length).fill(1);
    const scores = computeScores(answers);
    expect(scores).toHaveLength(6);
    scores.forEach((s) => {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    });
  });

  it("all-A and all-C produce different scores", () => {
    const allA = new Array(questions.length).fill(0);
    const allC = new Array(questions.length).fill(2);
    const scoresA = computeScores(allA);
    const scoresC = computeScores(allC);
    expect(scoresA).not.toEqual(scoresC);
  });
});

describe("matchPersonality", () => {
  it("returns a valid personality slug", () => {
    const answers = new Array(questions.length).fill(1);
    const scores = computeScores(answers);
    const personality = matchPersonality(scores);
    expect(personalities.some((p) => p.slug === personality.slug)).toBe(true);
  });
});
```

- [ ] **Step 7: Run scoring tests to verify they fail**

```bash
npx jest lib/__tests__/scoring.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 8: Implement scoring**

Create `lib/scoring.ts`:

```ts
import { questions } from "@/data/questions";
import { personalities, Personality } from "@/data/personalities";
import { dimensions } from "@/data/dimensions";

type Scores = [number, number, number, number, number, number];

/**
 * Compute normalized dimension scores (0-100) from an array of answer indices (0=A, 1=B, 2=C).
 */
export function computeScores(answers: number[]): Scores {
  const dimIds = dimensions.map((d) => d.id);
  const rawScores = new Array(6).fill(0);
  const maxPossible = new Array(6).fill(0);

  questions.forEach((q, qi) => {
    const answer = answers[qi] ?? 1; // default to B if unanswered
    q.effects.forEach((effect) => {
      const dimIndex = dimIds.indexOf(effect.dim);
      if (dimIndex === -1) return;
      rawScores[dimIndex] += effect.scores[answer];
      maxPossible[dimIndex] += Math.max(...effect.scores);
    });
  });

  return dimIds.map((_, i) => {
    if (maxPossible[i] === 0) return 50;
    const minPossible = questions.reduce((sum, q) => {
      const effect = q.effects.find((e) => e.dim === dimIds[i]);
      return sum + (effect ? Math.min(...effect.scores) : 0);
    }, 0);
    const normalized =
      ((rawScores[i] - minPossible) / (maxPossible[i] - minPossible)) * 100;
    return Math.round(Math.min(100, Math.max(0, normalized)));
  }) as Scores;
}

/**
 * Find the personality whose ideal profile is closest to the given scores.
 * Uses Euclidean distance.
 */
export function matchPersonality(scores: Scores): Personality {
  let bestMatch = personalities[0];
  let bestDistance = Infinity;

  for (const p of personalities) {
    const distance = Math.sqrt(
      p.profile.reduce(
        (sum, val, i) => sum + Math.pow(val - scores[i], 2),
        0
      )
    );
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = p;
    }
  }

  return bestMatch;
}
```

- [ ] **Step 9: Run scoring tests to verify they pass**

```bash
npx jest lib/__tests__/scoring.test.ts
```

Expected: All PASS.

- [ ] **Step 10: Commit**

```bash
git add lib/ jest.config.js
git commit -m "feat: add scoring logic and URL encoding with tests"
```

---

## Task 4: Shared Components — Navbar, Footer, PersonalityCard

**Files:**
- Create: `components/Navbar.tsx`, `components/Footer.tsx`, `components/PersonalityCard.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create Navbar**

Create `components/Navbar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/types", label: "人格类型" },
  { href: "/about", label: "关于测试" },
  { href: "/test", label: "开始测试" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-wide">
          SKTI
        </Link>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-[var(--color-primary)] font-medium"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              } ${
                link.href === "/test"
                  ? "bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-full text-sm hover:opacity-90"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Create Footer**

Create `components/Footer.tsx`:

```tsx
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "首页" },
  { href: "/test", label: "开始测试" },
  { href: "/types", label: "人格类型" },
  { href: "/about", label: "关于测试" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">
          SKTI — Ski Type Indicator
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create PersonalityCard**

Create `components/PersonalityCard.tsx`:

```tsx
import Link from "next/link";
import { Personality } from "@/data/personalities";

interface Props {
  personality: Personality;
  /** Link to /result/slug (with scores) or /type/slug (generic) */
  href?: string;
}

export default function PersonalityCard({ personality, href }: Props) {
  const target = href ?? `/type/${personality.slug}`;

  return (
    <Link
      href={target}
      className="block bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow"
    >
      <div className="text-xs text-[var(--color-text-secondary)] mb-1">
        你的人格类型是：
      </div>
      <div className="text-xs font-mono text-[var(--color-text-secondary)] mb-2">
        {personality.code}
      </div>
      <h3 className="text-xl font-bold mb-1">{personality.name}</h3>
      <p className="text-sm text-[var(--color-text-secondary)]">
        {personality.slogan}
      </p>
    </Link>
  );
}
```

- [ ] **Step 4: Wire Navbar and Footer into layout**

Edit `app/layout.tsx` — replace the full file:

```tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKTI 滑雪人格测试",
  description: "测测你是哪种滑雪人格 - Ski Type Indicator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add components/ app/layout.tsx
git commit -m "feat: add Navbar, Footer, and PersonalityCard components"
```

---

## Task 5: Home Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement home page**

Replace `app/page.tsx`:

```tsx
import Link from "next/link";
import { personalities } from "@/data/personalities";
import PersonalityCard from "@/components/PersonalityCard";

const previewPersonalities = personalities.slice(0, 3);

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <p className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-4">
          Ski Type Indicator
        </p>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
          SKTI 滑雪人格测试，
          <br />
          测测你是哪种滑雪人。
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-xl mb-8">
          SKTI 是一套面向滑雪爱好者的人格测试。回答 30 道题，从技术风格到摸鱼指数，
          6 个维度帮你找到最匹配的滑雪人格。纯属娱乐，切勿当真。
        </p>
        <div className="flex gap-3">
          <Link
            href="/test"
            className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            开始测试
          </Link>
          <Link
            href="/types"
            className="border border-[var(--color-border)] px-6 py-2.5 rounded-full text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] transition-colors"
          >
            浏览 {personalities.length} 种人格
          </Link>
          <Link
            href="/about"
            className="border border-[var(--color-border)] px-6 py-2.5 rounded-full text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] transition-colors"
          >
            了解测试说明
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">
          SKTI 采用 6 组人格切面。
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5">
            <p className="text-2xl font-bold">30 道</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              正式题目数量
            </p>
          </div>
          <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5">
            <p className="text-2xl font-bold">{personalities.length} 种</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              人格类型
            </p>
          </div>
          <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5">
            <p className="text-2xl font-bold">6 维</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              从技术到摸鱼，全方位扫描
            </p>
          </div>
        </div>
      </section>

      {/* Preview personalities */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">部分人格预览</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {previewPersonalities.map((p) => (
            <PersonalityCard key={p.slug} personality={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify build and check dev server**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: implement home page with hero, stats, and personality preview"
```

---

## Task 6: Test Page (Quiz)

**Files:**
- Create: `components/QuestionCard.tsx`, `components/ProgressBar.tsx`, `app/test/page.tsx`

- [ ] **Step 1: Create ProgressBar component**

Create `components/ProgressBar.tsx`:

```tsx
interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-2">
        <span>
          已完成 {current} / {total} 题
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 bg-[var(--color-primary-light)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create QuestionCard component**

Create `components/QuestionCard.tsx`:

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/data/questions";

interface Props {
  question: Question;
  questionIndex: number;
  selectedAnswer: number | null;
  onSelect: (answerIndex: number) => void;
}

const labels = ["A", "B", "C"];

export default function QuestionCard({
  question,
  questionIndex,
  selectedAnswer,
  onSelect,
}: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.25 }}
      >
        <h2 className="text-lg md:text-xl font-bold mb-6 leading-relaxed">
          {question.text}
        </h2>
        <div className="flex flex-col gap-3">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`text-left px-5 py-4 rounded-xl border transition-all text-sm leading-relaxed ${
                selectedAnswer === i
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                  : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]"
              }`}
            >
              <span className="font-medium mr-2">{labels[i]}</span>
              {opt}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Create test page**

Create `app/test/page.tsx`:

```tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import { computeScores, matchPersonality } from "@/lib/scoring";
import { encodeScores } from "@/lib/encoding";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";

function shuffleArray<T>(arr: T[], seed?: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function TestPage() {
  const router = useRouter();
  const [shuffledQuestions, setShuffledQuestions] = useState(() =>
    shuffleArray(questions)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => new Array(questions.length).fill(null)
  );

  const currentQuestion = shuffledQuestions[currentIndex];

  const handleSelect = useCallback(
    (answerIndex: number) => {
      const newAnswers = [...answers];
      // Map back to original question index for scoring
      const originalIndex = questions.indexOf(currentQuestion);
      newAnswers[originalIndex] = answerIndex;
      setAnswers(newAnswers);

      // Auto-advance after short delay
      setTimeout(() => {
        if (currentIndex < shuffledQuestions.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          // All questions answered — compute result
          const finalAnswers = newAnswers.map((a) => a ?? 1);
          const scores = computeScores(finalAnswers);
          const personality = matchPersonality(scores);
          const encoded = encodeScores(scores);
          router.push(`/result/${personality.slug}?s=${encoded}`);
        }
      }, 300);
    },
    [answers, currentIndex, currentQuestion, shuffledQuestions, router]
  );

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleReshuffle = () => {
    setShuffledQuestions(shuffleArray(questions));
    setCurrentIndex(0);
    setAnswers(new Array(questions.length).fill(null));
  };

  // Find the answer for the current shuffled question
  const originalIndex = questions.indexOf(currentQuestion);
  const currentAnswer = answers[originalIndex];

  return (
    <main className="flex-1 max-w-2xl mx-auto px-4 py-8 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        一题一题答，最后直接落到你的人格页。
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">
        这套测试共 {questions.length} 题，题目与结果直接映射。完成后会跳转到你的人格详情页。
      </p>

      <ProgressBar current={currentIndex} total={shuffledQuestions.length} />

      <div className="mt-8">
        <QuestionCard
          question={currentQuestion}
          questionIndex={currentIndex}
          selectedAnswer={currentAnswer}
          onSelect={handleSelect}
        />
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="text-sm px-4 py-2 rounded-lg border border-[var(--color-border)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-primary-light)] transition-colors"
        >
          上一题
        </button>
        <button
          onClick={handleReshuffle}
          className="text-sm px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] transition-colors"
        >
          重新随机题序
        </button>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add components/QuestionCard.tsx components/ProgressBar.tsx app/test/
git commit -m "feat: implement quiz page with question cards, progress bar, and scoring"
```

---

## Task 7: Result Page

**Files:**
- Create: `components/DimensionChart.tsx`, `components/ShareButtons.tsx`, `app/result/[type]/page.tsx`

- [ ] **Step 1: Create DimensionChart component**

Create `components/DimensionChart.tsx`:

```tsx
import { Dimension } from "@/data/dimensions";

interface Props {
  dimension: Dimension;
  score: number; // 0-100
}

export default function DimensionChart({ dimension, score }: Props) {
  return (
    <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-4">
      <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1">
        <span>{dimension.id.toUpperCase()} {dimension.name}</span>
        <span className="text-[10px] uppercase">
          {dimension.type === "serious"
            ? "核心维度"
            : dimension.type === "funny"
            ? "搞笑维度"
            : "混搭维度"}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="w-24 text-right shrink-0 text-[var(--color-text-secondary)]">
          {dimension.lowLabel}
        </span>
        <div className="flex-1 h-3 bg-[var(--color-primary-light)] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="w-24 shrink-0 text-[var(--color-text-secondary)]">
          {dimension.highLabel}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ShareButtons component**

Create `components/ShareButtons.tsx`:

```tsx
"use client";

import { useState } from "react";

interface Props {
  personalityName: string;
}

export default function ShareButtons({ personalityName }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const cardEl = document.getElementById("share-card");
    if (!cardEl) return;
    const canvas = await html2canvas(cardEl, { scale: 2 });
    const link = document.createElement("a");
    link.download = `skti-${personalityName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleCopyLink}
        className="text-sm px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] transition-colors"
      >
        {copied ? "已复制" : "复制链接"}
      </button>
      <button
        onClick={handleDownloadCard}
        className="text-sm px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] transition-colors"
      >
        下载分享卡
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create result page**

Create `app/result/[type]/page.tsx`:

```tsx
"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { personalities } from "@/data/personalities";
import { dimensions } from "@/data/dimensions";
import { decodeScores } from "@/lib/encoding";
import { matchPersonality } from "@/lib/scoring";
import DimensionChart from "@/components/DimensionChart";
import ShareButtons from "@/components/ShareButtons";
import PersonalityCard from "@/components/PersonalityCard";

export default function ResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const typeSlug = params.type as string;
  const scoresParam = searchParams.get("s");
  const scores = scoresParam ? decodeScores(scoresParam) : null;

  // Find personality by slug
  const personality = personalities.find((p) => p.slug === typeSlug);
  if (!personality) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p>找不到这个人格类型。</p>
      </main>
    );
  }

  // Suggest 3 other personalities
  const suggestions = personalities
    .filter((p) => p.slug !== typeSlug)
    .slice(0, 3);

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 py-8 md:py-16">
      {/* Share Card target */}
      <div
        id="share-card"
        className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 mb-6"
      >
        <p className="text-sm text-[var(--color-text-secondary)] mb-1">
          你的滑雪人格是：
        </p>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-bold mb-1">{personality.name}</h1>
            <p className="text-lg font-mono text-[var(--color-text-secondary)]">
              {personality.code}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--color-primary)] mb-2">
              {personality.slogan}
            </p>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {personality.description}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mb-10">
        <ShareButtons personalityName={personality.slug} />
        <Link
          href="/test"
          className="text-sm px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] transition-colors"
        >
          重新测试
        </Link>
      </div>

      {/* Dimension charts — only if scores available */}
      {scores && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {personality.code} 的维度落点
          </h2>
          <div className="grid gap-3">
            {dimensions.map((dim, i) => (
              <DimensionChart key={dim.id} dimension={dim} score={scores[i]} />
            ))}
          </div>
        </section>
      )}

      {/* Suggestions */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          看看其他几种滑雪人格
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((p) => (
            <PersonalityCard key={p.slug} personality={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add components/DimensionChart.tsx components/ShareButtons.tsx app/result/
git commit -m "feat: implement result page with dimension charts, sharing, and suggestions"
```

---

## Task 8: Types Page and Type Detail Page

**Files:**
- Create: `app/types/page.tsx`, `app/type/[slug]/page.tsx`

- [ ] **Step 1: Create types overview page**

Create `app/types/page.tsx`:

```tsx
import { personalities } from "@/data/personalities";
import PersonalityCard from "@/components/PersonalityCard";

export default function TypesPage() {
  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-8 md:py-16">
      <p className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-2">
        All Personality Types
      </p>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        {personalities.length} 种 SKTI 人格类型总览
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        这里收录了全部 SKTI 结果类型。可以先快速浏览每一种人格，也可以直接进入测试页面。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {personalities.map((p) => (
          <PersonalityCard key={p.slug} personality={p} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create type detail page**

Create `app/type/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { personalities } from "@/data/personalities";
import { dimensions } from "@/data/dimensions";
import DimensionChart from "@/components/DimensionChart";
import PersonalityCard from "@/components/PersonalityCard";

export function generateStaticParams() {
  return personalities.map((p) => ({ slug: p.slug }));
}

export default function TypeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const personality = personalities.find((p) => p.slug === params.slug);
  if (!personality) notFound();

  const suggestions = personalities
    .filter((p) => p.slug !== personality.slug)
    .slice(0, 3);

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 py-8 md:py-16">
      <div className="mb-2 text-sm text-[var(--color-text-secondary)]">
        <Link href="/types" className="hover:underline">
          人格类型
        </Link>
        {" / "}
        {personality.code}（{personality.name}）
      </div>

      <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 mb-8">
        <p className="text-xs font-mono text-[var(--color-text-secondary)] mb-1">
          {personality.code}
        </p>
        <h1 className="text-3xl font-bold mb-2">{personality.name}</h1>
        <p className="text-[var(--color-primary)] font-medium mb-4">
          {personality.slogan}
        </p>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {personality.description}
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">
          {personality.code} 的典型维度落点
        </h2>
        <div className="grid gap-3">
          {dimensions.map((dim, i) => (
            <DimensionChart
              key={dim.id}
              dimension={dim}
              score={personality.profile[i]}
            />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">看看其他人格</h2>
          <Link
            href="/test"
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            去做测试
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((p) => (
            <PersonalityCard key={p.slug} personality={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds, static pages generated for all personality slugs.

- [ ] **Step 4: Commit**

```bash
git add app/types/ app/type/
git commit -m "feat: add personality types overview and detail pages"
```

---

## Task 9: About Page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Implement about page**

Create `app/about/page.tsx`:

```tsx
import Link from "next/link";
import { dimensions } from "@/data/dimensions";
import { questions } from "@/data/questions";
import { personalities } from "@/data/personalities";

export default function AboutPage() {
  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 py-8 md:py-16">
      <p className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-2">
        About SKTI
      </p>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">关于 SKTI 测试</h1>
      <p className="text-[var(--color-text-secondary)] mb-10">
        SKTI 是一套轻松有趣的滑雪人格测试。它不会把人塞进严肃的心理学框架，
        而是更关注你在雪场的行为习惯、社交风格和摸鱼指数，让结果既好笑又真实。
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5">
          <p className="text-2xl font-bold">{questions.length} 道</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            正式题目数量
          </p>
        </div>
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5">
          <p className="text-2xl font-bold">{personalities.length} 种</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            人格类型
          </p>
        </div>
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5">
          <p className="text-2xl font-bold">{dimensions.length} 维</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            人格切面
          </p>
        </div>
      </div>

      {/* Dimensions */}
      <h2 className="text-2xl font-bold mb-4">SKTI 从 6 组切面看滑雪人格</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {dimensions.map((dim) => (
          <div
            key={dim.id}
            className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5"
          >
            <p className="text-xs font-mono text-[var(--color-text-secondary)] mb-1">
              {dim.id.toUpperCase()} ·{" "}
              {dim.type === "serious"
                ? "核心维度"
                : dim.type === "funny"
                ? "搞笑维度"
                : "混搭维度"}
            </p>
            <h3 className="font-bold mb-1">{dim.name}</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {dim.lowLabel} ↔ {dim.highLabel}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <h2 className="text-2xl font-bold mb-4">最简单的方式是直接开始测试</h2>
      <Link
        href="/test"
        className="inline-block bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
      >
        进入测试
      </Link>
    </main>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/about/
git commit -m "feat: add about page with dimension explanations"
```

---

## Task 10: Placeholder Images and Final Polish

**Files:**
- Create: `public/images/personalities/.gitkeep`
- Modify: `components/PersonalityCard.tsx` (add placeholder avatar), `app/result/[type]/page.tsx` (add placeholder avatar)

- [ ] **Step 1: Create placeholder image directory**

```bash
mkdir -p /Users/peter/dev/ski-mbti/public/images/personalities
touch /Users/peter/dev/ski-mbti/public/images/personalities/.gitkeep
```

- [ ] **Step 2: Add emoji placeholder to PersonalityCard**

Edit `components/PersonalityCard.tsx` — replace the full file:

```tsx
import Link from "next/link";
import { Personality } from "@/data/personalities";

interface Props {
  personality: Personality;
  href?: string;
}

const emojiMap: Record<string, string> = {
  sofa: "🛋️", yolo: "🔥", gucci: "👗", gps: "🧭", "404": "🌲",
  bling: "💎", npc: "🎮", drama: "🎭", ice: "🧊", wifi: "📶",
  sensei: "🎓", vip: "👑", penguin: "🐧", pro: "⭐", couple: "💕",
  collector: "📍", park: "🏂", photo: "📸", drunk: "🍷", early: "🌅",
  rental: "🏷️", safety: "⛑️", groupie: "👥", zen: "🧘", flex: "✈️",
};

export default function PersonalityCard({ personality, href }: Props) {
  const target = href ?? `/type/${personality.slug}`;
  const emoji = emojiMap[personality.slug] ?? "⛷️";

  return (
    <Link
      href={target}
      className="block bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow"
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="text-xs font-mono text-[var(--color-text-secondary)] mb-1">
        {personality.code}
      </div>
      <h3 className="text-xl font-bold mb-1">{personality.name}</h3>
      <p className="text-sm text-[var(--color-text-secondary)]">
        {personality.slogan}
      </p>
    </Link>
  );
}
```

- [ ] **Step 3: Add emoji to result page share card**

Edit `app/result/[type]/page.tsx` — in the share card section, add the emoji before the name. Find this block:

```tsx
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-bold mb-1">{personality.name}</h1>
```

Replace with:

```tsx
          <div className="flex flex-col items-center md:items-start">
            <div className="text-5xl mb-2">
              {(() => {
                const emojiMap: Record<string, string> = {
                  sofa: "🛋️", yolo: "🔥", gucci: "👗", gps: "🧭", "404": "🌲",
                  bling: "💎", npc: "🎮", drama: "🎭", ice: "🧊", wifi: "📶",
                  sensei: "🎓", vip: "👑", penguin: "🐧", pro: "⭐", couple: "💕",
                  collector: "📍", park: "🏂", photo: "📸", drunk: "🍷", early: "🌅",
                  rental: "🏷️", safety: "⛑️", groupie: "👥", zen: "🧘", flex: "✈️",
                };
                return emojiMap[personality.slug] ?? "⛷️";
              })()}
            </div>
            <h1 className="text-3xl font-bold mb-1">{personality.name}</h1>
```

- [ ] **Step 4: Verify full build**

```bash
npm run build
```

Expected: Build succeeds with all static pages generated.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add placeholder emoji avatars and image directory"
```

---

## Task 11: End-to-End Verification

- [ ] **Step 1: Run all tests**

```bash
npx jest --verbose
```

Expected: All tests pass.

- [ ] **Step 2: Start dev server and manually verify**

```bash
npm run dev
```

Check in browser:
- `/` — home page renders with hero, stats, personality preview
- `/test` — quiz starts, questions appear one by one, progress bar works, previous button works, reshuffle works
- Complete all 30 questions — verify redirect to `/result/[type]?s=...`
- Result page shows personality name, description, dimension charts, share buttons, suggestions
- `/types` — all 25 personalities displayed in grid
- `/type/sofa` — single personality detail with typical dimension profile
- `/about` — about page with dimension explanations

- [ ] **Step 3: Verify static export**

```bash
npm run build && ls out/
```

Expected: `out/` directory contains `index.html`, `test.html`, `types.html`, `about.html`, and `type/` and `result/` directories.

- [ ] **Step 4: Final commit and push**

```bash
git add -A
git commit -m "chore: verify build and finalize MVP"
git push origin main
```
