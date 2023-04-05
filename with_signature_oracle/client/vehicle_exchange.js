import { KJUR } from "jsrsasign";
import {
  ACCOUNTS,
  CURVE,
  SIG_ALG,
  getNFT,
  mintNFT,
  time,
  pause,
  getNFTSignature,
  verifyNFTSig,
  consumeActivationCode,
  watchNFTSignature,
  getCurrentBlockNumber,
} from "./lib.js";
import { finishExecution, startCall } from "./tracker.js";

// Config
const VALID_CHALLENGE = consumeActivationCode();

async function sendMessage(message, addr) {
  // Generate keys
  const ec = new KJUR.crypto.ECDSA({
    curve: CURVE,
  });
  const keypair = ec.generateKeyPairHex();

  const currentBlock = await getCurrentBlockNumber();

  // Mint NFT
  const NFT_ID = await mintNFT(VALID_CHALLENGE, keypair.ecpubhex, time(), addr);

  console.log("Wait for signature...");
  await new Promise((res, rej) => {
    watchNFTSignature(ACCOUNTS[0], (id) => {
      if (id == NFT_ID) res();
    }, currentBlock);
  });

  const nft = await getNFT(ACCOUNTS[0], NFT_ID);
  const nftSignature = await getNFTSignature(ACCOUNTS[0], NFT_ID);

  // Generate & sign message
  const sig = new KJUR.crypto.Signature({ alg: SIG_ALG });
  sig.init({ d: keypair.ecprvhex, curve: CURVE });
  sig.updateString(message);
  const signature = sig.sign();

  return `${JSON.stringify(nft)}#${nftSignature}#${signature}#${message}`;
}

async function receiveMessage(rec, addr) {
  const split = rec.split("#", 4);
  const nft = split[0];
  const nftSigHex = split[1];
  const sigHex = split[2];
  const msg = split[3];

  const cert = JSON.parse(nft);

  verifyNFTSig(cert, nftSigHex);

  if (time() > cert.endTime || time() < cert.startTime)
    throw new Error("Certificate not yet valid!");

  const sigMSG = new KJUR.crypto.Signature({ alg: SIG_ALG });
  sigMSG.init({ xy: cert.pkey, curve: CURVE });
  sigMSG.updateString(msg);

  if (!sigMSG.verify(sigHex)) throw new Error("Failed to validate message!");

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

finishExecution();
