import { appendFileSync, existsSync } from "fs";

/**
 * @type {Call[]}
 */
const CALLS = [];

/**
 * Call tracker
 */
export function startCall(callName) {
  const call = new Call(callName);
  CALLS.push(call);
  return call;
}

export function saveStatistics(file) {
  let out = existsSync(file) ? "" : "name;duration;cost\n";

  for (let c of CALLS) {
    const res = c.toJSON();
    out += `${res.name};${res.duration};${res.cost}\n`;
  }

  appendFileSync(file, out);
}

export function finishExecution() {
  if (process.argv.length > 2) {
    saveStatistics(process.argv[2]);
  }

  process.exit();
}

class Call {
  constructor(name) {
    this.name = name;
    this.startTime = new Date();
  }

  end(cost) {
    this.endTime = new Date();
    this.cost = cost;
  }

  toJSON() {
    return {
      name: this.name,
      duration: this.endTime - this.startTime,
      cost: this.cost,
    };
  }
}
