import readInput from "./input.ts";
const input = await readInput("16.txt", false);

interface IRule {
  name: string;
  ranges: Array<[number, number]>;
}

type Ticket = number[];

const rules: IRule[] = [];
let myTicket: Ticket;
const tickets: Ticket[] = [];

function readRule(line: string): boolean {
  if (!line) {
    return false;
  }
  const r = /^([\w ]+): (\d+)-(\d+) or (\d+)-(\d+)$/.exec(line)!;
  rules.push({
    name: r[1],
    ranges: [
      [parseInt(r[2]), parseInt(r[3])],
      [parseInt(r[4]), parseInt(r[5])],
    ],
  });
  return true;
}

function readTicket(line: string): Ticket {
  return line.split(",").map((v) => parseInt(v));
}

function parseInput() {
  let i = 0;
  while (readRule(input[i])) {
    i++;
  }
  i += 2; // skip empty and "your ticket:" lines
  myTicket = readTicket(input[i++]);
  i += 2; // skip empty and "nearby tickets:" lines
  while (i < input.length) {
    tickets.push(readTicket(input[i]));
    i++;
  }
}

parseInput();

function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

function getErrorRate(ticket: Ticket): number {
  let errorRate = 0;
  for (const v of ticket) {
    if (!rules.some((r) => r.ranges.some(([min, max]) => isInRange(v, min, max)))) {
      errorRate += v;
    }
  }
  return errorRate;
}

function part1() {
  return tickets.reduce((p, c) => p + getErrorRate(c), 0);
}

function part2() {
  const validTickets = tickets.filter((t) => getErrorRate(t) === 0);
  const ruleIndexMapping = new Map<number, number>();
  let foundIndexes = 0;

  while (foundIndexes < rules.length) {
    for (let ticketIndex = 0; ticketIndex < rules.length; ticketIndex++) {
      let valid = 0;
      let validIndex = 0;
      for (let ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
        if (ruleIndexMapping.has(ruleIndex)) {
          continue;
        }
        if (
          validTickets.every((t) => rules[ruleIndex].ranges.some(([min, max]) => isInRange(t[ticketIndex], min, max)))
        ) {
          valid++;
          validIndex = ruleIndex;
        }
      }
      if (valid === 1) {
        ruleIndexMapping.set(validIndex, ticketIndex);
        foundIndexes++;
      }
    }
  }

  let v = 1;
  for (let ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
    const r = rules[ruleIndex];
    if (!r.name.startsWith("departure")) {
      continue;
    }
    v *= myTicket[ruleIndexMapping.get(ruleIndex)!];
  }

  return v;
}

console.log("Part 1", part1());
console.log("Part 2", part2());
