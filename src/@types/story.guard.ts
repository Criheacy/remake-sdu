import { BooleanConnector, BooleanExpression, COMPARISON_OPERATOR, VariableNameType } from "./story.d";

export const isVariable = (obj: any): obj is VariableNameType => {
  return typeof obj === "string" && obj[0] === "$";
}

export const isBooleanConnector = (obj: any): obj is BooleanConnector => {
  if (!Array.isArray(obj)) return false;
  if (obj.length === 2) {
    return obj[0] === "NOT" && (isBooleanConnector(obj[1]) || isBooleanExpression(obj[1]));
  }
  if (obj.length === 3) {
    return (obj[1] === "AND" || obj[1] === "OR")
      && (isBooleanConnector(obj[0]) || isBooleanExpression(obj[0]))
      && (isBooleanConnector(obj[2]) || isBooleanExpression(obj[2]));
  }
  return false;
};

export const isBooleanExpression = (obj: any): obj is BooleanExpression => {
  if (obj === true || obj === false) return true;
  if (!Array.isArray(obj)) return false;
  if (obj.length === 3) {
    return COMPARISON_OPERATOR.includes(obj[1])
      && (typeof obj[0] === "number" || isVariable(obj[0]))
      && (typeof obj[2] === "number" || isVariable(obj[2]));
  }
  return false;
}
