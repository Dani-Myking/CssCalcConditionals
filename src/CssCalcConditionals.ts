
//only for internal use
const PositiveDifferenceToResult = (
  difference: string,
  result: string,
  strictlyPositive: boolean = false): string => {

    const zeroIntervalRoundingFix = `clamp(-1px, round(up, max(${result}, (${result}) * -1), 1px) - 1px, 0px)`;
    const clampedDistance = `clamp(0px, ${difference}, max(${result}, (${result}) * -1))`;
    const valueToRound = `max(0px, ${result} - ${clampedDistance}) + min(0px, ${result} + ${clampedDistance})`;

    return strictlyPositive
      ? `calc(round(to-zero, ${valueToRound}, ${result} + ${zeroIntervalRoundingFix}) * -1 + ${result})`
      : `calc(${result} - ${PositiveDifferenceToResult(`(${difference}) * -1`, result, true)})`;
}

const Abs = (value: string): string => {
  return `max(${value}, (${value}) * -1)`;
}

const NegAbs = (value: string): string => {
  return `min(${value}, (${value}) * -1)`;
}

/**
 * Value above threshold is mapped to the chosen result.
 * Otherwise, value is set to 0.
 * 
 * * * * * * * * * * * * * * * *
 *          t    v  ->  r
 *          - - - - - - - - -
 *          |               
 *          - - - - - - - - -
 * * * * * * * * * * * * * * * *
 * 
 * @param value 
 * @param threshold 
 * @param result 
 * @param strictlyAbove if this is true, only values strictly above the threshold are kept
 * @returns A CSS calc expression as a string
 */
export const ValueAboveThresholdToResult = (
  value: string,
  threshold: string,
  result: string,
  strictlyAbove: boolean = true): string => {
  return PositiveDifferenceToResult(`${value} - (${threshold})`, result, strictlyAbove);
}

/**
 * Value below threshold is mapped to the chosen result.
 * Otherwise, value is set to 0.
 * 
 * * * * * * * * * * * * * * * *
 *        r  <- v    t
 *     - - - - - - - - 
 *                   |           
 *     - - - - - - - -
 * * * * * * * * * * * * * * * *
 * 
 * @param value 
 * @param threshold 
 * @param result 
 * @param striclyBelow if this is true, only values strictly below the threshold are kept
 * @returns A CSS calc expression as a string
 */
export const ValueBelowThresholdToResult = (
  value: string,
  threshold: string,
  result: string,
  striclyBelow: boolean = true): string => {
  return PositiveDifferenceToResult(`${threshold} - (${value})`, result, striclyBelow);
}

/**
 * Value above threshold is retained.
 * Otherwise, value is set to 0.
 * 
 * @param value 
 * @param threshold 
 * @param strictlyAbove if this is true, only values strictly above the threshold are kept
 * @returns A CSS calc expression as a string
 */
export const ValueAboveThreshold = (
  value: string,
  threshold: string,
  strictlyAbove: boolean = true): string => {
  return ValueAboveThresholdToResult(value, threshold, value, strictlyAbove);
}

/**
 *  Value below threshold is retained.
 *  Otherwise, value is set to 0.
 * 
 * @param value 
 * @param threshold 
 * @param strictlyBelow if this is true, only values strictly below the threshold are kept
 * @returns A CSS calc expression as a string
 */
export const ValueBelowThreshold = (
  value: string,
  threshold: string,
  strictlyBelow: boolean = true): string => {
  return ValueBelowThresholdToResult(value, threshold, value, strictlyBelow);
}

/**
 * Value below threshold is mapped to result 1.
 * Otherwise, threshold is mapped to result 2.
 * 
 * * * * * * * * * * * * * * * *
 *       r1  <- v      v -> r2
 *     - - - - - - - - - - - -
 *                 t           
 *     - - - - - - - - - - - -
 * * * * * * * * * * * * * * * *
 * 
 * @param value 
 * @param threshold 
 * @param result1 
 * @param result2 
 * @param strictlyBelow if this is true, only values strictly below the threshold will transform to result1; result2 otherwise
 * @returns A CSS calc expression as a string
 */
