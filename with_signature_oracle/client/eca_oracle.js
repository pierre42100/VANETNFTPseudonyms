import { ACCOUNTS, genActivationCodes, pushCodes } from "./lib.js";
import { finishExecution } from "./tracker.js";

await pushCodes(ACCOUNTS[0], genActivationCodes());
finishExecution();