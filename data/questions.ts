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

// Design principles:
//  - Every effect entry must have a clear semantic reason
//  - 5 = signature (this question is THE question for this personality)
//  - 4 = strong fit (clearly characteristic)
//  - 3 = moderate fit (consistent with the personality)
//  - 2 = weak fit (mildly aligned)
//  - No 1-point padding; if unclear why a personality would pick it, leave them out

export const questions: Question[] = [
  {
    id: 1,
    text: "你滑雪日的早晨大概是？",
    options: ["5 点起床赶第一班缆车", "10 点优雅到达，先吃个早餐", "下午两三点才出现"],
    kind: "diagnostic",
    effects: {
      // 早起：极致认真型 + 怕错过新雪
      A: { "404": 2, early: 5, kpi: 3, powder: 4, pro: 2 },
      // 优雅迟到：时尚/社交型，悠闲节奏
      B: { bling: 3, couple: 3, drunk: 2, ootd: 4, stamp: 2 },
      // 下午才到：摸鱼型 + 宿醉 + 决策慢
      C: { drunk: 4, sit: 3, sofa: 5, taxi: 3, tbd: 3, xjbh: 4 },
    },
  },
  {
    id: 2,
    text: "今天结束你滑了几趟？",
    options: ["数不过来，反正没停过", "心里有数，10-15 趟左右", "三五趟够本了"],
    kind: "diagnostic",
    effects: {
      // 数不过来：刷道狂
      A: { cliff: 5, early: 4, ice: 4, kpi: 4, pro: 3, speed: 5 },
      // 10-15 趟：技术专精 + 节奏控制
      B: { couple: 3, mri: 3, park: 4, powder: 3, stamp: 3, tree: 4, yyds: 3 },
      // 三五趟：摸鱼/技术不行/决策慢
      C: { drunk: 2, npc: 2, ootd: 3, pizza: 5, pua: 3, rental: 3, sit: 4, sofa: 4, taxi: 4, tbd: 4 },
    },
  },
  {
    id: 3,
    text: "中午你的午饭计划？",
    options: ["雪场快餐 10 分钟搞定", "山下找了一家正经火锅店，吃两小时", "随便对付，主要是要喝两杯"],
    kind: "diagnostic",
    effects: {
      // 快餐 10 分钟：效率至上的刷道狂
      A: { "404": 2, early: 4, ice: 4, kpi: 4, powder: 2, pro: 2, speed: 4 },
      // 火锅 2 小时：来吃饭的（SOFA 签名）+ 约会型
      B: { couple: 3, sit: 2, sofa: 5, tbd: 2 },
      // 喝酒：DRUNK 签名
      C: { drunk: 5, xjbh: 2, yolo: 4 },
    },
  },
  {
    id: 4,
    text: "你刚结结实实摔了一个，第一反应？",
    options: ["立刻爬起来分析动作哪儿不对", "在雪地上躺一会儿喘口气", "掏手机看刚才那段拍下来没"],
    kind: "diagnostic",
    effects: {
      // 立刻分析：技术控
      A: { early: 3, ice: 3, kpi: 4, pro: 3, safety: 2 },
      // 躺一会儿：佛系/受伤/被吓到
      B: { mri: 3, npc: 2, pua: 3, sit: 5, sofa: 3, tbd: 2 },
      // 拍下来：内容创作者
      C: { drama: 5, ootd: 2, park: 3, rip: 5, wifi: 5 },
    },
  },
  {
    id: 5,
    text: "你的雪服是什么调调？",
    options: ["黑灰为主，越低调越好", "中性色但注意搭配", "全套色彩拼接，恨不得发光"],
    kind: "diagnostic",
    effects: {
      // 黑灰低调：严肃专精派
      A: { "404": 4, early: 3, ice: 5, powder: 4, pro: 3, sit: 2, tree: 2 },
      // 中性搭配：常规中庸
      B: { couple: 3, npc: 3, rental: 4, safety: 2, sofa: 3, stamp: 2 },
      // 色彩拼接：花花绿绿型
      C: { bling: 5, drama: 4, ootd: 5, park: 2, rip: 5, wifi: 5 },
    },
  },
  {
    id: 6,
    text: "你滑雪用的板子是？",
    options: ["顶级品牌限量款，价格不忍直视", "自有，普通款，用了几年了", "永远是租的"],
    kind: "diagnostic",
    effects: {
      // 顶级限量款：装备党签名
      A: { bling: 5, cliff: 5, park: 4, powder: 3, pro: 3, speed: 4, stamp: 2, yyds: 5 },
      // 自有几年：稳定老手
      B: { "404": 3, couple: 2, drunk: 2, early: 4, ice: 3, kpi: 2, mri: 2, safety: 2, sofa: 3, tree: 4, yolo: 4 },
      // 永远租：节俭型 + 不投入
      C: { npc: 2, pizza: 5, pua: 2, rental: 5, sit: 2, taxi: 4, tbd: 2, xjbh: 2 },
    },
  },
  {
    id: 7,
    text: "你今天穿了多少护具？",
    options: ["头盔护甲护膝护腕全套", "就一个头盔意思一下", "护具？能吃吗？"],
    kind: "diagnostic",
    effects: {
      // 全套：安全狂签名
      A: { bling: 3, park: 4, pizza: 3, pua: 2, safety: 5, tbd: 2 },
      // 只头盔：理性中庸
      B: { "404": 2, early: 3, ice: 3, kpi: 2, npc: 2, powder: 2, pro: 2, tree: 2 },
      // 没护具：莽 + 不在乎
      C: { cliff: 5, drunk: 2, mri: 4, speed: 4, xjbh: 5, yolo: 5 },
    },
  },
  {
    id: 8,
    text: '朋友说"X 总，下黑道你肯定没问题"，你？',
    options: ["我可不上当，知之为知之", "犹豫一下被推上去了", "他说得对，我去，反正没死过人"],
    kind: "absurd",
    effects: {
      // 不上当：自我认知清晰
      A: { "404": 2, ice: 2, pizza: 4, rental: 3, safety: 3, sit: 2, tbd: 5 },
      // 被推上去：PUA 签名
      B: { couple: 2, drama: 3, mri: 4, pua: 5, taxi: 4 },
      // 他说得对：莽
      C: { cliff: 5, drunk: 2, speed: 4, xjbh: 5, yolo: 5 },
    },
  },
  {
    id: 9,
    text: "缆车上你大概率在干什么？",
    options: ["复盘刚才那条线，想动作要领", "刷手机或者跟旁边人聊天", "看四周风景，啥都不想"],
    kind: "diagnostic",
    effects: {
      // 复盘动作：技术控
      A: { early: 3, ice: 3, kpi: 4, pro: 3, safety: 2, speed: 3 },
      // 刷手机/聊天：内容/社交型
      B: { bling: 2, couple: 3, drama: 3, drunk: 2, ootd: 3, rip: 5, stamp: 2, taxi: 2, wifi: 5 },
      // 看风景啥都不想：佛系/独狼
      C: { "404": 3, npc: 2, sit: 4, sofa: 3, tbd: 3, tree: 2 },
    },
  },
  {
    id: 10,
    text: "今年雪季你身上有几处伤？",
    options: ["零伤，我命大", "几处淤青，正常", "膝盖/手腕至少一处去过医院"],
    kind: "diagnostic",
    effects: {
      // 零伤：安全 + 不动型
      A: { "404": 2, early: 3, npc: 3, pizza: 4, rental: 5, safety: 5, sit: 3, sofa: 4, taxi: 2, tbd: 2 },
      // 几处淤青：正常活跃滑手
      B: { couple: 2, drama: 2, drunk: 2, kpi: 2, park: 4, powder: 3, stamp: 2, tree: 3, yyds: 3 },
      // 进过医院：受伤常客
      C: { cliff: 5, mri: 5, park: 3, rip: 5, speed: 5, xjbh: 4, yolo: 5 },
    },
  },
  {
    id: 11,
    text: "雪季中你最享受的瞬间是？",
    options: ["完美刻出一条长弯", "粉雪里飘起来的那一刻", "山下温泉/啤酒/火锅下肚的瞬间"],
    kind: "absurd",
    effects: {
      // 完美刻弯：技术党
      A: { early: 3, ice: 4, kpi: 3, pro: 5, safety: 2, speed: 5 },
      // 粉雪飘：粉雪党签名
      B: { "404": 3, cliff: 3, powder: 5, tree: 4, yyds: 3 },
      // 温泉啤酒火锅：享乐型
      C: { drunk: 4, npc: 2, rental: 3, sit: 3, sofa: 5 },
    },
  },
  {
    id: 12,
    text: "你最常出现在哪种雪道？",
    options: ["黑道，越陡越爽", "中级红道，舒服又有挑战", "永远的绿道蓝道，安全第一"],
    kind: "diagnostic",
    effects: {
      // 黑道：极端型
      A: { cliff: 5, mri: 4, powder: 2, pro: 3, speed: 4, xjbh: 3, yolo: 5 },
      // 中级红道：稳定中段
      B: { bling: 2, couple: 3, drunk: 2, early: 3, kpi: 3, ootd: 2, park: 2, stamp: 3, tree: 3, yyds: 4 },
      // 绿道蓝道：新手/谨慎
      C: { npc: 3, pizza: 5, pua: 2, rental: 3, safety: 3, sit: 2, sofa: 3, taxi: 3, tbd: 3 },
    },
  },
  {
    id: 13,
    text: "你的滑雪相关朋友圈发得多吗？",
    options: ["几乎不发，发了也是滑行视频", "去了发一条纪念", "九宫格精修+长文案，必须发"],
    kind: "diagnostic",
    effects: {
      // 不发：独狼/低调型
      A: { "404": 5, early: 3, ice: 4, kpi: 2, powder: 2, pro: 2, sit: 3, tree: 2 },
      // 发一条：常规
      B: { bling: 3, couple: 3, drunk: 2, npc: 3, rental: 2, safety: 2, stamp: 4 },
      // 九宫格：内容创作者
      C: { drama: 3, ootd: 5, rip: 5, wifi: 5 },
    },
  },
  {
    id: 14,
    text: "看到限量新装备，你的反应是？",
    options: ["不看，能用就行", "看一眼，记下来回去研究", "管它有用没有，先入手"],
    kind: "diagnostic",
    effects: {
      // 不看：节俭/不投入
      A: { "404": 3, npc: 2, rental: 4, sit: 2, sofa: 3, taxi: 3, xjbh: 5 },
      // 记下来研究：内行评估
      B: { kpi: 3, park: 2, powder: 3, pro: 3, safety: 2, stamp: 3, tbd: 3, tree: 2, yyds: 3 },
      // 先入手：装备控
      C: { bling: 5, ootd: 3, speed: 3, wifi: 5 },
    },
  },
  {
    id: 15,
    text: "单板还是双板？",
    options: ["双板，技术更细腻", "单板，懂的都懂", "无所谓，看心情"],
    kind: "absurd",
    effects: {
      // 双板：默认/技术派
      A: { "404": 2, couple: 2, early: 3, ice: 2, kpi: 2, npc: 2, pizza: 4, pro: 2, pua: 2, rental: 2, safety: 2, speed: 4, tbd: 2, tree: 2 },
      // 单板：单板党签名
      B: { bling: 2, cliff: 4, drama: 2, drunk: 2, park: 5, powder: 2, xjbh: 5, yolo: 5, yyds: 5 },
      // 无所谓：随意型
      C: { couple: 2, rip: 4, sit: 2, sofa: 3, stamp: 2, taxi: 3 },
    },
  },
  {
    id: 16,
    text: "你的滑雪日常更多是？",
    options: ["一个人来一个人走", "两三个老朋友一起", "十几人大团，热闹"],
    kind: "diagnostic",
    effects: {
      // 一个人：独狼们
      A: { "404": 5, cliff: 3, early: 5, ice: 4, kpi: 2, powder: 4, pro: 3, sit: 2, speed: 4, tree: 3 },
      // 两三个朋友：情侣党签名
      B: { couple: 5, drunk: 3, park: 2, pua: 4, stamp: 2, tree: 2, yyds: 3 },
      // 大团：社牛
      C: { drama: 5, drunk: 2, ootd: 2, rip: 4, taxi: 4, wifi: 4 },
    },
  },
  {
    id: 17,
    text: "山顶面前两条道，你怎么选？",
    options: ["看一眼直接选，凭感觉", "查地图研究一会儿", "等别人先下，看效果再决定"],
    kind: "diagnostic",
    effects: {
      // 凭感觉：莽 + 自信
      A: { "404": 2, cliff: 3, drunk: 2, ice: 3, mri: 2, pro: 3, speed: 4, xjbh: 5, yolo: 5 },
      // 查地图：选道困难症签名
      B: { couple: 2, kpi: 2, powder: 2, pua: 2, safety: 3, stamp: 3, tbd: 5, tree: 3 },
      // 等别人先下：跟随型
      C: { npc: 2, pizza: 3, pua: 3, rental: 2, sit: 2, taxi: 5 },
    },
  },
  {
    id: 18,
    text: "你是怎么学会滑雪的？",
    options: ["正经请教练系统学", "朋友带，教了点基础", "完全自学，靠摔会的"],
    kind: "diagnostic",
    effects: {
      // 请教练：正规
      A: { bling: 5, couple: 2, kpi: 3, mri: 2, ootd: 2, pizza: 4, pro: 3, safety: 3 },
      // 朋友带
      B: { couple: 3, drunk: 2, npc: 2, pua: 3, rental: 2, stamp: 2, taxi: 5, tbd: 2 },
      // 自学摔会：瞎几把滑签名
      C: { "404": 2, cliff: 3, drunk: 2, mri: 3, park: 3, speed: 2, tree: 3, xjbh: 5, yolo: 5, yyds: 4 },
    },
  },
  {
    id: 19,
    text: "雪场看到一个穿西装打领带在滑雪，你？",
    options: ["肯定是大神，不打扰", "上去问他刚开完会吗", "明天我也穿，反正显眼"],
    kind: "absurd",
    effects: {
      // 不打扰：内向/认怂
      A: { "404": 2, ice: 2, npc: 2, pro: 2, pua: 2, safety: 2, sit: 2, tbd: 2 },
      // 上去问：社牛/搞笑
      B: { drama: 5, drunk: 3, wifi: 5 },
      // 明天我也穿：显眼包
      C: { bling: 3, drama: 2, ootd: 4, park: 2, xjbh: 3, yyds: 3 },
    },
  },
  {
    id: 20,
    text: '雪场广播"哪位朋友丢了一只左脚雪靴"，你？',
    options: ["事不关己，继续滑", "默默低头看自己脚", "冲过去说是我的（虽然不是）"],
    kind: "absurd",
    effects: {
      // 事不关己：专注/独狼
      A: { "404": 3, early: 3, ice: 3, kpi: 2, powder: 2, pro: 3, speed: 3, tree: 2 },
      // 默默看脚：谨慎/焦虑
      B: { mri: 2, npc: 3, pizza: 3, pua: 5, rental: 3, safety: 2, sit: 2, taxi: 3, tbd: 4 },
      // 冲过去说是我的：戏精
      C: { drama: 5, drunk: 3, rip: 5, wifi: 4, yolo: 2 },
    },
  },
  {
    id: 21,
    text: "缆车停在半空 5 分钟纹丝不动，你？",
    options: ["跟对面缆车的人隔空喊话", '淡定拍 vlog 发"家人们这是山顶限定"', "默默写遗书"],
    kind: "absurd",
    effects: {
      // 隔空喊话：戏精
      A: { couple: 2, drama: 5, drunk: 3, yolo: 2 },
      // 拍 vlog：内容创作者签名
      B: { ootd: 4, rip: 5, wifi: 5 },
      // 写遗书：心理脆弱型
      C: { mri: 2, npc: 2, pizza: 3, pua: 5, safety: 2, sit: 3, sofa: 3, tbd: 4 },
    },
  },
  {
    id: 22,
    text: "雪道正中间一位大爷在打太极，你？",
    options: ["绕开，不打扰大爷修行", "停下来静静欣赏一会儿", "凑过去问能不能加入"],
    kind: "absurd",
    effects: {
      // 绕开：守规矩
      A: { "404": 2, early: 3, ice: 3, kpi: 2, npc: 2, pro: 3, safety: 4 },
      // 静静欣赏：佛系/坐山雕签名
      B: { npc: 2, sit: 5, sofa: 3, tbd: 2 },
      // 加入：戏精/无厘头
      C: { drama: 5, drunk: 4, taxi: 3, wifi: 2, xjbh: 3, yyds: 2 },
    },
  },
  {
    id: 23,
    text: "下午三点，你在？",
    options: ["还在刷道，刷到闭园再说", "休息室喝杯咖啡，准备最后两趟", "已经在山下吃火锅/泡温泉"],
    kind: "diagnostic",
    effects: {
      // 还在刷道：专注派
      A: { "404": 2, cliff: 3, early: 4, ice: 4, kpi: 4, park: 3, powder: 4, pro: 3, speed: 3 },
      // 喝咖啡再两趟：节奏控
      B: { bling: 3, couple: 3, mri: 2, npc: 2, safety: 2, stamp: 3, tree: 2, yyds: 5 },
      // 山下温泉火锅：摸鱼派
      C: { drunk: 4, ootd: 3, pua: 3, rental: 2, sit: 4, sofa: 5, taxi: 2, tbd: 2 },
    },
  },
  {
    id: 24,
    text: "你今年比去年技术上有什么进步？",
    options: ["明显进步，能下更难的道", "原地踏步，还是那样", "今年没怎么滑，没法判断"],
    kind: "diagnostic",
    effects: {
      // 明显进步：努力进步型
      A: { cliff: 3, early: 4, kpi: 5, park: 4, powder: 2, pro: 3, speed: 2, stamp: 2, tree: 3 },
      // 原地踏步：背景板/新手停滞
      B: { bling: 2, drunk: 2, npc: 5, pizza: 4, rental: 3, sit: 3, sofa: 2, taxi: 3, tbd: 2 },
      // 今年没怎么滑：休闲型
      C: { mri: 4, ootd: 3, pua: 3, rental: 2, rip: 4, sit: 2, sofa: 3, taxi: 3, tbd: 2 },
    },
  },
  {
    id: 25,
    text: "看到一片小树林，你？",
    options: ["肯定不去，太危险了", "看心情，可能溜一圈", "我的心头好，必去"],
    kind: "absurd",
    effects: {
      // 不去：保守型
      A: { couple: 2, npc: 3, ootd: 2, pizza: 4, pua: 5, rental: 5, safety: 4, sit: 2, sofa: 2, taxi: 2, tbd: 3 },
      // 看心情：中段
      B: { drunk: 2, early: 3, ice: 2, kpi: 2, mri: 2, park: 4, powder: 2, pro: 2, stamp: 3, yyds: 4 },
      // 必去：树林党签名
      C: { "404": 4, cliff: 2, powder: 3, tree: 5, yolo: 3 },
    },
  },
  {
    id: 26,
    text: "雪场有个 park 区（跳台/rails），你？",
    options: ["不进去，那是外星人玩的", "看看就好，偶尔玩玩小的", "我的整个雪季都为了这个"],
    kind: "absurd",
    effects: {
      // 不进去：保守
      A: { ice: 2, npc: 3, pizza: 4, pua: 2, rental: 2, safety: 4, sit: 2, sofa: 2, tbd: 2 },
      // 看看就好
      B: { bling: 3, couple: 2, drama: 3, drunk: 2, mri: 2, ootd: 2, powder: 2, stamp: 3, tree: 2, wifi: 3 },
      // 整个雪季为了这个：公园老鼠签名
      C: { cliff: 5, park: 5, xjbh: 3, yyds: 5 },
    },
  },
  {
    id: 27,
    text: "为什么愿意/不愿意特地飞日本/北海道？",
    options: ["没去过，没必要", "想去打个卡，听说不错", "为了那里的粉雪，每年必去"],
    kind: "absurd",
    effects: {
      // 没去过没必要：本地党
      A: { mri: 3, npc: 3, pizza: 4, pua: 2, rental: 4, sit: 2, sofa: 2, taxi: 4, tbd: 2, xjbh: 2 },
      // 打个卡：集邮型
      B: { bling: 3, couple: 3, kpi: 2, ootd: 3, rip: 5, stamp: 5, wifi: 4 },
      // 为了粉雪：国际派
      C: { "404": 3, cliff: 4, ice: 2, park: 2, powder: 5, pro: 4, tree: 3, yyds: 5 },
    },
  },
  {
    id: 28,
    text: "朋友问你最近滑哪儿，你最想说的答案？",
    options: ["崇礼/亚布力，挺好的", "其实最近没怎么滑", "上次在二世谷，雪比这边好太多了"],
    kind: "absurd",
    effects: {
      // 崇礼挺好：本地常规
      A: { bling: 2, couple: 3, drunk: 2, ice: 2, kpi: 2, npc: 3, pua: 3, safety: 2, sofa: 2, stamp: 3 },
      // 没怎么滑：边缘型
      B: { mri: 3, pizza: 2, pua: 2, rental: 4, sit: 3, sofa: 2, taxi: 3, tbd: 3 },
      // 二世谷：凡尔赛
      C: { "404": 2, bling: 3, ootd: 3, powder: 4, pro: 4, stamp: 2, wifi: 5 },
    },
  },
  {
    id: 29,
    text: "雪场餐厅有热红酒/啤酒，你？",
    options: ["下午要滑，不喝", "尝两口意思一下", "来一壶，下午滑得更飘"],
    kind: "absurd",
    effects: {
      // 不喝：自律
      A: { "404": 2, early: 3, ice: 3, kpi: 3, mri: 2, pizza: 2, pro: 2, safety: 4 },
      // 尝两口：常规
      B: { couple: 3, ootd: 2, stamp: 3, tree: 2, wifi: 4 },
      // 来一壶：醉侠签名
      C: { cliff: 3, drama: 2, drunk: 5, mri: 2, sofa: 2, xjbh: 4, yolo: 4 },
    },
  },
  {
    id: 30,
    text: "你滑雪受伤后的朋友圈大概是？",
    options: ["不发，自己默默处理", "发一张冰敷照配文'还活着'", "九宫格 + 三百字小作文：'家人们这辈子滑雪生涯就到这了'"],
    kind: "absurd",
    effects: {
      // 不发：低调型
      A: { "404": 4, early: 4, ice: 4, kpi: 2, npc: 2, powder: 2, pro: 3, safety: 2, sit: 2, tree: 2 },
      // 冰敷照：常规戏剧
      B: { bling: 3, couple: 3, drama: 4, drunk: 2, mri: 4, park: 2, pua: 2, stamp: 2, yolo: 3, yyds: 3 },
      // 九宫格小作文：报丧员签名
      C: { drama: 5, ootd: 4, rip: 5, wifi: 3 },
    },
  },
  {
    id: 31,
    text: "你的雪板/头盔上贴了几张贴纸/徽章？",
    options: ["干干净净，原装", "几张，是几个有意义的雪场", "贴满了，每去一个新雪场加一张"],
    kind: "diagnostic",
    effects: {
      // 干干净净：极简主义
      A: { "404": 3, early: 3, ice: 3, kpi: 2, npc: 2, pizza: 2, pro: 2, pua: 2, rental: 5, safety: 3, sit: 2, sofa: 2, taxi: 2, tbd: 2 },
      // 几张：常规
      B: { bling: 2, couple: 3, drunk: 2, mri: 3, park: 3, powder: 2, tree: 2, yyds: 2 },
      // 贴满：打卡党签名
      C: { bling: 2, park: 3, stamp: 5, yyds: 3 },
    },
  },
  {
    id: 32,
    text: "雪场有测速牌，你的反应？",
    options: ["不在意，速度不是重点", "瞄一眼自己时速", "今天目标 80 km/h，必须破纪录"],
    kind: "absurd",
    effects: {
      // 不在意：非速度向
      A: { "404": 2, couple: 2, npc: 2, ootd: 3, pizza: 4, powder: 2, rental: 3, safety: 2, sit: 2, sofa: 2, taxi: 2, tbd: 2, tree: 3 },
      // 瞄一眼：好奇
      B: { bling: 3, early: 3, ice: 2, kpi: 3, pro: 3, stamp: 3, yyds: 3 },
      // 80 km/h：速度狂签名
      C: { cliff: 3, kpi: 2, mri: 2, speed: 5, xjbh: 4, yolo: 5 },
    },
  },
  {
    id: 33,
    text: "你滑雪日里坐在雪地上发呆最长的一次是多久？",
    options: ["没坐过，摔了立刻起来", "几分钟，缓一下", "至少半小时，被救援队问候过"],
    kind: "absurd",
    effects: {
      // 立刻起来：高效
      A: { early: 3, ice: 3, kpi: 4, pizza: 2, pro: 3, safety: 2, speed: 2 },
      // 几分钟：常规
      B: { drama: 2, drunk: 2, mri: 3, npc: 2, pua: 3, rip: 5, sofa: 2, tbd: 3 },
      // 至少半小时：坐山雕签名
      C: { "404": 2, drunk: 3, npc: 2, sit: 5, sofa: 3, taxi: 3 },
    },
  },
  {
    id: 34,
    text: "看到一个 5 米高的雪檐悬崖，你？",
    options: ["绕开，看都不看", "看一眼，留个念想", "起飞"],
    kind: "absurd",
    effects: {
      // 绕开：保守
      A: { npc: 3, ootd: 2, pizza: 3, pua: 4, rental: 4, safety: 4, sit: 2, sofa: 2, taxi: 2, tbd: 3 },
      // 看一眼：欣赏型
      B: { "404": 2, couple: 2, early: 3, ice: 2, powder: 3, pro: 2, stamp: 2, tree: 3 },
      // 起飞：跳崖党签名
      C: { cliff: 5, mri: 4, park: 3, speed: 2, xjbh: 3, yolo: 5 },
    },
  },
  {
    id: 35,
    text: "雪场有人 cos 滑雪——汉服或西游记打扮——你？",
    options: ["默默欣赏", "拍照发小红书", "明天我也来一套"],
    kind: "absurd",
    effects: {
      // 默默欣赏：内向
      A: { "404": 2, ice: 2, npc: 2, powder: 3, pro: 2, safety: 2, sit: 2, tbd: 2, tree: 2 },
      // 拍照发小红书：内容党
      B: { bling: 2, couple: 2, drama: 2, ootd: 4, rip: 4, stamp: 2, wifi: 5 },
      // 明天我也来：显眼包
      C: { drama: 4, drunk: 3, ootd: 2, park: 2, xjbh: 4, yolo: 2, yyds: 2 },
    },
  },
  {
    id: 36,
    text: "你滑雪戴运动手环/记 GPS 数据吗？",
    options: ["戴，每天都看数据", "戴，但不怎么看", "不戴，没必要"],
    kind: "diagnostic",
    effects: {
      // 戴看数据：数据控签名
      A: { bling: 2, ice: 2, kpi: 5, pro: 2, speed: 3, stamp: 3 },
      // 戴但不看
      B: { bling: 2, couple: 2, mri: 2, park: 3, powder: 2, stamp: 2, tree: 2, yyds: 2 },
      // 不戴：随性
      C: { "404": 2, drunk: 2, npc: 2, rental: 2, sit: 3, sofa: 2, taxi: 2, tbd: 2, xjbh: 4 },
    },
  },
];
