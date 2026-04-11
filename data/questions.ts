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
      // 早起：早起党签名（独占）
      A: { early: 10, powder: 2 },
      // 优雅迟到：时尚/社交型，悠闲节奏
      B: { bling: 3, couple: 3, drunk: 2, ootd: 5, stamp: 2 },
      // 下午才到：摸鱼型 + 宿醉 + 决策慢
      C: { drunk: 4, sit: 2, sofa: 5, xjbh: 5 } } },
  {
    id: 2,
    text: "今天结束你滑了几趟？",
    options: ["数不过来，反正没停过", "心里有数，10-15 趟左右", "三五趟够本了"],
    kind: "diagnostic",
    effects: {
      // 数不过来：刷道狂
      A: { cliff: 3, early: 4, speed: 4 },
      // 10-15 趟：技术专精 + 节奏控制 + KPI 数清楚
      B: { couple: 3, kpi: 3, mri: 3, park: 5, powder: 3, stamp: 3, tree: 5, yyds: 5 },
      // 三五趟：摸鱼/技术不行/决策慢
      C: { drunk: 2, npc: 2, ootd: 3, pizza: 5, rental: 3, sit: 5, sofa: 4 } } },
  {
    id: 3,
    text: "中午你的午饭计划？",
    options: ["雪场快餐 10 分钟搞定", "山下找了一家正经火锅店，吃两小时", "随便对付，主要是要喝两杯"],
    kind: "diagnostic",
    effects: {
      // 快餐 10 分钟：效率至上的刷道狂 + KPI 时间管理
      A: { "404": 2, early: 3, kpi: 3, powder: 2, speed: 4 },
      // 火锅 2 小时：来吃饭的（SOFA 签名）+ 约会型
      B: { couple: 3, sit: 1, sofa: 5 },
      // 喝酒：DRUNK 签名
      C: { drunk: 5, xjbh: 2, yolo: 4 } } },
  {
    id: 4,
    text: "你刚结结实实摔了一个，第一反应？",
    options: ["立刻爬起来分析动作哪儿不对", "在雪地上躺一会儿喘口气", "掏手机看刚才那段拍下来没"],
    kind: "diagnostic",
    effects: {
      // 立刻分析：技术控 + PRO 本能
      A: { early: 2, kpi: 8, pro: 5, safety: 2 },
      // 躺一会儿：佛系/受伤/被吓到
      B: { mri: 3, npc: 2, sit: 5, sofa: 1 },
      // 拍下来：内容创作者
      C: { drama: 5, ootd: 2, park: 3, rip: 5, wifi: 5 } } },
  {
    id: 5,
    text: "你的雪服是什么调调？",
    options: ["黑灰为主，越低调越好", "中性色但注意搭配", "全套色彩拼接，恨不得发光"],
    kind: "diagnostic",
    effects: {
      // 黑灰低调：严肃专精派
      A: { "404": 3, early: 4, powder: 3, pro: 2, sit: 2, tree: 2 },
      // 中性搭配：常规中庸
      B: { couple: 3, npc: 3, rental: 4, safety: 2, sofa: 2, stamp: 2 },
      // 色彩拼接：花花绿绿型
      C: { bling: 5, drama: 5, ootd: 5, park: 3, rip: 5, wifi: 5 } } },
  {
    id: 6,
    text: "你滑雪用的板子是？",
    options: ["顶级品牌限量款，价格不忍直视", "自有，普通款，用了几年了", "永远是租的"],
    kind: "diagnostic",
    effects: {
      // 顶级限量款：装备党签名
      A: { bling: 5, cliff: 5, park: 4, powder: 4, speed: 5, stamp: 2, yyds: 5 },
      // 自有几年：稳定老手
      B: { "404": 4, couple: 2, drunk: 2, mri: 2, safety: 2, sofa: 2, tree: 4, yolo: 4 },
      // 永远租：节俭型 + 不投入
      C: { npc: 2, pizza: 5, rental: 5, sit: 2, xjbh: 3 } } },
  {
    id: 7,
    text: "你今天穿了多少护具？",
    options: ["头盔护甲护膝护腕全套", "就一个头盔意思一下", "护具？能吃吗？"],
    kind: "diagnostic",
    effects: {
      // 全套：安全狂签名
      A: { bling: 3, park: 4, pizza: 3, safety: 5 },
      // 只头盔：理性中庸
      B: { "404": 2, npc: 2, powder: 2, tree: 2 },
      // 没护具：莽 + 不在乎
      C: { cliff: 5, drunk: 1, mri: 4, speed: 5, xjbh: 5, yolo: 5 } } },
  {
    id: 8,
    text: "你第一次上高级道是因为？",
    options: ["循序渐进练到了那个水平", '朋友在旁边说"X 总，你没问题的"，然后我就上去了', "走错了"],
    kind: "absurd",
    effects: {
      // 循序渐进：稳健高手
      A: { powder: 2, pro: 5, safety: 3, stamp: 2, tree: 2 },
      // 被朋友架上去：戏剧/受伤
      B: { bling: 2, couple: 3, drama: 3, mri: 5, ootd: 2, rip: 3 },
      // 走错了：莽
      C: { "404": 2, cliff: 4, drunk: 2, sofa: 1, xjbh: 5, yolo: 5 } } },
  {
    id: 9,
    text: "缆车上你大概率在干什么？",
    options: ["复盘刚才那条线，想动作要领", "刷手机或者跟旁边人聊天", "看四周风景，啥都不想"],
    kind: "diagnostic",
    effects: {
      // 复盘动作：技术控 + PRO
      A: { early: 3, kpi: 6, pro: 5, safety: 2, speed: 3 },
      // 刷手机/聊天：内容/社交型
      B: { bling: 2, couple: 3, drama: 3, drunk: 2, ootd: 3, rip: 5, stamp: 2, wifi: 5 },
      // 看风景啥都不想：佛系/独狼
      C: { "404": 3, npc: 2, sit: 4, sofa: 1, tree: 2 } } },
  {
    id: 10,
    text: "今年雪季你身上有几处伤？",
    options: ["零伤，我命大", "几处淤青，正常", "膝盖/手腕至少一处去过医院"],
    kind: "diagnostic",
    effects: {
      // 零伤：安全 + 不动型
      A: { "404": 2, npc: 3, pizza: 5, rental: 5, safety: 5, sit: 2, sofa: 4 },
      // 几处淤青：正常活跃滑手
      B: { couple: 2, drama: 4, drunk: 2, park: 4, powder: 3, stamp: 2, tree: 3, yyds: 4 },
      // 进过医院：受伤常客
      C: { cliff: 5, mri: 5, park: 3, rip: 5, speed: 5, xjbh: 5, yolo: 5 } } },
  {
    id: 11,
    text: "雪季中你最享受的瞬间是？",
    options: ["完美刻出一条长弯", "粉雪里飘起来的那一刻", "山下温泉/啤酒/火锅下肚的瞬间"],
    kind: "absurd",
    effects: {
      // 完美刻弯：PRO 签名（独占）
      A: { early: 3, pro: 8, speed: 2 },
      // 粉雪飘：粉雪党签名
      B: { "404": 3, cliff: 3, powder: 5, tree: 4, yyds: 3 },
      // 温泉啤酒火锅：享乐型
      C: { drunk: 4, npc: 2, rental: 3, sit: 4, sofa: 5 } } },
  {
    id: 12,
    text: "你最常出现在哪种雪道？",
    options: ["黑道，越陡越爽", "中级红道，舒服又有挑战", "永远的绿道蓝道，安全第一"],
    kind: "diagnostic",
    effects: {
      // 黑道：极端型
      A: { cliff: 5, mri: 4, powder: 2, pro: 4, speed: 5, xjbh: 3, yolo: 5 },
      // 中级红道：稳定中段
      B: { bling: 2, couple: 3, drunk: 1, ootd: 2, park: 3, stamp: 3, tree: 3, yyds: 5 },
      // 绿道蓝道：新手/谨慎
      C: { npc: 3, pizza: 5, rental: 3, safety: 3, sit: 1, sofa: 3 } } },
  {
    id: 13,
    text: "你的滑雪相关朋友圈发得多吗？",
    options: ["几乎不发，发了也是滑行视频", "去了发一条纪念", "九宫格精修+长文案，必须发"],
    kind: "diagnostic",
    effects: {
      // 不发：独狼/低调型
      A: { "404": 5, powder: 2, sit: 2, tree: 2 },
      // 发一条：常规
      B: { bling: 3, couple: 3, drunk: 2, npc: 3, rental: 3, safety: 2, stamp: 4 },
      // 九宫格：内容创作者
      C: { drama: 3, ootd: 5, rip: 5, wifi: 5 } } },
  {
    id: 14,
    text: "你的滑雪包里一定有？",
    options: ["备用手套和暖宝宝", "零食和充电宝", "自拍杆和补妆镜"],
    kind: "diagnostic",
    effects: {
      // 实用谨慎 + PRO 准备充分 + KPI 应急预案
      A: { "404": 2, kpi: 2, mri: 3, npc: 2, pizza: 3, powder: 2, pro: 2, rental: 2, safety: 4, tree: 2 },
      // 摸鱼吃货
      B: { couple: 3, drama: 3, drunk: 3, sit: 3, sofa: 4, stamp: 2 },
      // 内容/穿搭
      C: { bling: 4, drama: 2, ootd: 5, park: 2, rip: 3, wifi: 5 } } },
  {
    id: 15,
    text: "单板还是双板？",
    options: ["双板，技术更细腻", "单板，懂的都懂", "无所谓，看心情"],
    kind: "absurd",
    effects: {
      // 双板：默认/技术派
      A: { "404": 2, couple: 2, npc: 2, pizza: 4, pro: 3, rental: 2, safety: 2, speed: 5, tree: 2 },
      // 单板：单板党签名
      B: { bling: 2, cliff: 4, drama: 2, drunk: 2, park: 5, powder: 2, xjbh: 5, yolo: 5, yyds: 5 },
      // 无所谓：随意型
      C: { couple: 2, rip: 4, sit: 2, sofa: 2, stamp: 2 } } },
  {
    id: 16,
    text: "你跟一群朋友去滑雪，到了雪场你？",
    options: ["自己先冲了，回头见", "一起滑几趟，然后各玩各的", "全程不分开，一起滑一起拍照一起吃饭"],
    kind: "diagnostic",
    effects: {
      // 自己先冲：独狼
      A: { "404": 5, cliff: 3, powder: 4, speed: 5, tree: 3, xjbh: 2 },
      // 一起滑几趟然后各玩各的：弹性
      B: { bling: 2, drunk: 2, mri: 1, park: 2, sit: 2, stamp: 3, yyds: 3 },
      // 全程不分开：粘人/社牛
      C: { couple: 5, drama: 4, npc: 2, ootd: 3, rip: 3, sofa: 1, wifi: 5 } } },
  {
    id: 17,
    text: "上山的路上你发现手机只剩 5% 电了，你？",
    options: ["立刻关机省电，留给紧急情况", "算了，反正下午也用不上", "立马拍最后一段 vlog 发出去"],
    kind: "absurd",
    effects: {
      // 关机省电：谨慎/独狼/认真型
      A: { "404": 2, safety: 5, sit: 2 },
      // 反正用不上：随性/摸鱼
      B: { drunk: 3, npc: 2, rental: 2, sofa: 2 },
      // 拍最后 vlog：内容党
      C: { bling: 3, drama: 3, ootd: 4, rip: 4, wifi: 5, xjbh: 2 } } },
  {
    id: 18,
    text: "有人在你面前摔了一个超夸张的跟头，你？",
    options: ["赶紧上去问他没事吧", "先确认他没事，然后忍不住笑", "掏出手机——这段可以发抖音"],
    kind: "absurd",
    effects: {
      // 关心：守规矩/友善
      A: { couple: 3, mri: 3, npc: 3, pizza: 3, safety: 4 },
      // 看戏：中性/独狼
      B: { "404": 2, drunk: 3, sofa: 1, tree: 2, yolo: 2 },
      // 拍抖音：内容党
      C: { bling: 2, drama: 4, ootd: 3, rip: 4, wifi: 5, xjbh: 2 } } },
  {
    id: 19,
    text: "你选雪场最看重？",
    options: ["雪道难度和雪质", "交通方便、设施好", "餐厅好不好吃、酒店舒不舒服"],
    kind: "diagnostic",
    effects: {
      // 雪道+雪质：技术党
      A: { "404": 3, cliff: 3, park: 3, powder: 5, pro: 4, speed: 2, tree: 4, yyds: 3 },
      // 交通设施：实用党
      B: { couple: 3, mri: 2, npc: 3, rental: 4, safety: 3, stamp: 4 },
      // 餐厅酒店：享受党
      C: { bling: 3, drama: 3, drunk: 3, ootd: 4, rip: 2, sit: 3, sofa: 5, wifi: 5 } } },
  {
    id: 20,
    text: "你在雪道上被一个小朋友超了，你？",
    options: ["无所谓，小孩子嘛", "加速追上去然后假装只是顺路", "当场宣布退役"],
    kind: "absurd",
    effects: {
      // 无所谓：佛系
      A: { "404": 2, drunk: 2, npc: 3, sit: 5, sofa: 1, tree: 2 },
      // 加速追：好胜/嘴硬
      B: { bling: 2, cliff: 2, mri: 2, speed: 3, yolo: 3 },
      // 退役：戏精
      C: { drama: 5, pizza: 3, rental: 2, rip: 5, sofa: 2 } } },
  {
    id: 21,
    text: "下午三点，你在？",
    options: ["还在刷道，刷到闭园再说", "休息室喝杯咖啡，准备最后两趟", "已经在山下吃火锅/泡温泉"],
    kind: "diagnostic",
    effects: {
      // 还在刷道：专注派 + PRO 耐力
      A: { "404": 2, cliff: 2, park: 2, powder: 3, pro: 3, speed: 2 },
      // 喝咖啡再两趟：节奏控 + KPI 计划性休息
      B: { bling: 3, couple: 3, kpi: 3, mri: 2, npc: 2, safety: 3, stamp: 3, tree: 2, yyds: 5 },
      // 山下温泉火锅：摸鱼派 + 早起的人累了已经走了
      C: { drunk: 4, early: 6, ootd: 3, rental: 2, sit: 4, sofa: 5 } } },
  {
    id: 22,
    text: "你今年比去年技术上有什么进步？",
    options: ["明显进步，能下更难的道", "原地踏步，还是那样", "今年没怎么滑，没法判断"],
    kind: "diagnostic",
    effects: {
      // 明显进步：努力进步型
      A: { cliff: 3, kpi: 8, park: 4, powder: 2, pro: 4, speed: 2, stamp: 2, tree: 3 },
      // 原地踏步：背景板/新手停滞
      B: { bling: 2, drunk: 2, npc: 5, pizza: 5, rental: 3, sit: 3, sofa: 2 },
      // 今年没怎么滑：休闲型
      C: { mri: 4, ootd: 3, rental: 2, rip: 4, sit: 2, sofa: 2 } } },
  {
    id: 23,
    text: "看到一片小树林，你？",
    options: ["肯定不去，太危险了", "看心情，可能溜一圈", "我的心头好，必去"],
    kind: "absurd",
    effects: {
      // 不去：保守型
      A: { couple: 2, npc: 3, ootd: 2, pizza: 4, rental: 5, safety: 4, sit: 2, sofa: 1 },
      // 看心情：中段
      B: { drunk: 2, mri: 1, park: 4, powder: 2, stamp: 3, yyds: 4 },
      // 必去：树林党签名
      C: { "404": 4, cliff: 2, powder: 3, tree: 5, yolo: 3 } } },
  {
    id: 24,
    text: "雪场有个 park 区（跳台/rails），你？",
    options: ["不进去，那是外星人玩的", "看看就好，偶尔玩玩小的", "我的整个雪季都为了这个"],
    kind: "absurd",
    effects: {
      // 不进去：保守
      A: { npc: 3, pizza: 4, rental: 3, safety: 4, sit: 2, sofa: 2 },
      // 看看就好
      B: { bling: 3, couple: 2, drama: 3, drunk: 2, mri: 2, ootd: 2, powder: 2, stamp: 3, tree: 2, wifi: 5 },
      // 整个雪季为了这个：公园老鼠签名
      C: { cliff: 5, park: 5, xjbh: 4, yyds: 5 } } },
  {
    id: 25,
    text: "你在雪场排队等缆车，前面至少要等 20 分钟，你？",
    options: ["等，这条道值得", "换一条不排队的道", "算了去喝咖啡，等人少了再来"],
    kind: "diagnostic",
    effects: {
      // 等：执着派
      A: { cliff: 3, mri: 2, park: 3, powder: 4, pro: 4, speed: 3, tree: 2, yyds: 2 },
      // 换道：灵活务实
      B: { "404": 3, couple: 2, drunk: 2, mri: 1, npc: 2, stamp: 3, xjbh: 3, yolo: 2 },
      // 喝咖啡再来：摸鱼
      C: { bling: 2, drama: 3, drunk: 3, ootd: 3, rental: 2, rip: 2, sit: 4, sofa: 4 } } },
  {
    id: 26,
    text: "雪场餐厅有热红酒/啤酒，你？",
    options: ["下午要滑，不喝", "尝两口意思一下", "来一壶，下午滑得更飘"],
    kind: "absurd",
    effects: {
      // 不喝：自律
      A: { "404": 2, mri: 2, pizza: 2, safety: 4 },
      // 尝两口：常规
      B: { couple: 3, ootd: 2, stamp: 3, tree: 2, wifi: 5 },
      // 来一壶：醉侠签名
      C: { cliff: 3, drama: 2, drunk: 5, mri: 2, sofa: 2, xjbh: 4, yolo: 4 } } },
  {
    id: 27,
    text: "你滑雪受伤后的朋友圈大概是？",
    options: ["不发，自己默默处理", "发一张冰敷照配文'还活着'", "九宫格 + 三百字小作文：'家人们这辈子滑雪生涯就到这了'"],
    kind: "absurd",
    effects: {
      // 不发：低调型
      A: { "404": 4, npc: 2, powder: 2, safety: 2, sit: 2, tree: 2 },
      // 冰敷照：常规戏剧
      B: { bling: 3, couple: 3, drama: 5, drunk: 1, mri: 4, park: 2, stamp: 2, yolo: 3, yyds: 3 },
      // 九宫格小作文：报丧员签名
      C: { drama: 5, ootd: 4, rip: 5, wifi: 5 } } },
  {
    id: 28,
    text: "你的雪板/头盔上贴了几张贴纸/徽章？",
    options: ["干干净净，原装", "几张，是几个有意义的雪场", "贴满了，每去一个新雪场加一张"],
    kind: "diagnostic",
    effects: {
      // 干干净净：极简主义 + PRO 不需要装饰 + KPI 不浪费
      A: { "404": 3, kpi: 2, npc: 2, pizza: 2, pro: 2, rental: 5, safety: 4, sit: 1, sofa: 1 },
      // 几张：常规
      B: { bling: 2, couple: 3, drunk: 2, mri: 3, park: 3, powder: 2, tree: 2, yyds: 2 },
      // 贴满：打卡党签名
      C: { bling: 2, park: 3, stamp: 5, yyds: 3 } } },
  {
    id: 29,
    text: "你滑雪日里坐在雪地上发呆最长的一次是多久？",
    options: ["没坐过，摔了立刻起来", "几分钟，缓一下", "至少半小时，被救援队问候过"],
    kind: "absurd",
    effects: {
      // 立刻起来：高效 + KPI 不浪费时间
      A: { early: 3, kpi: 4, pizza: 2, safety: 2, speed: 2 },
      // 几分钟：常规
      B: { drama: 3, drunk: 1, mri: 2, npc: 2, rip: 5, sofa: 2 },
      // 至少半小时：坐山雕签名
      C: { "404": 2, drunk: 2, npc: 2, sit: 5, sofa: 3 } } },
  {
    id: 30,
    text: "雪道边立着一个'危险，请勿进入'的牌子，你？",
    options: ["立刻退两步，安全第一", "站在牌子前拍照发朋友圈", "...（已经在牌子后面了）"],
    kind: "absurd",
    effects: {
      // 立刻退两步：守规矩 + 安全党
      A: { "404": 2, npc: 3, pizza: 3, rental: 3, safety: 5, sit: 2, sofa: 1 },
      // 拍照发圈：内容创作 + 装备党 + 戏精
      B: { bling: 3, drama: 3, ootd: 4, rip: 3, stamp: 2, wifi: 5 },
      // 已经在牌子后面：CLIFF 签名 + 莽 + 瞎几把
      C: { "404": 2, cliff: 5, drunk: 2, mri: 4, park: 2, speed: 2, xjbh: 5, yolo: 5 } } },
  {
    id: 31,
    text: "如果你的滑雪板会说话，它最可能说的是？",
    options: ["求你了轻点", '"我们又来这条道了？第 47 次了"', "你根本配不上我"],
    kind: "absurd",
    effects: {
      // 求你了轻点：经常被摔
      A: { cliff: 3, drama: 5, mri: 4, pizza: 4, rental: 2, xjbh: 4, yolo: 4 },
      // 第47次：老手刷道狂
      B: { "404": 3, npc: 3, powder: 3, sofa: 1, stamp: 3, tree: 3 },
      // 配不上我：装备党
      C: { bling: 5, ootd: 4, park: 2, rip: 2, speed: 3, wifi: 5, yyds: 4 } } },
  {
    id: 32,
    text: "你滑雪戴运动手环/记 GPS 数据吗？",
    options: ["戴，每天都看数据", "戴，但不怎么看", "不戴，没必要"],
    kind: "diagnostic",
    effects: {
      // 戴看数据：数据控签名
      A: { bling: 2, kpi: 8, speed: 3, stamp: 3 },
      // 戴但不看
      B: { bling: 2, couple: 2, mri: 2, park: 3, powder: 2, stamp: 2, tree: 2, yyds: 3 },
      // 不戴：随性
      C: { "404": 2, drunk: 2, npc: 2, rental: 2, sit: 3, sofa: 1, xjbh: 4 } } },
];