export const ValueBelowThresholdToResult1ElseResult2 = (
  value: string,
  threshold: string,
  result1: string,
  result2: string,
  strictlyBelow: boolean = true): string => {
  return `calc(${ValueBelowThresholdToResult(value, threshold, result1, strictlyBelow)} + ${ValueAboveThresholdToResult(value, threshold, result2, !strictlyBelow)})`;
}

/**
 * Value within threshold is mapped to the chosen result.
 * Otherwise, value is set to 0.
 * 
 * * * * * * * * * * * * * * * *
 *            v ->   r
 *      - - - - - - - - - - - 
 *      t                   t 
 *      - - - - - - - - - - -
 * * * * * * * * * * * * * * * *
 * 
 * @param value 
 * @param threshold1 
 * @param threshold2 
 * @param result 
 * @param strictlyBetween if this is true, value must be strictly within threshold range
 * @returns A CSS calc expression as a string
 */
export const ValueInsideRangeToResult = (
  value: string,
  threshold1: string,
  threshold2: string,
  result: string,
  strictlyBetween: boolean | [above: boolean, below: boolean] = true): string => {

  const strictlyAbove = typeof(strictlyBetween) === "boolean" ? strictlyBetween : strictlyBetween[0];
  const strictlyBelow = typeof(strictlyBetween) === "boolean" ? strictlyBetween : strictlyBetween[1];
  
  return `calc(${ValueAboveThresholdToResult(value, `min(${threshold1}, ${threshold2})`, result, strictlyAbove)} - ${ValueAboveThresholdToResult(value, `max(${threshold1}, ${threshold2})`, result, !strictlyBelow)})`;
}

/**
 * Value outside threshold is mapped to the chosen result.
 * Otherwise, value is set to 0.
 * 
 * * * * * * * * * * * * * * * * 
 *               r   <-  v  
 *     - - -         - - - - - -
 *         t         t  
 *     - - -         - - - - - -
 * * * * * * * * * * * * * * * *
 * 
 * @param value 
 * @param threshold1 
 * @param threshold2 
 * @param result 
 * @param strictlyOutside if this is true, value must be strictly outside threshold range
 * @returns A CSS calc expression as a string
 */
export const ValueOutsideRangeToResult = (
  value: string,
  threshold1: string,
  threshold2: string,
  result: string,
  strictlyOutside: boolean | [below: boolean, above: boolean] = true): string => {

  const strictlyBelow = typeof(strictlyOutside) === "boolean" ? strictlyOutside : strictlyOutside[0];
  const strictlyAbove = typeof(strictlyOutside) === "boolean" ? strictlyOutside : strictlyOutside[1];

  return `clamp(${NegAbs(result)}, ${ValueBelowThresholdToResult(value, `min(${threshold1}, ${threshold2})`, result, strictlyBelow)} + ${ValueAboveThresholdToResult(value, `max(${threshold1}, ${threshold2})`, result, strictlyAbove)}, ${Abs(result)})`;
}

/**
 * Value within threshold is retained.
 * Otherwise, value is set to 0.
 * 
 * @param value
 * @param threshold1 
 * @param threshold2 
 * @param strictlyBetween if this is true, value must be strictly within threshold range
 * @returns A CSS calc expression as a string
 */
export const ValueInsideRange = (
  value: string,
  threshold1: string,
  threshold2: string,
  strictlyBetween: boolean | [below: boolean, above: boolean] = true): string => {
  return ValueInsideRangeToResult(value, threshold1, threshold2, value, strictlyBetween);
}

/**
 * Value outside threshold is retained.
 * Otherwise, value is set to 0.
 * 
 * @param value 
 * @param lowerThreshold 
 * @param upperThreshold 
 * @param removeLowerBorder if this is true, value must be strictly outside threshold range
 * @returns A CSS calc expression as a string
 */
export const ValueOutsideRange = (
  value: string,
  threshold1: string,
  threshold2: string,
  strictlyOutside: boolean | [below: boolean, above: boolean] = true): string => {
  return ValueOutsideRangeToResult(value, threshold1, threshold2, value, strictlyOutside);
}

/**
 * Value inside threshold range is mapped to result 1.
 * Otherwise, value is mapped to result 2.
 * 
 * * * * * * * * * * * * * * * * * *
 *       r2 <- v     v -> r1
 *     - - - - - - - - - - - - - -
 *                t          t           
 *     - - - - - - - - - - - - - -
 * * * * * * * * * * * * * * * * * *
 * 
 * @param value 
 * @param threshold1
 * @param threshold2
 * @param result1 
 * @param result2 
 * @param strictlyInside if this is true, only values strictly between the treshold range will be mapped to result1; else result2 
 * @returns A CSS calc expression as a string
 */
