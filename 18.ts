import readInput from "./input.ts";
import { evalExpr as evalExprPart1 } from "./18_1.ts";
import { evalExpr as evalExprPart2 } from "./18_2.ts";
const input = await readInput("18.txt");

export interface Token {
  type: "NUM" | "PLUS" | "STAR" | "P_OPEN" | "P_CLOSE";
  position: number;
  value?: number;
}

function tokenize(input: string, reverse: boolean): Token[] {
  const tokens: Token[] = [];
  let currentToken = "";
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === " ") {
      continue;
    }
    switch (c) {
      case "(":
        tokens.push({ type: reverse ? "P_CLOSE" : "P_OPEN", position: i });
        break;
      case ")":
        tokens.push({ type: reverse ? "P_OPEN" : "P_CLOSE", position: i });
        break;
      case "+":
        tokens.push({ type: "PLUS", position: i });
        break;
      case "*":
        tokens.push({ type: "STAR", position: i });
        break;
      default:
        currentToken += c;
        if (i === input.length - 1 || !/\d/.test(input[i + 1])) {
          tokens.push({ type: "NUM", position: i, value: parseInt(currentToken) });
          currentToken = "";
        }
    }
  }
  if (reverse) {
    tokens.reverse();
  }
  return tokens;
}

function part1() {
  return input.map((l) => evalExprPart1(tokenize(l, true)).value).reduce((p, c) => p + c, 0);
}

function part2() {
  return input.map((l) => evalExprPart2(tokenize(l, false))).reduce((p, c) => p + c, 0);
}

console.log("Part 1", part1());
console.log("Part 2", part2());
