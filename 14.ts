import readInput from "./input.ts";
const input = await readInput("14.txt");

let setMask: bigint = 0n;
let resetMask: bigint = 2n ** 36n - 1n;
let rawMask = "";
let memory = new Map<bigint, bigint>();

function updateMask(line: string) {
  const value = line.substring(7);
  rawMask = value;
  setMask = BigInt("0b" + value.replaceAll("X", "0"));
  resetMask = BigInt("0b" + value.replaceAll("X", "1"));
}

function decodeMemoryAssignment(line: string): { address: bigint; value: bigint } {
  const r = /mem\[(\d+)\] = (\d+)/.exec(line)!;
  const address = BigInt(r[1]);
  let value = BigInt(r[2]);
  return { address, value };
}

function interpretLinePart1(line: string) {
  if (line.startsWith("mask = ")) {
    updateMask(line);
  } else {
    const r = /mem\[(\d+)\] = (\d+)/.exec(line)!;
    const address = BigInt(r[1]);
    let value = BigInt(r[2]);
    value |= setMask;
    value &= resetMask;
    memory.set(address, value);
  }
}

function recurseFloating(bits: string, address: bigint, value: bigint) {
  const i = bits.indexOf("X");
  if (i >= 0) {
    const bitPosition = BigInt(bits.length - i - 1);
    const address1 = address & ~(1n << bitPosition);
    const address2 = address | (1n << bitPosition);
    // the one time where it is actually useful that replace() only replaces the first occurence
    recurseFloating(bits.replace("X", "0"), address1, value);
    recurseFloating(bits.replace("X", "1"), address2, value);
  } else {
    memory.set(address, value);
  }
}

function interpretLinePart2(line: string) {
  if (line.startsWith("mask = ")) {
    updateMask(line);
  } else {
    let { address, value } = decodeMemoryAssignment(line);
    address |= setMask;
    recurseFloating(rawMask, address, value);
  }
}

function runProgram(interpreter: (s: string) => void) {
  setMask = 0n;
  resetMask = 2n ** 36n - 1n;
  rawMask = "";
  memory = new Map();
  input.forEach((l) => interpreter(l));
  let sum = 0n;
  memory.forEach((v) => (sum += v));
  return sum;
}

function part1() {
  return runProgram(interpretLinePart1);
}

function part2() {
  return runProgram(interpretLinePart2);
}

console.log("Part 1", part1());
console.log("Part 2", part2());
