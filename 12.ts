import readInput from "./input.ts";
const input = await readInput("12.txt");

const directions: Map<number, [number, number]> = new Map([
  [0, [0, -1]],
  [90, [1, 0]],
  [180, [0, 1]],
  [270, [-1, 0]],
]);

interface Waypoint {
  x: number;
  y: number;
}

interface Ship {
  x: number;
  y: number;
  direction: number;
}

function moveForward(ship: Ship, amount: number) {
  while (ship.direction < 0) {
    ship.direction += 360;
  }
  const [dx, dy] = directions.get(ship.direction % 360)!;
  ship.x += amount * dx;
  ship.y += amount * dy;
}

function move(ship: Ship, command: string) {
  const action = command[0];
  const param = Number(command.substring(1));
  switch (action) {
    case "N":
      ship.y -= param;
      break;
    case "S":
      ship.y += param;
      break;
    case "E":
      ship.x += param;
      break;
    case "W":
      ship.x -= param;
      break;
    case "L":
      ship.direction -= param;
      break;
    case "R":
      ship.direction += param;
      break;
    case "F":
      moveForward(ship, param);
      break;
  }
}

function waypointRotate(waypoint: Waypoint, direction: "left" | "right", amount: number) {
  if (direction === "left") {
    amount = -amount;
  }
  const angle = Math.PI * (amount / 180);
  const x = Math.round(waypoint.x * Math.cos(angle) - waypoint.y * Math.sin(angle));
  const y = Math.round(waypoint.x * Math.sin(angle) + waypoint.y * Math.cos(angle));
  waypoint.x = x;
  waypoint.y = y;
}

function movePart2(ship: Ship, waypoint: Waypoint, command: string) {
  const action = command[0];
  const param = Number(command.substring(1));
  switch (action) {
    case "N":
      waypoint.y -= param;
      break;
    case "S":
      waypoint.y += param;
      break;
    case "E":
      waypoint.x += param;
      break;
    case "W":
      waypoint.x -= param;
      break;
    case "L":
      waypointRotate(waypoint, "left", param);
      break;
    case "R":
      waypointRotate(waypoint, "right", param);
      break;
    case "F":
      ship.x += waypoint.x * param;
      ship.y += waypoint.y * param;
      break;
  }
}

function manhattanDistance(ship: Ship) {
  return Math.abs(ship.x) + Math.abs(ship.y);
}

function part1() {
  const ship: Ship = {
    x: 0,
    y: 0,
    direction: 90,
  };
  for (const l of input) {
    move(ship, l);
  }
  return manhattanDistance(ship);
}

function part2() {
  const ship: Ship = {
    x: 0,
    y: 0,
    direction: 0,
  };
  const waypoint: Waypoint = {
    x: 10,
    y: -1,
  };
  for (const l of input) {
    movePart2(ship, waypoint, l);
  }
  return manhattanDistance(ship);
}

console.log("Part 1", part1());
console.log("Part 2", part2());
