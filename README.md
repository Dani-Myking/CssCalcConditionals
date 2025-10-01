# CssCalcConditionals

Provides some typescript helper functions to emulate if/else/lessThan/moreThan statements inside calc() expressions in CSS.\
Internally uses a combination of calc(), min(), max(), clamp() and round().

 ## Installation
 ```
 npm install css-calc-conditionals
 ```

 ## Disclaimer
 Using these functions may generate long strings, especially if you put the result of one of them inside the "result" or "resultElse" parameter of another.

 ## Examples
  
 Using <code>ValueAboveThreshold('50%', '120px')</code> as width will set the width to 50%, if 50% is more than 120px.\
 Using <code>ValueBelowThresholdToResult('50%', '100px', '25%')</code> as width will set the width to 25%, if 50% is less than 100px.\
 Using <code>ValueInsideRangeToResult('25%', '100px', '150px', '250px')</code> as width will set the width to 250px, if 25% is between 100px and 150px.

 The examples above will get a width of 0 if the condition is not met.

 <code>ValueBelowThresholdToResult1ElseResult2('25%', '300px', '40%', '65%')</code> will set the width to if 40%, if 25% is less than 300px. Otherwise, 65%.

 <code>ValueInsideThresholdRangeToResult1ElseResult2('25%', '100px', '150px', '12.5%', '350px', [false, true])</code> will set the width to 12.5%, if 25% is more than or equal to 100px and less than 150px. Otherwise, 350px. 

 <code>CssCalcCExpression(['200px', 'less', '50%'])</code> if (200px < 50%) then 200px\
 <code>CssCalcCExpression(['200px', 'less', '50%'], '95%')</code> if (200px < 50%) then 95%\
 <code>CssCalcCExpression(['200px', 'less', '50%'], '95%', '20.5px')</code> if (200px < 50%) then 95%, else 20.5px\
 <code>CssCalcCExpression([['50%', 'less', '200px'], 'or', ['50%', 'more', '300px']], '50%')</code> if (50% < 200px) or (50% > 300px) then 50%\
 <code>CssCalcCExpression([[['50%', 'more', '200px'], 'and', ['50%', 'less', '300px']], 'or', ['50%', 'moreEquals', '400px']], '50%')</code> if ((50% > 200px) and (50% < 300px)) or (50% >= 400px) then 50%\
<code>CssCalcCExpression(['50%', 'more', '100px'], CssCalcCExpression(['50%', 'more', '200px'], '10%', '75%'), '99%')</code> if 50% > 100px then (if (50% > 200px) then 10% else 75%) else 99%