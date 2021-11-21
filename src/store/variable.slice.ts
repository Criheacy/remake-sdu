import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {RootState} from "./index";
import {AssignmentExpression, VariableType} from "../@types/story";
import {MemorizedVariableType} from "../@types/memorized";

export const variableSlice = createSlice({
  name: 'variable',
  initialState: { variables: [] as MemorizedVariableType[] },
  reducers: {
    // calls at initialize or reload
    setVariables: (state, action: PayloadAction<VariableType[]>) => {
      state.variables = action.payload.map(variable => ({
        name: variable.name,
        value: variable.initialValue
      }));
    },
    assignVariable: (state, action: PayloadAction<AssignmentExpression>) => {
      const [variableName, operator, valueExpression] = action.payload;
      const variableToAssign = state.variables.find(variable => variable.name === variableName);
      if (variableToAssign) {
        // convert expressions to exact values
        let expressionValue: number | undefined;
        const variableInExpression = state.variables.find(variable => variable.name === valueExpression);
        if (variableInExpression) {
          expressionValue = variableInExpression.value;
        } else if (!isNaN(+valueExpression)) {
          expressionValue = +valueExpression;
        } else {
          console.warn(`${valueExpression} is not a valid value to assign`);
          return;
        }

        // implement operators
        if (operator === "=") {
          variableToAssign.value = expressionValue;
        } else if (operator === "+=") {
          variableToAssign.value += expressionValue;
        } else if (operator === "*=") {
          variableToAssign.value *= expressionValue;
        } else {
          console.warn(`${operator} is a invalid operator`);
        }
      } else {
        console.warn(`${variableName} not found in variable list.`)
      }
    }
  },
})

export const {
  setVariables, assignVariable
} = variableSlice.actions

export const selectVariable = (state: RootState) => state.variable

export default variableSlice.reducer;