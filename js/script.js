const Operator = {
   ADD: "+",
   SUBTRACT: "-",
   MULTIPLY: "*",
   DIVIDE: "/"
};
Object.freeze(Operator);

function add(num1, num2){
  return num1 + num2;
}
function subtract(num1, num2){
  return num1 - num2;
}
function multiply(num1, num2){
  return num1 * num2;
}
function divide(num1, num2){
  if(num2 === 0)
    throw "divideBy0";
  return num1 / num2;
}
function operate(operator, num1, num2){
  switch(operator){
    case Operator.ADD:
      return add(num1, num2);
      break;
    case Operator.SUBTRACT:
      return subtract(num1, num2);
      break;
    case Operator.MULTIPLY:
      return multiply(num1, num2);
      break;
    case Operator.DIVIDE:
      return divide(num1, num2);
      break;
    default:
      throw "The operator is not valid";
  }
}

const buttons = document.querySelectorAll("button");
const text = document.querySelector("#display");
let expression = ""
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
    switch(buttons[i].id){
      case("equals"):
        if(!isValidExpression())
          window.alert("Invalid Expression. Cannot evaluate.");
        else
          evaluateExpression();
        break;
      case("C"):
        clear();
        break;
      case("<"):
        backSpace();
        break;
      case("blank"):
        break;
      default:
        expression += buttons[i].id;
        if(!isRunningExpressionValid()){
          window.alert("Invalid Expression");
          backSpace();
        }
    }
    text.textContent = expression;
  });
}

function isRunningExpressionValid(){
  if(expression.length === 0)
    return true;
  if(expression.length === 1){
    if(isOperator(expression))
      return false;
    else
      return true;
  }
  //If there are two operators in a row, it is Invalid
  let lastChar = expression[expression.length-1];
  let secondToLastChar = expression[expression.length-2];
  if(isOperator(lastChar)){
    if(isOperator(secondToLastChar) || secondToLastChar === ".")
      return false;
    else
      return true;
  }
  if(lastChar === "."){
    let index = expression.length-2;
    while(index >= 0){
      if(isOperator(expression[index])){
        return true;
      }
      if(expression[index] === ".")
        return false;
      index--;
    }
  }
  return true;
}

function isValidExpression(){
  if(!isRunningExpressionValid())
    return false;
  let lastChar = expression[expression.length-1];
  if(isOperator(lastChar) || lastChar === ".")
    return false;
  return true;
}

function evaluateExpression(){
  while(expression.includes("*") || expression.includes("/")){
    let opIndex = getFirstIndexOfOperator("*", "/");
    let leftIndex = getStartingIndexLeft(opIndex);
    let rightIndex = getEndingIndexRight(opIndex);
    let leftNum = Number(expression.substring(leftIndex, opIndex));
    let rightNum = Number(expression.substring(opIndex+1, rightIndex+1));
    let result;
    try{
      result = operate(expression[opIndex],leftNum, rightNum);
      result = Math.round(result * 1e5) / 1e5;
      expression = expression.substring(0, leftIndex) + result + expression.substring(rightIndex+1, expression.length);
    } catch(divideBy0){
      window.alert("Invalid Expression! Can not divide by 0!");
      clear();
    }
  }
  while(expression.includes("+") || expression.includes("-")){
    let opIndex = getFirstIndexOfOperator("+", "-");
    let leftIndex = getStartingIndexLeft(opIndex);
    let rightIndex = getEndingIndexRight(opIndex);
    let leftNum = Number(expression.substring(leftIndex, opIndex));
    let rightNum = Number(expression.substring(opIndex+1, rightIndex+1));
    let result = operate(expression[opIndex],leftNum, rightNum);
    expression = expression.substring(0, leftIndex) + result + expression.substring(rightIndex+1, expression.length);
  }
}

function getFirstIndexOfOperator(op1, op2){
  let op1Index = expression.indexOf(op1);
  let op2Index = expression.indexOf(op2);
  let opIndex;
  if(op1Index < 0){
    opIndex = op2Index;
  }else if(op2Index < 0){
    opIndex = op1Index;
  }else{
    opIndex = op1Index < op2Index ? op1Index : op2Index;
  }
  return opIndex;
}

function getStartingIndexLeft(opIndex){
  let leftIndex = opIndex - 1;
  while(leftIndex >= 0 && !isOperator(expression[leftIndex])){
    leftIndex--;
  }
  return leftIndex + 1;
}

function getEndingIndexRight(opIndex){
  let rightIndex = opIndex + 1;
  while(inBounds(rightIndex) && !isOperator(expression[rightIndex])){
    rightIndex++;
  }
  return rightIndex - 1;
}

function inBounds(index){
  return index >= 0 && index < expression.length;
}

function isOperator(exp){
  if(exp === "+" || exp === "-" || exp === "*" || exp === "/")
    return true;
  else {
    return false;
  }
}

function backSpace(){
  expression = expression.substring(0, expression.length - 1);
}

function clear(){
  expression = "";
}
