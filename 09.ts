import readInput from "./input.ts";
const input = (await readInput("09.txt")).map((n) => parseInt(n));

function hasSum(numbers: number[], sum: number) {
  for (let a of numbers) {
    for (let b of numbers) {
      if (a + b === sum) {
        return true;
      }
    }
  }
  return false;
}

function part1(): number {
  const preambleLength = 25;
  for (let i = preambleLength; i < input.length; i++) {
    const preamble = input.slice(i - preambleLength, i);
    if (!hasSum(preamble, input[i])) {
      return input[i];
    }
  }
  throw new Error("No invalid number found");
}

function part2(): number {
  const invalidNumber = part1();
  for (let i = 0; i < input.length; i++) {
    let count = 0;
    let sum: number;
    do {
      count++;
      sum = 0;
      for (let j = i; j < i + count; j++) {
        sum += input[j];
      }
    } while (sum < invalidNumber);
    if (sum === invalidNumber) {
      const slice = input.slice(i, i + count);
      return Math.max(...slice) + Math.min(...slice);
    }
  }
  throw new Error("No sequence found");
}

console.log("Part 1", part1());
console.log("Part 2", part2());
