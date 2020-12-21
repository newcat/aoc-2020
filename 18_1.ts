import { Token } from "./18.ts";

/*
LALR Recursive descent parser implemented for the grammar described below.
Note that P_OPEN and P_CLOSE are switched during tokenization and all tokens are reversed.
This results in the term being evaluated left-to-right instead of right-to-left.

--- GRAMMAR ---

operation:
  | PLUS expr
  | STAR expr

expr:
  | P_OPEN expr P_CLOSE operation
  | P_OPEN expr P_CLOSE
  | NUM operation
  | NUM
*/

interface EvalResult {
  value: number;
  remainingTokens: Token[];
}

function isOperation(tokens: Token[]): boolean {
  return tokens[0].type === "PLUS" || tokens[0].type === "STAR";
}

function evalOperation(value: number, tokens: Token[]): EvalResult {
  const t = tokens[0];
  const r = evalExpr(tokens.slice(1));
  let opValue;
  if (t.type === "PLUS") {
    opValue = value + r.value;
  } else if (t.type === "STAR") {
    opValue = value * r.value;
  } else {
    throw new Error("Invalid operation: " + t.type);
  }
  return {
    remainingTokens: r.remainingTokens,
    value: opValue,
  };
}

export function evalExpr(tokens: Token[]): EvalResult {
  const t = tokens[0];
  if (t.type === "P_OPEN") {
    const r = evalExpr(tokens.slice(1));
    if (r.remainingTokens.length === 0 || r.remainingTokens[0].type !== "P_CLOSE") {
      throw new Error("Expected P_CLOSE");
    }
    const remainingTokens = r.remainingTokens.slice(1);
    if (remainingTokens.length > 0 && isOperation(remainingTokens)) {
      // P_OPEN expr P_CLOSE operation
      return evalOperation(r.value, remainingTokens);
    } else {
      // P_OPEN expr P_CLOSE
      return {
        remainingTokens,
        value: r.value,
      };
    }
  } else if (t.type === "NUM") {
    if (tokens.length > 1 && isOperation(tokens.slice(1))) {
      // NUM operation
      return evalOperation(t.value!, tokens.slice(1));
    } else {
      // NUM
      return {
        remainingTokens: tokens.slice(1),
        value: t.value!,
      };
    }
  } else {
    throw new Error(`Invalid token ${t.type} at ${t.position}`);
  }
}
