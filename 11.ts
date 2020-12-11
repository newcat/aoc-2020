import readInput from "./input.ts";
const input = await readInput("11.txt");

type OccupationFunction = (centerX: number, centerY: number) => number;
type LayoutType = Array<Array<"." | "L" | "#">>;
let layout: LayoutType;

function loadLayout() {
  layout = input.map((l) => l.split("") as Array<"." | "L" | "#">);
}

const getNumOccupiedPart1: OccupationFunction = (centerX: number, centerY: number) => {
  let numOccupied = 0;
  for (let y = centerY - 1; y <= centerY + 1; y++) {
    for (let x = centerX - 1; x <= centerX + 1; x++) {
      if (y === centerY && x === centerX) {
        continue;
      }
      if (y >= 0 && y < layout.length && x >= 0 && x < layout[y].length && layout[y][x] === "#") {
        numOccupied++;
      }
    }
  }
  return numOccupied;
};

const getNumOccupiedPart2: OccupationFunction = (centerX: number, centerY: number) => {
  let numOccupied = 0;
  for (const dx of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      // traverse until out of bounds or seat found
      let x = centerX + dx;
      let y = centerY + dy;
      while (true) {
        if (y < 0 || y >= layout.length || x < 0 || x >= layout[y].length) {
          break;
        }
        if (layout[y][x] === "#") {
          numOccupied++;
          break;
        } else if (layout[y][x] === "L") {
          break;
        }
        x += dx;
        y += dy;
      }
    }
  }
  return numOccupied;
};

function simulateStep(occupationFunction: OccupationFunction, threshold: number) {
  let changes = 0;
  const newLayout: LayoutType = [];
  for (let y = 0; y < layout.length; y++) {
    newLayout.push([]);
    for (let x = 0; x < layout[y].length; x++) {
      const occ = occupationFunction(x, y);
      if (layout[y][x] === "L" && occ === 0) {
        newLayout[y].push("#");
        changes++;
      } else if (layout[y][x] === "#" && occ >= threshold) {
        newLayout[y].push("L");
        changes++;
      } else {
        newLayout[y].push(layout[y][x]);
      }
    }
  }
  layout = newLayout;
  return changes;
}

function countOccupied() {
  let occupied = 0;
  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      if (layout[y][x] === "#") {
        occupied++;
      }
    }
  }
  return occupied;
}

function part1() {
  loadLayout();
  while (simulateStep(getNumOccupiedPart1, 4) > 0);
  return countOccupied();
}

function part2() {
  loadLayout();
  while (simulateStep(getNumOccupiedPart2, 5) > 0);
  return countOccupied();
}

console.log("Part 1", part1());
console.log("Part 2", part2());
