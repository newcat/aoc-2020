import readInput from "./input.ts";
const input = await readInput("04.txt", false);

const requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
const validFields = [...requiredFields, "cid"];

const inRange = (s: string, min: number, max: number) => Number(s) >= min && Number(s) <= max;
const validation: Record<string, Array<RegExp | ((s: string) => boolean)>> = {
  byr: [/^\d{4}$/, (s: string) => inRange(s, 1920, 2002)],
  iyr: [/^\d{4}$/, (s: string) => inRange(s, 2010, 2020)],
  eyr: [/^\d{4}$/, (s: string) => inRange(s, 2020, 2030)],
  hgt: [
    /^(\d{3}cm)|(\d{2}in)$/,
    (s: string) => (s.endsWith("cm") ? inRange(s.substring(0, 3), 150, 193) : inRange(s.substring(0, 2), 59, 76)),
  ],
  hcl: [/^#[0-9a-f]{6}$/],
  ecl: [(s: string) => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(s)],
  pid: [/^\d{9}$/],
};

type Passport = Record<string, string>;

function stringToPassport(str: string): Passport {
  const fields = str.split(/[ ]+/);
  const passport: Record<string, string> = {};
  fields.forEach((f) => {
    const [k, v] = f.split(":");
    if (validFields.includes(k)) {
      passport[k] = v;
    } else {
      console.log("Found invalid field:", k, v);
    }
  });
  return passport;
}

function linesToPassports(lines: string[]): Passport[] {
  let currentPassportString = "";
  const passports: Passport[] = [];
  for (const l of lines) {
    if (l) {
      currentPassportString += " " + l;
    } else {
      passports.push(stringToPassport(currentPassportString.trim()));
      currentPassportString = "";
    }
  }
  if (currentPassportString.trim()) {
    passports.push(stringToPassport(currentPassportString.trim()));
  }
  return passports;
}

function isValidPart1(passport: Passport) {
  return requiredFields.every((k) => !!passport[k]);
}

function validateField(field: string, value: string) {
  if (validation[field]) {
    return validation[field].every((pred) => {
      if (pred instanceof RegExp) {
        return pred.test(value);
      } else {
        return pred(value);
      }
    });
  }
  return true;
}

function isValidPart2(passport: Passport) {
  return isValidPart1(passport) && Object.entries(passport).every(([k, v]) => validateField(k, v));
}

function part1() {
  const passports = linesToPassports(input);
  return passports.reduce((p, c) => (isValidPart1(c) ? p + 1 : p), 0);
}

function part2() {
  const passports = linesToPassports(input);
  return passports.reduce((p, c) => (isValidPart2(c) ? p + 1 : p), 0);
}

console.log("Part 1", part1());
console.log("Part 2", part2());
