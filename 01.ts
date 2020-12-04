import readInput from "./input.ts";
const numbers = (await readInput("01.txt")).map((s) => Number(s));

function part1() {
    for (const a of numbers) {
        for (const b of numbers) {
            if (a + b === 2020) {
                return a * b;
            }
        }
    }
}

function part2() {
    for (const a of numbers) {
        for (const b of numbers) {
            for (const c of numbers) {
                if (a + b + c === 2020) {
                    return a * b * c;
                }
            }
        }
    }
}

console.log("Part 1", part1());
console.log("Part 2", part2());
