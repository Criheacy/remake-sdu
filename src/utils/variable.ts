import {useDispatch, useSelector} from "react-redux";
import {assignVariable, selectVariable, setVariables} from "../store/variable.slice";
import {useCallback, useEffect, useMemo} from "react";
import {AssignmentExpression, BooleanConnector, BooleanExpression, PrerequisitesType} from "../@types/story";
import {isBooleanExpression} from "../@types/story.guard";
import {MemorizedVariableType} from "../@types/memorized";
import {selectStory} from "../store/story.slice";

const useVariable = () => {
  const dispatch = useDispatch();
  const story = useSelector(selectStory);
  const variable = useSelector(selectVariable);

  // initialize variables after story loaded or reloaded
  useEffect(() => {
    dispatch(setVariables(story.story.variables));
  }, [dispatch, story.story.variables]);
  
  const variables = useMemo(() => variable.variables, [variable.variables]);
  
  const assign = useCallback((assignment: AssignmentExpression) => {
    dispatch(assignVariable(assignment));
  }, [dispatch]);

  const predicate = useCallback((predicate: PrerequisitesType) => {
    return inlinePredicate(predicate, variables);
  }, [variables]);

  return [variables, { assign, predicate }] as const;
}

const inlinePredicate: (predicate: BooleanConnector | BooleanExpression, variables: MemorizedVariableType[]) => boolean = (predicate, variables) => {
  // boolean expression
  if (isBooleanExpression(predicate)) {
    if (predicate === true || predicate === false)
      return predicate;
    const [expression1, operator, expression2] = predicate;

    // convert expressions to values
    const [value1, value2] = [expression1, expression2].map(expression => {
      let expressionValue: number | undefined;
      const variableInExpression = variables.find(variable => variable.name === expression);
      if (variableInExpression) {
        expressionValue = variableInExpression.value;
      } else if (!isNaN(+expression)) {
        expressionValue = +expression;
      } else {
        console.warn(`${expression} is not a valid value to assign`);
        return undefined;
      }
      return expressionValue;
    });
    if (value1 === undefined || value2 === undefined)
      return false;

    // implement operators
    if (operator === "==") {
      return value1 === value2;
    } else if (operator === "<=") {
      return value1 <= value2;
    } else if (operator === "<") {
      return value1 < value2;
    } else if (operator === ">=") {
      return value1 >= value2;
    } else if (operator === ">") {
      return value1 > value2;
    } else if (operator === "!=") {
      return value1 !== value2;
    } else return false;
  }

  // boolean connector
  if (predicate.length === 2) {
    // `NOT` statement
    const [operator, expression] = predicate;
    if (operator === "NOT")
      return !inlinePredicate(expression, variables);

  } else if (predicate.length === 3) {
    // `AND` or `OR` statement
    const [expression1, operator, expression2] = predicate;
    if (operator === "AND") {
      return inlinePredicate(expression1, variables) && inlinePredicate(expression2, variables);
    } else if (operator === "OR") {
      return inlinePredicate(expression1, variables) || inlinePredicate(expression2, variables);
    }
  }

  // default (throw an error)
  return false;
};

export default useVariable;