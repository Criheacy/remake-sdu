import {NodeType, StoryType, VariableNameType} from "./story";

export interface MemorizedNodeType extends NodeType {
  appearanceTimesLeft: number;
}

export interface MemorizedStoryType extends StoryType {
  nodes: MemorizedNodeType[];
}

export interface MemorizedVariableType {
  name: VariableNameType;
  value: number;
}