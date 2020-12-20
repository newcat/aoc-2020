import readInput from "./input.ts";
const input = await readInput("17.txt");

type State = string[];
type NDimRange = Array<[min: number, max: number]>;

function getInitialState(dimensions: number): State {
  const initialState: State = [];
  for (let y = 0; y < input.length; y++) {
    input[y].split("").forEach((v, x) => {
      if (v === "#") {
        const c = [x, y];
        while (c.length < dimensions) {
          c.push(0);
        }
        initialState.push(c.join(","));
      }
    });
  }
  return initialState;
}

function getMinMaxCoords(state: State, dimensions: number): NDimRange {
  const r: NDimRange = [];
  for (let d = 0; d < dimensions; d++) {
    r.push([0, 0]);
  }
  for (const s of state) {
    const coords = s.split(",").map((v) => parseInt(v));
    for (let d = 0; d < dimensions; d++) {
      if (coords[d] < r[d][0]) {
        r[d][0] = coords[d];
      }
      if (coords[d] > r[d][1]) {
        r[d][1] = coords[d];
      }
    }
  }
  return r;
}

function getActiveNeighbors(state: State, coords: number[], staticCoords: number[] = []): number {
  if (coords.length === 0) {
    const sCoord = staticCoords.join(",");
    return state.includes(sCoord) ? 1 : 0;
  } else {
    const first = coords[0];
    const slice = coords.slice(1);
    return (
      getActiveNeighbors(state, slice, [...staticCoords, first - 1]) +
      getActiveNeighbors(state, slice, [...staticCoords, first]) +
      getActiveNeighbors(state, slice, [...staticCoords, first + 1])
    );
  }
}

function runStep(state: State, dimensions: number, coords: number[] = [], minMax: NDimRange = []): State {
  if (minMax.length === 0) {
    minMax = getMinMaxCoords(state, dimensions);
  }
  if (coords.length === dimensions) {
    const isActive = state.includes(coords.join(","));
    let activeNeighbors = getActiveNeighbors(state, coords);
    if (isActive) {
      // subtract one because the current cube is included
      activeNeighbors -= 1;
    }
    if (activeNeighbors === 3 || (isActive && activeNeighbors === 2)) {
      return [coords.join(",")];
    } else {
      return [];
    }
  } else {
    const [min, max] = minMax[coords.length];
    const newState = [];
    for (let i = min - 1; i <= max + 1; i++) {
      const c = [...coords, i];
      newState.push(...runStep(state, dimensions, c, minMax));
    }
    return newState;
  }
}

function run(dimensions: number) {
  let state = getInitialState(dimensions);
  for (let i = 0; i < 6; i++) {
    state = runStep(state, dimensions);
    console.log(i + 1);
  }
  return state.length;
}

console.log("Part 1", run(3));
console.log("Part 2", run(4));
