import { Token } from "./18.ts";

/*
Shunting-yard algorithm and reverse polish notation (RPN) evaluation
*/

function evalRPN(rpn: Token[]): number {
  const s: Token[] = [];
  while (rpn.length > 0) {
    const t = rpn.shift()!;
    if (t.type === "STAR" || t.type === "PLUS") {
      const a = s.pop()!.value!;
      const b = s.pop()!.value!;
      s.push({
        type: "NUM",
        position: 0,
        value: t.type === "PLUS" ? a + b : a * b,
      });
    } else {
      s.push(t);
    }
  }
  if (s.length !== 1) {
    throw new Error("Got stack length !== 1");
  }
  return s[0].value!;
}

export function evalExpr(tokens: Token[]): number {
  tokens = tokens.slice();

  const output: Token[] = [];
  const operators: Token[] = [];
  while (tokens.length > 0) {
    const t = tokens.shift()!;
    if (t.type === "NUM") {
      output.push(t);
    } else if (t.type === "PLUS" || t.type === "STAR") {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].type !== "P_OPEN" &&
        operators[operators.length - 1].type === "PLUS"
      ) {
        output.push(operators.pop()!);
      }
      operators.push(t);
    } else if (t.type === "P_OPEN") {
      operators.push(t);
    } else if (t.type === "P_CLOSE") {
      while (operators.length > 0 && operators[operators.length - 1].type !== "P_OPEN") {
        output.push(operators.pop()!);
      }
      if (operators.length === 0 || operators[operators.length - 1].type !== "P_OPEN") {
        throw new Error("Mismatched paranthesis");
      }
      operators.pop();
    }
  }

  while (operators.length > 0) {
    output.push(operators.pop()!);
  }

  return evalRPN(output);
}
