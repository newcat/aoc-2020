import readInput from "./input.ts";
const input = await readInput("19.txt", false);

type Rule = (number[] | string)[];

const rules: Map<number, Rule> = new Map();
let inputs: string[] = [];

function parseRule(s: string) {
  const r = /^(\d+): (.*)$/.exec(s)!;
  const subRules = r[2].split("|").map((x) => {
    x = x.trim();
    if (/^"\w+"$/.test(x)) {
      // string rule
      return x.substring(1, x.length - 1);
    } else {
      // number reference(s)
      return x.split(" ").map((n) => parseInt(n));
    }
  });
  rules.set(parseInt(r[1]), subRules);
}

function parseInputs() {
  let i = 0;
  while (!!input[i]) {
    parseRule(input[i]);
    i++;
  }
  i += 1;
  inputs = input.slice(i);
}

parseInputs();

function fulfillsNumericSubRule(subRule: number[], s: string): false | string {
  for (const ruleIndex of subRule) {
    const r = execRule(ruleIndex, s);
    if (r === false) {
      return false;
    }
    s = r;
  }
  return s;
}

function execRule(ruleIndex: number, s: string): false | string {
  const rule = rules.get(ruleIndex)!;
  console.log(ruleIndex, rule, s);
  for (const subRule of rule) {
    if (typeof subRule === "string") {
      if (s.startsWith(subRule)) {
        return s.substring(subRule.length);
      }
    } else {
      const r = fulfillsNumericSubRule(subRule, s);
      if (typeof r === "string") {
        return r;
      }
    }
  }
  return false;
}

function matchesRule(ruleIndex: number, s: string): boolean {
  return execRule(ruleIndex, s) === "";
}

function part1() {
  const r = rules.get(0)!;
  return inputs.filter((s) => matchesRule(0, s)).length;
}

function part2() {
  parseRule("8: 42 | 42 8");
  parseRule("11: 42 31 | 42 11 31");
  inputs.forEach((s) => {
    console.log(matchesRule(0, s), s);
    Deno.exit(0);
  });
  return inputs.filter((s) => matchesRule(0, s)).length;
}

// console.log("Part 1", part1());
console.log("Part 2", part2());
