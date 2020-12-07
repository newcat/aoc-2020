import readInput from "./input.ts";
const input = await readInput("07.txt");

interface Rule {
  inputColor: string;
  content: ContentDefinition[];
}

interface ContentDefinition {
  count: number;
  color: string;
}

function parseContent(content: string): ContentDefinition[] {
  if (content === "no other bags") {
    return [];
  }
  const contents = content.split(",").map((s) => s.trim());
  return contents.map((c) => {
    const r = /^(\d+) (\w+ \w+) bags?$/.exec(c)!;
    return {
      count: Number(r[1]),
      color: r[2],
    };
  });
}

function parseLine(line: string): Rule {
  const r = /^(\w+ \w+) bags contain (.*)\.$/.exec(line)!;
  const inputColor = r[1];
  return {
    inputColor,
    content: parseContent(r[2]),
  };
}

const rules: Record<string, ContentDefinition[]> = {};
input.forEach((line) => {
  const { inputColor, content } = parseLine(line);
  rules[inputColor] = content;
});

function contains(bag: string, color: string): boolean {
  if (bag === color) {
    return true;
  }
  return rules[bag].some((b) => contains(b.color, color));
}

function expand(bag: string): number {
  if (rules[bag].length === 0) {
    return 1;
  }
  return rules[bag].reduce((p, c) => p + c.count * expand(c.color), 0) + 1;
}

function part1() {
  return Object.keys(rules).filter((c) => c !== "shiny gold" && contains(c, "shiny gold")).length;
}

function part2() {
  return expand("shiny gold") - 1;
}

console.log("Part 1", part1());
console.log("Part 2", part2());
