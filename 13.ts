import readInput from "./input.ts";
const input = await readInput("13.txt");

const timestamp = parseInt(input[0]);

function part1() {
  const activeLines = input[1]
    .split(",")
    .filter((c) => c !== "x")
    .map((id) => parseInt(id));
  const bus = activeLines
    .map((id) => {
      const earliest = Math.ceil(timestamp / id) * id;
      return { id, earliest };
    })
    .reduce(
      (p, c) => {
        return c.earliest < p.earliest ? c : p;
      },
      { id: 0, earliest: Number.MAX_SAFE_INTEGER }
    );
  return bus.id * (bus.earliest - timestamp);
}

interface Line {
  id: bigint;
  offset: bigint;
}

function doesArriveAt(line: Line, timestamp: bigint) {
  return (timestamp + BigInt(line.offset)) % line.id === 0n;
}

function part2() {
  const rawLines = input[1].split(",");
  const lines: Array<Line> = [];
  rawLines.forEach((l, i) => {
    if (l !== "x") {
      lines.push({
        id: BigInt(l),
        offset: BigInt(i),
      });
    }
  });

  let offset = 0n;
  let lcm = lines[0].id;
  for (let i = 0; i < lines.length - 1; i++) {
    const nextLine = lines[i + 1];
    let factor = 1n;
    while (!doesArriveAt(nextLine, lcm * factor + offset)) {
      factor++;
    }
    offset = lcm * factor + offset;
    lcm = lcm * nextLine.id;
  }

  return offset;
}

console.log("Part 1", part1());
console.log("Part 2", part2());
