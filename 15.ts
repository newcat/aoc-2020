const input = [10, 16, 6, 0, 1, 17];

type TurnMap = Map<number, [number, number]>;

function playTurn(map: TurnMap, turn: number, lastNumber: number): number {
  const [lastSpoken, currentLast] = map.get(lastNumber) ?? [-1, -1];
  if (lastSpoken >= 0) {
    const newNumber = currentLast - lastSpoken;
    const [, newNumberCurrentLast] = map.get(newNumber) ?? [-1, -1];
    map.set(newNumber, [newNumberCurrentLast, turn]);
    return newNumber;
  } else {
    const [, zeroCurrentLast] = map.get(0) ?? [-1, -1];
    map.set(0, [zeroCurrentLast, turn]);
    return 0;
  }
}

function initializeMap(map: TurnMap) {
  for (let i = 0; i < input.length; i++) {
    map.set(input[i], [-1, i + 1]);
  }
}

function play(turns: number) {
  const map: TurnMap = new Map();
  let turn = input.length + 1;
  initializeMap(map);
  let lastNumber = input[input.length - 1];
  while (turn <= turns) {
    lastNumber = playTurn(map, turn, lastNumber);
    turn++;
  }
  return lastNumber;
}

console.log("Part 1", play(2020));
console.log("Part 2", play(30000000));

// This is needed to indicate that this file is a module
// since there are no import statements
export {};
