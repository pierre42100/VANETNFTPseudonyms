import { ACCOUNTS, updateTime } from "./lib.js";
import { finishExecution } from "./tracker.js";

await updateTime(ACCOUNTS[0])
finishExecution();