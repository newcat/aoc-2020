import readInput from "./input.ts";

const map = (await readInput("03.txt")).map((line) => line.split(""));

function traverse(xStep: number, yStep: number) {
  let x = 0,
    y = 0;
  let treeEncounters = 0;
  while (y < map.length) {
    if (map[y][x % map[y].length] === "#") {
      treeEncounters++;
    }
    x += xStep;
    y += yStep;
  }
  return treeEncounters;
}

function part1() {
  return traverse(3, 1);
}

function part2() {
  return [traverse(1, 1), traverse(3, 1), traverse(5, 1), traverse(7, 1), traverse(1, 2)].reduce((p, c) => p * c, 1);
}

console.log("Part 1", part1());
console.log("Part 2", part2());
