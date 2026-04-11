export interface Question {
  id: number;
  text: string;
  options: [string, string, string];
  /** Per-option personality point awards (slug -> points). */
  effects: {
    A: Record<string, number>;
    B: Record<string, number>;
    C: Record<string, number>;
  };
  /** "diagnostic" probes core behavior; "absurd" is fun/wacky scenario */
  kind: "diagnostic" | "absurd";
}

// Design rules for effects:
//  - Each option awards points to at most ~5 personalities.
//  - 5 = signature (only this personality, or at most 1-2 others)
//  - 3 = strong fit
//  - 2 = moderate fit
//  - No 1-point padding. Don't give weak fits points; let them be 0.
//  - Each personality should win on ~5-8 questions (sum of max points).

export const questions: Question[] = [
  {
    id: 1,
    text: "你滑雪日的早晨大概是？",
    options: ["5 点起床赶第一班缆车", "10 点优雅到达，先吃个早餐", "下午两三点才出现"],
    kind: "diagnostic",
    effects: {
      A: { "404": 3, early: 5, kpi: 2, powder: 3 },
      B: { bling: 3, couple: 2, ootd: 1, stamp: 2 },
      C: { drunk: 1, sit: 2, sofa: 4, taxi: 2 },
    },
  },
  {
    id: 2,
    text: "今天结束你滑了几趟？",
    options: ["数不过来，反正没停过", "心里有数，10-15 趟左右", "三五趟够本了"],
    kind: "diagnostic",
    effects: {
      A: { early: 5, ice: 2, kpi: 2, pro: 2, speed: 3 },
      B: { couple: 1, park: 4, powder: 4, stamp: 2, tree: 4 },
      C: { ootd: 1, pizza: 5, sit: 2, sofa: 3, taxi: 2, tbd: 4 },
    },
  },
  {
    id: 3,
    text: "中午你的午饭计划？",
    options: ["雪场快餐 10 分钟搞定", "山下找了一家正经火锅店，吃两小时", "随便对付，主要是要喝两杯"],
    kind: "diagnostic",
    effects: {
      A: { "404": 3, ice: 1, kpi: 1, powder: 3, speed: 4 },
      B: { couple: 2, ootd: 1, sit: 1, sofa: 4 },
      C: { drunk: 3, xjbh: 2, yolo: 4 },
    },
  },
  {
    id: 4,
    text: "你刚结结实实摔了一个，第一反应？",
    options: ["立刻爬起来分析动作哪儿不对", "在雪地上躺一会儿喘口气", "掏手机看刚才那段拍下来没"],
    kind: "diagnostic",
    effects: {
      A: { kpi: 3, pizza: 3, pro: 2, safety: 4 },
      B: { mri: 4, pua: 4, sit: 4, sofa: 2 },
      C: { drama: 1, ootd: 1, rip: 5, wifi: 5 },
    },
  },
  {
    id: 5,
    text: "你的雪服是什么调调？",
    options: ["黑灰为主，越低调越好", "中性色但注意搭配", "全套色彩拼接，恨不得发光"],
    kind: "diagnostic",
    effects: {
      A: { "404": 2, ice: 2, pro: 1, sit: 1, tree: 2 },
      B: { couple: 1, npc: 4, rental: 4, safety: 4, stamp: 1 },
      C: { bling: 5, drama: 1, ootd: 3, park: 3, wifi: 4 },
    },
  },
  {
    id: 6,
    text: "你滑雪用的板子是？",
    options: ["顶级品牌限量款，价格不忍直视", "自有，普通款，用了几年了", "永远是租的"],
    kind: "diagnostic",
    effects: {
      A: { bling: 5, powder: 3, pro: 2, speed: 3, yyds: 4 },
      B: { "404": 2, early: 5, ice: 1, kpi: 1, tree: 3 },
      C: { pizza: 4, rental: 5, taxi: 2, tbd: 2, xjbh: 2 },
    },
  },
  {
    id: 7,
    text: "你今天穿了多少护具？",
    options: ["头盔护甲护膝护腕全套", "就一个头盔意思一下", "护具？能吃吗？"],
    kind: "diagnostic",
    effects: {
      A: { park: 4, pizza: 1, safety: 4, tbd: 2 },
      B: { "404": 1, early: 5, ice: 1, powder: 2, tree: 2 },
      C: { cliff: 4, mri: 5, speed: 1, xjbh: 3, yolo: 5 },
    },
  },
  {
    id: 8,
    text: '朋友说"X 总，下黑道你肯定没问题"，你？',
    options: ["我可不上当，知之为知之", "犹豫一下被推上去了", "他说得对，我去，反正没死过人"],
    kind: "absurd",
    effects: {
      A: { pizza: 3, rental: 3, safety: 3, sit: 2, tbd: 5 },
      B: { drama: 1, mri: 3, pua: 5, taxi: 2 },
      C: { cliff: 3, speed: 2, xjbh: 4, yolo: 5 },
    },
  },
  {
    id: 9,
    text: "缆车上你大概率在干什么？",
    options: ["复盘刚才那条线，想动作要领", "刷手机或者跟旁边人聊天", "看四周风景，啥都不想"],
    kind: "diagnostic",
    effects: {
      A: { ice: 2, kpi: 2, pro: 1, speed: 2 },
      B: { couple: 3, drama: 3, drunk: 2, stamp: 1, wifi: 4 },
      C: { "404": 2, npc: 3, sit: 3, sofa: 2, tree: 1 },
    },
  },
  {
    id: 10,
    text: "今年雪季你身上有几处伤？",
    options: ["零伤，我命大", "几处淤青，正常", "膝盖/手腕至少一处去过医院"],
    kind: "diagnostic",
    effects: {
      A: { pizza: 1, safety: 1, sit: 1, sofa: 1, tbd: 1 },
      B: { drama: 1, kpi: 3, powder: 2, stamp: 1, tree: 3 },
      C: { cliff: 5, mri: 5, park: 2, xjbh: 3, yolo: 5 },
    },
  },
  {
    id: 11,
    text: "雪季中你最享受的瞬间是？",
    options: ["完美刻出一条长弯", "粉雪里飘起来的那一刻", "山下温泉/啤酒/火锅下肚的瞬间"],
    kind: "absurd",
    effects: {
      A: { ice: 1, kpi: 1, pro: 1, speed: 2 },
      B: { "404": 1, cliff: 3, powder: 4, tree: 3 },
      C: { drunk: 4, sit: 1, sofa: 3 },
    },
  },
  {
    id: 12,
    text: "你最常出现在哪种雪道？",
    options: ["黑道，越陡越爽", "中级红道，舒服又有挑战", "永远的绿道蓝道，安全第一"],
    kind: "diagnostic",
    effects: {
      A: { cliff: 4, mri: 2, pro: 1, speed: 3, yolo: 5 },
      B: { couple: 2, drunk: 2, kpi: 1, park: 2, stamp: 1, tree: 2, yyds: 4 },
      C: { npc: 2, pizza: 3, rental: 3, safety: 2, taxi: 2, tbd: 1 },
    },
  },
  {
    id: 13,
    text: "你的滑雪相关朋友圈发得多吗？",
    options: ["几乎不发，发了也是滑行视频", "去了发一条纪念", "九宫格精修+长文案，必须发"],
    kind: "diagnostic",
    effects: {
      A: { "404": 1, ice: 1, powder: 1, pro: 3, sit: 1 },
      B: { couple: 3, drunk: 2, npc: 3, stamp: 3 },
      C: { drama: 2, ootd: 3, rip: 5, wifi: 4 },
    },
  },
  {
    id: 14,
    text: "看到限量新装备，你的反应是？",
    options: ["不看，能用就行", "看一眼，记下来回去研究", "管它有用没有，先入手"],
    kind: "diagnostic",
    effects: {
      A: { "404": 1, rental: 4, sit: 1, sofa: 2, taxi: 2 },
      B: { kpi: 2, park: 2, powder: 3, pro: 1, stamp: 3, tree: 2, yyds: 5 },
      C: { bling: 5, ootd: 2, wifi: 2 },
    },
  },
  {
    id: 15,
    text: "单板还是双板？",
    options: ["双板，技术更细腻", "单板，懂的都懂", "无所谓，看心情"],
    kind: "absurd",
    effects: {
      A: { ice: 1, kpi: 1, pizza: 1, pro: 1, safety: 3, speed: 2 },
      B: { cliff: 2, drunk: 2, park: 4, yyds: 5 },
      C: { couple: 1, sit: 1, sofa: 1, stamp: 2, taxi: 2 },
    },
  },
  {
    id: 16,
    text: "你的滑雪日常更多是？",
    options: ["一个人来一个人走", "两三个老朋友一起", "十几人大团，热闹"],
    kind: "diagnostic",
    effects: {
      A: { "404": 1, early: 4, ice: 2, powder: 1, pro: 1, sit: 1, tree: 2 },
      B: { couple: 5, drunk: 1, pua: 3, stamp: 1, yyds: 2 },
      C: { drama: 2, drunk: 2, ootd: 2, rip: 5, taxi: 4, wifi: 2 },
    },
  },
  {
    id: 17,
    text: "山顶面前两条道，你怎么选？",
    options: ["看一眼直接选，凭感觉", "查地图研究一会儿", "等别人先下，看效果再决定"],
    kind: "diagnostic",
    effects: {
      A: { cliff: 3, ice: 1, pro: 2, speed: 1, xjbh: 3, yolo: 3 },
      B: { kpi: 2, safety: 3, stamp: 2, tbd: 5 },
      C: { npc: 2, pizza: 3, pua: 4, sit: 2, taxi: 4 },
    },
  },
  {
    id: 18,
    text: "你是怎么学会滑雪的？",
    options: ["正经请教练系统学", "朋友带，教了点基础", "完全自学，靠摔会的"],
    kind: "diagnostic",
    effects: {
      A: { bling: 4, kpi: 1, ootd: 1, pizza: 1, pro: 1, safety: 1 },
      B: { couple: 3, npc: 2, pua: 3, rental: 2, taxi: 4 },
      C: { "404": 1, cliff: 1, mri: 3, xjbh: 5, yolo: 3 },
    },
  },
  {
    id: 19,
    text: "雪场看到一个穿西装打领带在滑雪，你？",
    options: ["肯定是大神，不打扰", "上去问他刚开完会吗", "明天我也穿，反正显眼"],
    kind: "absurd",
    effects: {
      A: { "404": 1, npc: 1, pua: 2, sit: 1, tbd: 1 },
      B: { drama: 3, drunk: 2, kpi: 2, wifi: 2 },
      C: { bling: 3, ootd: 3, xjbh: 3, yyds: 2 },
    },
  },
  {
    id: 20,
    text: '雪场广播"哪位朋友丢了一只左脚雪靴"，你？',
    options: ["事不关己，继续滑", "默默低头看自己脚", "冲过去说是我的（虽然不是）"],
    kind: "absurd",
    effects: {
      A: { "404": 3, ice: 1, kpi: 2, powder: 2, pro: 2 },
      B: { npc: 4, pizza: 2, pua: 4, rental: 3, tbd: 4, xjbh: 2 },
      C: { drama: 4, drunk: 1, rip: 4, wifi: 2 },
    },
  },
  {
    id: 21,
    text: "缆车停在半空 5 分钟纹丝不动，你？",
    options: ["跟对面缆车的人隔空喊话", '淡定拍 vlog 发"家人们这是山顶限定"', "默默写遗书"],
    kind: "absurd",
    effects: {
      A: { couple: 2, drama: 4, drunk: 2, wifi: 2 },
      B: { ootd: 3, rip: 5, wifi: 3 },
      C: { mri: 2, npc: 2, pua: 5, sit: 1, tbd: 4 },
    },
  },
  {
    id: 22,
    text: "雪道正中间一位大爷在打太极，你？",
    options: ["绕开，不打扰大爷修行", "停下来静静欣赏一会儿", "凑过去问能不能加入"],
    kind: "absurd",
    effects: {
      A: { "404": 1, ice: 1, kpi: 2, pro: 1, safety: 1 },
      B: { npc: 2, sit: 3, sofa: 1, tbd: 2 },
      C: { drama: 4, drunk: 4, taxi: 2, xjbh: 2, yyds: 2 },
    },
  },
  {
    id: 23,
    text: "下午三点，你在？",
    options: ["还在刷道，刷到闭园再说", "休息室喝杯咖啡，准备最后两趟", "已经在山下吃火锅/泡温泉"],
    kind: "diagnostic",
    effects: {
      A: { "404": 1, ice: 1, kpi: 1, powder: 1, pro: 1, speed: 4 },
      B: { bling: 2, couple: 3, npc: 1, safety: 3, stamp: 1, yyds: 2 },
      C: { drunk: 2, ootd: 3, sit: 2, sofa: 4, tbd: 2 },
    },
  },
  {
    id: 24,
    text: "你今年比去年技术上有什么进步？",
    options: ["明显进步，能下更难的道", "原地踏步，还是那样", "今年没怎么滑，没法判断"],
    kind: "diagnostic",
    effects: {
      A: { cliff: 2, early: 3, kpi: 1, park: 3, powder: 1, pro: 2, speed: 1, stamp: 2, tree: 1 },
      B: { drunk: 2, npc: 4, pizza: 3, rental: 2, sit: 1 },
      C: { ootd: 1, sit: 1, sofa: 4, taxi: 2, tbd: 2 },
    },
  },
  {
    id: 25,
    text: "看到一片小树林，你？",
    options: ["肯定不去，太危险了", "看心情，可能溜一圈", "我的心头好，必去"],
    kind: "absurd",
    effects: {
      A: { npc: 1, ootd: 3, pizza: 2, rental: 3, safety: 2, taxi: 2 },
      B: { ice: 3, kpi: 1, park: 2, powder: 2, stamp: 2 },
      C: { "404": 1, cliff: 2, powder: 2, tree: 4 },
    },
  },
  {
    id: 26,
    text: "雪场有个 park 区（跳台/rails），你？",
    options: ["不进去，那是外星人玩的", "看看就好，偶尔玩玩小的", "我的整个雪季都为了这个"],
    kind: "absurd",
    effects: {
      A: { ice: 1, npc: 1, pizza: 1, rental: 1, safety: 1, sofa: 1, tbd: 1 },
      B: { bling: 1, drunk: 2, mri: 2, stamp: 3, wifi: 2 },
      C: { cliff: 3, park: 5, xjbh: 2, yyds: 3 },
    },
  },
  {
    id: 27,
    text: "为什么愿意/不愿意特地飞日本/北海道？",
    options: ["没去过，没必要", "想去打个卡，听说不错", "为了那里的粉雪，每年必去"],
    kind: "absurd",
    effects: {
      A: { npc: 1, pizza: 2, rental: 2, sofa: 1, taxi: 2, xjbh: 2 },
      B: { bling: 3, couple: 2, kpi: 2, ootd: 2, stamp: 3, wifi: 2 },
      C: { "404": 2, cliff: 2, powder: 4, pro: 4, tree: 2 },
    },
  },
  {
    id: 28,
    text: "朋友问你最近滑哪儿，你最想说的答案？",
    options: ["崇礼/亚布力，挺好的", "其实最近没怎么滑", "上次在二世谷，雪比这边好太多了"],
    kind: "absurd",
    effects: {
      A: { couple: 2, kpi: 3, npc: 1, safety: 1, stamp: 2 },
      B: { pua: 2, rental: 3, sit: 1, sofa: 1, taxi: 3, tbd: 2 },
      C: { "404": 3, bling: 3, ootd: 2, powder: 2, pro: 3, yyds: 2 },
    },
  },
  {
    id: 29,
    text: "雪场餐厅有热红酒/啤酒，你？",
    options: ["下午要滑，不喝", "尝两口意思一下", "来一壶，下午滑得更飘"],
    kind: "absurd",
    effects: {
      A: { early: 1, ice: 1, kpi: 1, pizza: 1, pro: 1, safety: 1 },
      B: { couple: 2, ootd: 2, stamp: 1, tree: 2 },
      C: { drama: 2, drunk: 4, sofa: 3, xjbh: 2, yolo: 2 },
    },
  },
  {
    id: 30,
    text: "你滑雪受伤后的朋友圈大概是？",
    options: ["不发，自己默默处理", "发一张冰敷照配文'还活着'", "九宫格 + 三百字小作文"],
    kind: "absurd",
    effects: {
      A: { "404": 2, early: 2, ice: 1, npc: 1, pro: 3, sit: 1 },
      B: { couple: 3, drama: 3, drunk: 1, mri: 4, yolo: 2 },
      C: { drama: 2, ootd: 2, rip: 5, wifi: 3 },
    },
  },
  {
    id: 31,
    text: "你的雪板/头盔上贴了几张贴纸/徽章？",
    options: ["干干净净，原装", "几张，是几个有意义的雪场", "贴满了，每去一个新雪场加一张"],
    kind: "diagnostic",
    effects: {
      A: { "404": 1, ice: 2, kpi: 1, pizza: 2, pua: 2, rental: 1, sit: 1, taxi: 1 },
      B: { couple: 2, drunk: 2, mri: 2, park: 2, tree: 3 },
      C: { park: 2, stamp: 4, yyds: 3 },
    },
  },
  {
    id: 32,
    text: "雪场有测速牌，你的反应？",
    options: ["不在意，速度不是重点", "瞄一眼自己时速", "今天目标 80 km/h，必须破纪录"],
    kind: "absurd",
    effects: {
      A: { "404": 1, npc: 1, ootd: 2, pizza: 1, sit: 1, sofa: 1, taxi: 1, tbd: 1, tree: 2 },
      B: { ice: 5, kpi: 3, pro: 1, stamp: 2, yyds: 2 },
      C: { cliff: 2, mri: 2, speed: 4, xjbh: 2, yolo: 3 },
    },
  },
  {
    id: 33,
    text: "你滑雪日里坐在雪地上发呆最长的一次是多久？",
    options: ["没坐过，摔了立刻起来", "几分钟，缓一下", "至少半小时，被救援队问候过"],
    kind: "absurd",
    effects: {
      A: { early: 2, ice: 1, kpi: 1, pro: 2, safety: 1, speed: 1 },
      B: { drama: 2, mri: 3, npc: 2, pua: 3, rip: 3, sofa: 2, tbd: 2 },
      C: { drunk: 1, sit: 5, sofa: 1 },
    },
  },
  {
    id: 34,
    text: "看到一个 5 米高的雪檐悬崖，你？",
    options: ["绕开，看都不看", "看一眼，留个念想", "起飞"],
    kind: "absurd",
    effects: {
      A: { npc: 1, ootd: 1, pizza: 1, pua: 3, rental: 3, safety: 1, sit: 1, sofa: 1, taxi: 2, tbd: 1 },
      B: { "404": 3, ice: 5, powder: 2, pro: 1, stamp: 1, tree: 3 },
      C: { cliff: 4, mri: 3, park: 2, speed: 2, xjbh: 3, yolo: 3 },
    },
  },
  {
    id: 35,
    text: "雪场有人 cos 滑雪——汉服或西游记打扮——你？",
    options: ["默默欣赏", "拍照发小红书", "明天我也来一套"],
    kind: "absurd",
    effects: {
      A: { "404": 1, ice: 1, npc: 2, pro: 1, safety: 2, sit: 1, tree: 1 },
      B: { couple: 2, drama: 2, ootd: 4, rip: 4, stamp: 2, wifi: 2 },
      C: { drama: 4, drunk: 1, park: 2, xjbh: 3, yolo: 2 },
    },
  },
  {
    id: 36,
    text: "你滑雪戴运动手环/记 GPS 数据吗？",
    options: ["戴，每天都看数据", "戴，但不怎么看", "不戴，没必要"],
    kind: "diagnostic",
    effects: {
      A: { bling: 1, ice: 1, kpi: 1, pro: 1, speed: 3, stamp: 2 },
      B: { bling: 2, couple: 2, drunk: 1, mri: 2, pua: 2, yyds: 2 },
      C: { "404": 2, npc: 2, rental: 1, sit: 1, sofa: 1, taxi: 2, tbd: 1, xjbh: 2 },
    },
  },
];
