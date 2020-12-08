import readInput from "./input.ts";
const input = await readInput("08.txt");

interface State {
  pc: number;
  acc: number;
}

interface ExecutionResult {
  reason: "terminated" | "infinite loop";
  state: State;
}

type Instruction = "nop" | "acc" | "jmp";

type Program = Array<[Instruction, number]>;

const originalProgram: Program = input.map((s) => {
  const r = /^(nop|acc|jmp) ([+-]\d+)/.exec(s)!;
  return [r[1] as Instruction, Number(r[2])];
});

function runInstruction(program: Program, state: State): State {
  const instruction = program[state.pc][0];
  const arg = program[state.pc][1];
  switch (instruction) {
    case "nop":
      return { pc: state.pc + 1, acc: state.acc };
    case "acc":
      return { pc: state.pc + 1, acc: state.acc + arg };
    case "jmp":
      return { pc: state.pc + arg, acc: state.acc };
  }
}

function run(program: Program): ExecutionResult {
  let state: State = { pc: 0, acc: 0 };
  const visited: number[] = [];
  while (true) {
    visited.push(state.pc);
    const newState = runInstruction(program, state);
    if (visited.includes(newState.pc)) {
      return { reason: "infinite loop", state };
    } else if (newState.pc === program.length) {
      return { reason: "terminated", state: newState };
    }
    state = newState;
  }
}

function part2() {
  const indicesToChange: number[] = [];
  originalProgram.forEach((v, i) => {
    if (v[0] === "jmp" || v[0] === "nop") {
      indicesToChange.push(i);
    }
  });
  for (const i of indicesToChange) {
    const modifiedProgram = JSON.parse(JSON.stringify(originalProgram));
    const inst = modifiedProgram[i][0];
    if (inst === "jmp") {
      modifiedProgram[i][0] = "nop";
    } else {
      modifiedProgram[i][0] = "jmp";
    }
    const result = run(modifiedProgram);
    if (result.reason === "terminated") {
      return result;
    }
  }
}

console.log("Part 1", run(originalProgram));
console.log("Part 2", part2());
