import { KJUR } from "jsrsasign";
import {
  ACCOUNTS,
  consumeActivationCode,
  getNFT,
  mintNFT,
  time,
} from "./lib.js";
import { finishExecution, startCall } from "./tracker.js";

// Config
const CURVE = "secp256r1";
const SIG_ALG = "SHA256withECDSA";
const VALID_CHALLENGE = consumeActivationCode();

async function sendMessage(message, addr) {
  // Generate keys
  const ec = new KJUR.crypto.ECDSA({
    curve: CURVE,
  });
  const keypair = ec.generateKeyPairHex();

  // Mint NFT
  const NFT_ID = await mintNFT(VALID_CHALLENGE, keypair.ecpubhex, time(), addr);

  // Generate & sign message
  const sig = new KJUR.crypto.Signature({ alg: SIG_ALG });
  sig.init({ d: keypair.ecprvhex, curve: CURVE });
  sig.updateString(message);
  const signature = sig.sign();

  return `${NFT_ID}#${signature}#${message}`;
}

async function receiveMessage(rec, addr) {
  const split = rec.split("#", 3);
  const nft_id = Number(split[0]);
  const sigHex = split[1];
  const msg = split[2];

  // Get pubkey from blockchain
  const cert = await getNFT(addr, nft_id);

  if (time() > cert.endTime || time() < cert.startTime)
    throw new Error("Certificate not yet valid!");

  const sig = new KJUR.crypto.Signature({ alg: SIG_ALG });
  sig.init({ xy: cert.pkey, curve: CURVE });
  sig.updateString(msg);
  sig.verify(sigHex);

  if (!sig) throw new Error("Failed to validate message!");

  return msg;
}

const wholeProc = startCall("JS#VehicleExchange");

const sendMessageProc = startCall("JS#SendMessage");
const msg = await sendMessage("hello world", ACCOUNTS[0]);
sendMessageProc.end(0);
console.log(`[MSG] ${msg}`);

const recMessageProc = startCall("JS#RecMessage");
const rec = await receiveMessage(msg, ACCOUNTS[1]);
recMessageProc.end(0);
console.log(`[MSG] Received message ${rec}`);

wholeProc.end(0);

finishExecution(0);