export const ValueInsideThresholdRangeToResult1ElseResult2 = (
  value: string,
  threshold1: string,
  threshold2: string,
  result1: string,
  result2: string,
  strictlyInside: boolean | [above: boolean, below: boolean] = true): string => {
  
  const strictlyAbove = typeof(strictlyInside) === "boolean" ? strictlyInside : strictlyInside[0];
  const strictlyBelow = typeof(strictlyInside) === "boolean" ? strictlyInside : strictlyInside[1];

  return `calc(${ValueInsideRangeToResult(value, threshold1, threshold2, result1, strictlyInside)} + ${ValueOutsideRangeToResult(value, threshold1, threshold2, result2, [!strictlyAbove, !strictlyBelow])})`;
}

type CssCOperator = 'less' | 'more' | 'lessEquals' | 'moreEquals';
type CssCConditionOperator = 'or' | 'and';
type CssCCondition = [string, CssCOperator, string];
type CssCalcCConditionDeep = [CssCalcCConditionDeep | CssCCondition, CssCConditionOperator, CssCalcCConditionDeep | CssCCondition];

function SwitchOrAnd(value: CssCConditionOperator): CssCConditionOperator {

  switch(value) {
    case 'or':
      return 'and';
    case 'and':
      return 'or';
  }
}

function ReverseCssCalcCConditionBase(value: CssCCondition): CssCCondition {

  switch(value[1]) {
    case 'less':
      return [value[0], 'moreEquals', value[2]];
    case 'more':
      return [value[0], 'lessEquals', value[2]];
    case 'lessEquals':
      return [value[0], 'more', value[2]];
    case 'moreEquals':
      return [value[0], 'less', value[2]];
  }

}

function ReverseCssCalcCConditionRecursive(value: CssCalcCConditionDeep): CssCalcCConditionDeep;
function ReverseCssCalcCConditionRecursive(value: CssCCondition): CssCCondition;
function ReverseCssCalcCConditionRecursive(value: CssCalcCConditionDeep | CssCCondition): CssCalcCConditionDeep | CssCCondition

function ReverseCssCalcCConditionRecursive(value: CssCalcCConditionDeep | CssCCondition): CssCalcCConditionDeep | CssCCondition {

  if(typeof(value[0]) === 'string') {
    return ReverseCssCalcCConditionBase(value as CssCCondition);
  }

  let reverse1: CssCalcCConditionDeep | CssCCondition;
  let reverseOperator: CssCConditionOperator;
  let reverse2: CssCalcCConditionDeep | CssCCondition;

  if(typeof(value[0][0]) === 'string') {
    reverse1 = ReverseCssCalcCConditionBase(value[0] as CssCCondition);
  }else{
    reverse1 = ReverseCssCalcCConditionRecursive(value[0] as CssCalcCConditionDeep);
  }

  reverseOperator = SwitchOrAnd(value[1] as CssCConditionOperator);

  if(typeof(value[2][0]) === 'string') {
    reverse2 = ReverseCssCalcCConditionBase(value[2] as CssCCondition);
  }else{
    reverse2 = ReverseCssCalcCConditionRecursive(value[2] as CssCalcCConditionDeep);
  }

  return [reverse1, reverseOperator, reverse2];
}

/**
 * A conditional stub. Only meant to be used as part of a full expression.
 * 
 * @param value 
 * @returns A CSS calc expression as a string
 */
export function CssCalcCExpression(
  value: CssCalcCConditionDeep): CssCalcCConditionDeep;

 /**
 * A full expression.
 * If true, value will change into result.
 * If not true, value change into 0 or resultElse if specified.
 * 
 * @param value 
 * @param result 
 * @param resultElse 
 * @returns A CSS calc expression as a string
 */
export function CssCalcCExpression(
  value: CssCalcCConditionDeep,
  result: string,
  resultElse?: string | undefined): string;

/**
 * A simple expression.
 * If true, value will be retained, or changed into result if specified.
 * 
 * @param value 
 * @param result 
 * @returns A CSS calc expression as a string
 */
