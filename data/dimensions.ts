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
