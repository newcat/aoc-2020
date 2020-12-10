import readInput from "./input.ts";
const input = (await readInput("10.txt")).map((n) => parseInt(n));

input.push(0); // Outlet
input.sort((a, b) => a - b);
input.push(input[input.length - 1] + 3); // device built-in adapter

function part1() {
  let diff1 = 0;
  let diff3 = 0;

  for (let i = 0; i < input.length - 1; i++) {
    const diff = input[i + 1] - input[i];
    if (diff === 1) {
      diff1++;
    } else {
      diff3++;
    }
  }

  return diff1 * diff3;
}

function part2() {
  const adapterCombinations = new Map<number, number>();
  adapterCombinations.set(input[input.length - 1], 1);

  for (let i = input.length - 2; i >= 0; i--) {
    const possibleAdapters: number[] = [];
    const adapterValue = input[i];
    // we need to look at max 3 consecutive adapters
    for (let j = i + 1; j <= i + 3 && j < input.length; j++) {
      if (input[j] - adapterValue <= 3) {
        possibleAdapters.push(input[j]);
      } else {
        break;
      }
    }
    const thisAdapterCombinations = possibleAdapters.map((v) => adapterCombinations.get(v)!).reduce((p, c) => p + c, 0);
    adapterCombinations.set(adapterValue, thisAdapterCombinations);
  }

  return adapterCombinations.get(0);
}

console.log("Part 1", part1());
console.log("Part 2", part2());
