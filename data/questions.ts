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
    options: ["复盘刚才那条线", "刷手机", "跟旁边陌生人聊今天雪况"],
    effects: [
      { dim: "s1", scores: [3, 2, 1] },
      { dim: "s3", scores: [1, 2, 3] },
    ],
  },
  {
    id: 2,
    text: "你摔倒的时候雪镜飞了，帽子也飞了，手套也飞了，你第一反应？",
    options: ["先找手机看碎没碎", "保持摔倒的姿势不动，假装在做雪天使", `大喊"有没有人帮我录到了"`],
    effects: [
      { dim: "s3", scores: [1, 2, 3] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 3,
    text: "如果你的滑雪板会说话，它最可能说的是？",
    options: ["求你了轻点", "我们又来这条道了？第47次了", "你根本配不上我"],
    effects: [
      { dim: "s1", scores: [3, 1, 2] },
      { dim: "s6", scores: [1, 2, 3] },
    ],
  },
  {
    id: 4,
    text: "你在雪场看到有人穿西装打领带在滑雪，你？",
    options: ["这人比我有排面", "过去问他是不是刚开完会", "明天我也穿"],
    effects: [
      { dim: "s4", scores: [2, 1, 3] },
      { dim: "s3", scores: [1, 3, 2] },
    ],
  },
  {
    id: 5,
    text: "你在缆车上，前面的人雪板上绑了一只毛绒企鹅，你？",
    options: ["我也想要一只", `默默拍照发朋友圈"今日雪场显眼包"`, "下缆车后跟着他滑了三趟试图搭讪问哪买的"],
    effects: [
      { dim: "s4", scores: [2, 1, 3] },
      { dim: "s3", scores: [1, 2, 3] },
    ],
  },
  {
    id: 6,
    text: "雪具室里你的板子是？",
    options: ["租的，能滑就行", "自己的板，用了几年了", "限量联名款，比我滑得好"],
    effects: [{ dim: "s6", scores: [1, 2, 3] }],
  },
  {
    id: 7,
    text: "下午三点，你在？",
    options: ["还在刷道", "休息室喝杯咖啡准备最后几趟", "已经在山下吃火锅了"],
    effects: [{ dim: "s5", scores: [1, 2, 3] }],
  },
  {
    id: 8,
    text: "你滑到一半，发现前面有个大爷在雪道正中间打太极，你？",
    options: [
      "绕开，不打扰大爷修行",
      "停下来静静欣赏一会儿",
      "凑过去问能不能加入",
    ],
    effects: [
      { dim: "s1", scores: [2, 1, 3] },
      { dim: "s3", scores: [1, 2, 3] },
    ],
  },
  {
    id: 9,
    text: "你的雪服颜色是？",
    options: ["黑灰为主，低调实用", "有点颜色但不夸张", "全身荧光色，生怕别人看不见我"],
    effects: [{ dim: "s4", scores: [1, 2, 3] }],
  },
  {
    id: 10,
    text: "有人在你面前摔了一个超夸张的跟头，你？",
    options: ["赶紧上去问他没事吧", "先确认他没事，然后忍不住笑", "掏出手机——这段可以发抖音"],
    effects: [
      { dim: "s3", scores: [2, 2, 3] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 11,
    text: "缆车停在半空中纹丝不动 5 分钟了，你？",
    options: [
      "开始跟对面缆车的陌生人隔空喊话",
      `淡定掏出手机拍 vlog"家人们这是山顶限定"`,
      "默默开始在心里写遗书",
    ],
    effects: [
      { dim: "s3", scores: [3, 2, 1] },
      { dim: "s4", scores: [1, 3, 1] },
    ],
  },
  {
    id: 12,
    text: "你的滑雪朋友圈画风是？",
    options: ["很少发，滑就完了", "偶尔发个风景或者滑行视频", "九宫格精修图+详细文案+定位"],
    effects: [
      { dim: "s3", scores: [1, 2, 3] },
      { dim: "s4", scores: [1, 2, 3] },
    ],
  },
  {
    id: 13,
    text: "如果雪场有蹦迪夜场，你去吗？",
    options: ["不去，我是来滑雪的", "看情况，人多热闹去凑个乐", "我就是为这个来的，雪都不用下"],
    effects: [
      { dim: "s3", scores: [1, 2, 3] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 14,
    text: "你摔了一个大跟头，旁边有人在看，你会？",
    options: ["立刻站起来假装没事然后默默检查有没有骨折", "躺在雪地上不动等人来问你还好吗", "摔得太帅了，让朋友把刚才那段发给我"],
    effects: [
      { dim: "s3", scores: [1, 2, 3] },
      { dim: "s1", scores: [2, 1, 3] },
    ],
  },
  {
    id: 15,
    text: "你在雪道上被一个小朋友超了，你？",
    options: ["无所谓，小孩子嘛", "加速追上去然后假装只是顺路", "当场宣布退役"],
    effects: [
      { dim: "s1", scores: [1, 3, 2] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 16,
    text: `雪场广播响起"请问哪位滑友丢了一只左脚雪鞋"，你？`,
    options: [
      "事不关己，继续滑",
      "默默低头看了看自己的脚",
      "冲过去说是我的（虽然并不是）",
    ],
    effects: [
      { dim: "s3", scores: [1, 2, 3] },
      { dim: "s5", scores: [1, 1, 3] },
    ],
  },
  {
    id: 17,
    text: "你的滑雪包里一定有？",
    options: ["备用手套和暖宝宝", "零食和充电宝", "自拍杆和补妆镜"],
    effects: [
      { dim: "s4", scores: [1, 2, 3] },
      { dim: "s5", scores: [1, 3, 2] },
    ],
  },
  {
    id: 18,
    text: "下雪天你的反应是？",
    options: ["查雪场实时雪况，计划周末出发", `发朋友圈"又到滑雪季"配一张去年的照片`, "翘班去滑雪，今天的雪明天就没了"],
    effects: [
      { dim: "s1", scores: [2, 1, 3] },
      { dim: "s5", scores: [1, 3, 1] },
    ],
  },
  {
    id: 19,
    text: "你选雪场最看重？",
    options: ["雪道难度和雪质", "交通方便、设施好", "餐厅好不好吃、酒店舒不舒服"],
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
      `朋友在旁边说"X总，你没问题的"，然后我就上去了`,
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
    options: ["更多高级道和野雪区域", "山顶温泉和观景台", "道内WiFi全覆盖和充电站"],
    effects: [
      { dim: "s2", scores: [3, 2, 1] },
      { dim: "s5", scores: [1, 3, 2] },
    ],
  },
  {
    id: 22,
    text: "你在雪场排队等缆车，前面至少要等20分钟，你？",
    options: ["等，这条道值得", "换一条不排队的道", "算了去喝咖啡，等人少了再来"],
    effects: [
      { dim: "s2", scores: [3, 2, 1] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 23,
    text: "你在雪道中间停下来系鞋带，后面撞过来一个人，你？",
    options: [
      "赶紧道歉",
      "说是他没看路",
      "就地痛苦呻吟打算讹一笔",
    ],
    effects: [
      { dim: "s1", scores: [1, 2, 3] },
      { dim: "s5", scores: [1, 1, 3] },
    ],
  },
  {
    id: 24,
    text: "你跟一群朋友去滑雪，到了雪场你？",
    options: ["自己先冲了，回头见", "一起滑几趟，然后各玩各的", "全程不分开，一起滑一起拍照一起吃饭"],
    effects: [{ dim: "s3", scores: [1, 2, 3] }],
  },
  {
    id: 25,
    text: "你觉得滑雪最爽的瞬间是？",
    options: ["完美刻滑一条长弯", "粉雪里飘起来的那一刻", "躺在雪地里看蓝天什么都不想"],
    effects: [
      { dim: "s1", scores: [1, 3, 2] },
      { dim: "s2", scores: [1, 3, 1] },
    ],
  },
  {
    id: 26,
    text: "你发现今天雪况很冰，你？",
    options: ["调整技术，冰面也是训练", "减少难度，安全第一", "去餐厅坐着等它化"],
    effects: [
      { dim: "s1", scores: [3, 1, 1] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
  {
    id: 27,
    text: "雪场看到一个穿汉服滑雪的姐姐，你？",
    options: [
      "文化输出，默默点个赞",
      "掏手机拍照发小红书",
      "明天我穿西游记 cos 来",
    ],
    effects: [
      { dim: "s4", scores: [1, 2, 3] },
      { dim: "s3", scores: [1, 2, 3] },
    ],
  },
  {
    id: 28,
    text: "如果给你一天无限缆车不排队，你会？",
    options: ["从早刷到晚，一趟不浪费", "上午刷道，下午试试没去过的区域", "上午滑两趟，然后找个好位置拍延时摄影"],
    effects: [
      { dim: "s5", scores: [1, 1, 3] },
      { dim: "s2", scores: [2, 3, 1] },
    ],
  },
  {
    id: 29,
    text: "你的护具情况是？",
    options: ["头盔护甲护膝全套", "就一个头盔", "护具是什么，能吃吗"],
    effects: [
      { dim: "s1", scores: [1, 2, 3] },
      { dim: "s6", scores: [3, 2, 1] },
    ],
  },
  {
    id: 30,
    text: "缆车上你旁边的人在吃辣条，味道特别大，你？",
    options: [
      "默默往边上挪",
      "闻着还挺香",
      "问他有没有多的分我一根",
    ],
    effects: [
      { dim: "s3", scores: [1, 2, 3] },
      { dim: "s5", scores: [1, 2, 3] },
    ],
  },
];
