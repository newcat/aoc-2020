import readInput from "./input.ts";

function getParts(policyAndPassword: string): [number, number, string, string] {
  const x = /(\d+)-(\d+) ([A-z]): ([A-z]+)/.exec(policyAndPassword);
  if (!x) {
    console.log(x, policyAndPassword);
    throw new Error("Invalid expression");
  }
  return [Number(x[1]), Number(x[2]), x[3], x[4]];
}

function isValidPart1(policyAndPassword: string) {
  const [min, max, char, pw] = getParts(policyAndPassword);
  const count = pw.split("").reduce((p, c) => (c === char ? p + 1 : p), 0);
  return count >= min && count <= max;
}

function isValidPart2(policyAndPassword: string) {
  const [pos1, pos2, char, pw] = getParts(policyAndPassword);
  const a = pw[pos1 - 1] === char;
  const b = pw[pos2 - 1] === char;
  return (a && !b) || (!a && b);
}

const pwList = await readInput("02.txt");

console.log(
  "Part 1",
  pwList.reduce((p, c) => (isValidPart1(c) ? p + 1 : p), 0)
);
console.log(
  "Part 2",
  pwList.reduce((p, c) => (isValidPart2(c) ? p + 1 : p), 0)
);