export function CssCalcCExpression(
  value: CssCCondition,
  result?: string): string;

/**
 * A simple expression.
 * If true, value will change into result.
 * If not true, value will change into resultElse.
 * 
 * @param value 
 * @param result 
 * @returns A CSS calc expression as a string
 */
export function CssCalcCExpression(
  value: CssCCondition,
  result: string,
  resultElse: string): string;

  //implementation
export function CssCalcCExpression(
  value: CssCalcCConditionDeep | CssCCondition,
  result?: string | undefined,
  resultElse?: string | undefined): string | CssCalcCConditionDeep {

  const value1 = value[0];
  const operator = value[1];
  const value2 = value[2];

  //stub return value
  if(typeof(value1) !== 'string' &&
     typeof(value1[0]) !== 'string' &&
     typeof(value2) !== 'string' &&
     typeof(value2[0]) !== 'string' && 
     (operator === 'and' || operator === 'or')
     && result === undefined) {

    return [value1 as CssCCondition, operator, value2 as CssCCondition];
  }
  
  //both recursive values
  if(typeof(value1) !== 'string' &&
     typeof(value2) !== 'string') {

    let result_ = result!;

    if(resultElse !== undefined) {
      //condition is done to narrow types, error should never occour
      if(operator === 'or' || operator === 'and') {
          return `calc(${CssCalcCExpression(value, result_)} + ${CssCalcCExpression(ReverseCssCalcCConditionRecursive(value), resultElse)})`;
      }

      throw Error("CssCalcConditional Error");
    }

    let value1Simple: CssCCondition = value1 as CssCCondition;
    let value2Simple: CssCCondition = value2 as CssCCondition;
    let value1Deep: CssCalcCConditionDeep = value1 as CssCalcCConditionDeep;
    let value2Deep: CssCalcCConditionDeep = value2 as CssCalcCConditionDeep;
    const value1IsSimple: boolean = typeof(value1[0]) === 'string';
    const value2IsSimple: boolean = typeof(value2[0]) === 'string';

    let expression1: string;
    let expression2: string;

    if(value1IsSimple) {
      expression1 = CssCalcCExpression(value1Simple, result_);
    }
    else{
      expression1 = CssCalcCExpression(value1Deep, result_);
    }

    if(value2IsSimple) {
      expression2 = CssCalcCExpression(value2Simple, result_);
    }
    else{
      expression2 = CssCalcCExpression(value2Deep, result_);
    }

    const zeroIntervalRoundingFix = `clamp(-1px, round(up, max(${result_}, (${result_}) * -1), 1px) - 1px, 0px)`;

    switch(operator) {
      case 'or':
        return `clamp(${NegAbs(result_)}, ${expression1} + ${expression2}, ${Abs(result_)})`;
      case 'and':
        return `clamp(${NegAbs(result_)}, round(to-zero, ${expression1} + ${expression2}, (${result_} * 2) + ${zeroIntervalRoundingFix}), ${Abs(result_)})`;
    }

  }

  //both base values
  let result_: string = result !== undefined ? result : value1 as string;
  let value1_: string = value1 as string;
  let value2_: string = value2 as string;

  if(resultElse !== undefined) {

    switch(operator) {
      case 'less':
        return ValueBelowThresholdToResult1ElseResult2(value1_, value2_, result_, resultElse, true);
      case 'more':
        return ValueBelowThresholdToResult1ElseResult2(value2_, value1_, result_, resultElse, false);
      case 'lessEquals':
        return ValueBelowThresholdToResult1ElseResult2(value1_, value2_, result_, resultElse, false);
      case 'moreEquals':
        return ValueBelowThresholdToResult1ElseResult2(value2_, value1_, result_, resultElse, true);
    }
  }

  switch(operator) {
    case 'less':
      return ValueBelowThresholdToResult(value1_, value2_, result_, true);
    case 'more':
      return ValueAboveThresholdToResult(value1_, value2_, result_, true);
    case 'lessEquals':
      return ValueBelowThresholdToResult(value1_, value2_, result_, false);
    case 'moreEquals':
      return ValueAboveThresholdToResult(value1_, value2_, result_, false);
  }

  throw Error("CssCalcConditional Error");
}