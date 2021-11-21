// v1.0

export type StoryType = {
  version: string;  // 故事线属性的版本
  author?: string | string[];  // 故事线作者
  lastEdit?: string; // 最后一次更改时间
  nodes: EditorNodeType[];  // 故事事件节点列表
  variables: EditorVariableType[];  // 所用到的变量表
}

export type EditorVariableType = VariableType & Partial<AuxiliaryVariableType>;

export type VariableType = {
  name: VariableNameType;
  initialValue: number;
}

export type AuxiliaryVariableType = {  // 编辑器中编辑故事线时使用的属性，不会对游戏中产生影响
  color: string;  // 节点背景
  comment: string;  // 注释
}

export type EditorNodeType = NodeType & Partial<AuxiliaryNodeType>;

export type AuxiliaryNodeType = {  // 编辑器中编辑故事线时使用的属性，不会对游戏中产生影响
  title: string;  // 节点标题
  color: string;  // 节点背景
  tags: string[]; // 节点的标签，方便编辑
  position: {
    x?: number,
    y?: number,
    w?: number,
    h?: number
  }
}

export type NodeType = {
  id: number; // 节点的全局唯一编号，用于索引特定节点
  earliestTime: number;  // 节点出现的最早时间
  latestTime: number;  // 节点出现的最晚时间
  maxAppearanceTimes: number | false; // 节点最多重复出现的次数，false为不限次数
  weight: number; // 节点的权重，越大越有可能出现
  prerequisites: PrerequisitesType; // 节点出现的先决条件
  text: string; // 节点的说明文本
  effects: EffectType[];  // 节点产生的影响（出现节点后总会触发）
  selections: SelectionType[];  //节点的选项
  directTo?: number; // 直接跳转到该编号的节点
  connectTo?: number;  // 连接到某一编号的节点
}

export type SelectionType = {
  prerequisites: PrerequisitesType; // 选项出现的先决条件
  text: string;    // 选项文本
  effects: EffectType[];  // 选项产生的影响
  directTo?: number; // 直接跳转到该编号的节点
  connectTo?: number;  // 连接到某一编号的节点
}

export type EffectType = {
  assignment: AssignmentExpression, // 赋值表达式
  possibility: number;  // 产生这次赋值的可能性
  directTo?: number; // 直接跳转到该编号的节点
  connectTo?: number;  // 连接到某一编号的节点
}

export type AssignmentExpression = [
  VariableNameType, AssignmentOperator, VariableNameType | string | number
]

// not implemented
export type StoryTextType = (VariableNameType | string) | (VariableNameType | string)[];

export type PrerequisitesType = BooleanConnector | BooleanExpression;

export type BooleanConnector = [
    BooleanExpression | BooleanConnector, "AND" | "OR", BooleanExpression | BooleanConnector
] | [
  "NOT", BooleanExpression | BooleanConnector
];

export type BooleanExpression = [
    VariableNameType | number, ComparisonOperator, VariableNameType | number
] | boolean;

export const COMPARISON_OPERATOR = ["<", "<=", ">", ">=", "==", "!="] as const;
export const ASSIGNMENT_OPERATOR = ["=", "+=", "*="] as const;

export type ComparisonOperator = (typeof COMPARISON_OPERATOR)[number];
export type AssignmentOperator = (typeof ASSIGNMENT_OPERATOR)[number];

export type VariableNameType = `$${string}`;