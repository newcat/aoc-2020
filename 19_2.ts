import readInput from "./input.ts";
const input = await readInput("rules.txt");

type SubRule = (number | string)[];
type Rule = SubRule[];

const rawRules = new Map<number, Rule>();
const simplifiedRules = new Map<number, Rule>();

function parseRule(s: string) {
  const r = /^(\d+): (.*)$/.exec(s)!;
  const subRules = r[2].split("|").map((x) => {
    x = x.trim();
    if (/^"\w+"$/.test(x)) {
      // string rule
      return x.substring(1, x.length - 1).split("");
    } else {
      // number reference(s)
      return x.split(" ").map((n) => parseInt(n));
    }
  });
  rawRules.set(parseInt(r[1]), subRules);
}

function simplify(id: number): Rule {
  if (simplifiedRules.has(id)) {
    return simplifiedRules.get(id)!;
  }

  const rule = rawRules.get(id)!;
  let simplified: Rule = [];
  for (const subRule of rule) {
    if (subRule.every((x) => typeof x === "string")) {
      simplified.push(subRule);
    } else {
      let simpleSubRules: Rule = [];
      subRule.forEach((x) => {
        if (typeof x === "string") {
          if (simpleSubRules.length === 0) {
            simpleSubRules.push([x]);
          } else {
            simpleSubRules.forEach((s) => s.push(x));
          }
        } else {
          const simplifiedRule = simplify(x);
          if (simpleSubRules.length === 0) {
            simpleSubRules = simplifiedRule;
          } else {
            const newSimpleSubRules: Rule = [];
            simplifiedRule.forEach((s) => {
              simpleSubRules.forEach((t) => {
                newSimpleSubRules.push(t.concat(s));
              });
            });
            simpleSubRules = newSimpleSubRules;
          }
        }
      });
      simplified = simplified.concat(simpleSubRules);
    }
  }

  simplifiedRules.set(id, simplified);
  return simplified;
}

function removeUnusedRules() {
  for (const id of simplifiedRules.keys()) {
    if (id === 42 || id === 31) {
      continue;
    }
    if (!Array.from(simplifiedRules.values()).some((r) => r.some((sr) => sr.includes(id)))) {
      simplifiedRules.delete(id);
    }
  }
}

function part2(inputs: string[]) {
  for (const l of input) {
    parseRule(l);
  }

  simplify(0);
  removeUnusedRules();

  // 0: 8 11
  // 8: 42 | 42 8
  // 11: 42 31 | 42 11 31

  for (const k of simplifiedRules.keys()) {
    console.log(k);
    const rule = simplifiedRules.get(k)!;
    rule.forEach((sr) => {
      console.log("  -", sr.join(""));
    });
  }
}

main();
