import readInput from "./input.ts";
const input = await readInput("06.txt", false);

function linesToGroup(lines: string[]): string[][] {
  let currentGroupAnswers: string[] = [];
  const groups: string[][] = [];
  for (const l of lines) {
    if (l) {
      currentGroupAnswers.push(l);
    } else {
      groups.push(currentGroupAnswers);
      currentGroupAnswers = [];
    }
  }
  if (currentGroupAnswers) {
    groups.push(currentGroupAnswers);
  }
  return groups;
}

function union(answers: string[]) {
  let union = answers[0].split("");
  for (let i = 1; i < answers.length; i++) {
    const a = answers[i].split("");
    union = union.filter((c) => a.includes(c));
  }
  return union;
}

function part1() {
  return linesToGroup(input)
    .map((g) => new Set(g.join("").split("")).size)
    .reduce((p, c) => p + c, 0);
}

function part2() {
  return linesToGroup(input)
    .map((g) => union(g).length)
    .reduce((p, c) => p + c, 0);
}

console.log("Part 1", part1());
console.log("Part 2", part2());
