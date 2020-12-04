export default async function readFile(file: string, filterEmptyLines = true) {
  const rawInput = await Deno.readTextFile(file);
  let lines = rawInput.split(/\r?\n/);
  if (filterEmptyLines) {
    lines = lines.filter((s) => !!s);
  }
  return lines;
}
