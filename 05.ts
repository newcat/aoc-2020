import readInput from "./input.ts";
const input = await readInput("05.txt");

//0x0000000
//  FBFBBFF
//  0101100
function getRow(rowString: string) {
  return Number("0b" + rowString.replaceAll("F", "0").replaceAll("B", "1"));
}

//0x000
//  RLR
//  101
function getColumn(columnString: string) {
  return Number("0b" + columnString.replaceAll("L", "0").replaceAll("R", "1"));
}

function getId(row: number, column: number) {
  return row * 8 + column;
}

function getAllIds() {
  return input.map((l) => {
    const row = getRow(l.substring(0, 7));
    const column = getColumn(l.substring(7));
    return getId(row, column);
  });
}

function part1() {
  return Math.max(...getAllIds());
}

function part2() {
  const allIds = getAllIds();
  const maxId = part1();
  for (let id = 0; id <= maxId; id++) {
    const i = allIds.indexOf(id);
    if (i === -1 && allIds.indexOf(id - 1) >= 0 && allIds.indexOf(id + 1) >= 0) {
      return id;
    }
  }
}

console.log("Part 1", part1());
console.log("Part 2", part2());
