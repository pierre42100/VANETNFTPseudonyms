import { KJUR } from "jsrsasign";
import Web3 from "web3";
import Contract from "web3-eth-contract";
import { startCall } from "./tracker.js";
import { readFileSync, writeFileSync } from "fs";

export const CURVE = "secp256r1";
export const SIG_ALG = "SHA256withECDSA";

const SERVER = "127.0.0.1:8545";


let TIME_SC_ADDR = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
let VEHI_SC_ADDR = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
let ECA_SC_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

let CODES_FILE = "activation_codes.csv";

export let ACCOUNTS = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
];


if(process.env.USE_GANACHE) {
  TIME_SC_ADDR = "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24"
  VEHI_SC_ADDR = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601"
  ECA_SC_ADDR = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab"

  ACCOUNTS = [
    "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
    "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0",
    "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b"
  ]
}


const SIGN_PRI_KEY =
  "9ee5bc08f704ec88691546738886508db4acdd7c39e5242e5ded7d415fae0eec";
const SIGN_PUB_KEY =
  "04999fd96786b6d3c4518ab4b4ecc7a27703275fa027ea613600ddc84dea778372d1d6771540d152431ea4a5b1903574b72f88f83cf736334976f70c5df05746ff";

const web3 = new Web3(`http://${SERVER}`);
Contract.setProvider(`ws://${SERVER}`);

const time_contract = new Contract(
  [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "time",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "getTime",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "time",
          type: "uint256",
        },
      ],
      name: "set",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  TIME_SC_ADDR
);

const vehi_contract = new Contract(
  [
    {
      inputs: [
        {
          internalType: "address",
          name: "eca_address",
          type: "address",
        },
        {
          internalType: "address",
          name: "time_provider_address",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "CertificateAvailable",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "NFTMinted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "nftID",
          type: "uint256",
        },
      ],
      name: "getSignature",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "code",
          type: "string",
        },
        {
          internalType: "string",
          name: "pubkey",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "startTime",
          type: "uint256",
        },
      ],
      name: "mintNFT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "signature",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "nftID",
          type: "uint256",
        },
      ],
      name: "setSignature",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  VEHI_SC_ADDR
);

const eca_contract = new Contract(
  [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "accepted",
          type: "bool",
        },
      ],
      name: "CodeAccepted",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "bytes32[]",
          name: "codes",
          type: "bytes32[]",
        },
      ],
      name: "addCode",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "code",
          type: "string",
        },
      ],
      name: "checkCode",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  ECA_SC_ADDR
);

export async function getCurrentBlockNumber() {
  const c = startCall("getBlockNumber");
  return await new Promise((res, rej) =>
    web3.eth.getBlockNumber(function (error, result) {
      if (error) rej(error);
      else {
        c.end(0);
        console.log(`Current block number: ${result}`);
        res(result);
      }
    })
  );
}

export function time() {
  return Math.floor(new Date().getTime() / 1000);
}

export async function pause(duration) {
  await new Promise((res, _rej) => setTimeout(() => res(), duration));
}

export function keccakSolidity(s) {
  return Web3.utils.soliditySha3({ type: "string", value: s });
}

export function genActivationCodes() {
  const codes = [];

  const start = Math.floor(time() / 10);
  for (let i = 0; i < 10; i++) {
    const code = `CODE-${start + i}`;
    codes.push(code);
  }

  return codes;
}

export async function pushCodes(addr, codes) {
  const codesHashs = codes.map(keccakSolidity);
  const c = startCall("ECA#addCode");
  const res = await eca_contract.methods
    .addCode(codesHashs)
    .send({ from: addr, gasLimit: 1000000 });
  c.end(res.gasUsed);
  console.log(`[${res.gasUsed} GAS] Added ${codes.length} codes`);

  writeFileSync(CODES_FILE, codes.join("\n"));
}

export function consumeActivationCode() {
  const codes = readFileSync(CODES_FILE, "utf8").split("\n");
  const take = codes.pop();
  writeFileSync(CODES_FILE, codes.join("\n"));
  return take;
}

export async function updateTime(addr) {
  const t = time();

  const c = startCall("TimeContract#set");
  const res = await time_contract.methods.set(t).send({ from: addr });
  c.end(res.gasUsed);
  console.log(`[${res.gasUsed} GAS] Time set to ${t}`);
}

export async function mintNFT(chal, pubKey, startTime, addr) {
  const c = startCall("VcertNFT#mintNFT");
  const res = await vehi_contract.methods
    .mintNFT(chal, pubKey, startTime)
    .send({ from: addr, gasLimit: 1000000 });
  c.end(res.gasUsed);
  const id = res.events.NFTMinted.returnValues["0"];
  console.log(
    `[${res.gasUsed} GAS] NFT [${id}] - pubKey: ${pubKey} - startTime: ${startTime}`
  );

  return Number(id);
}

export async function getNFT(addr, id) {
  const c = startCall("VcertNFT#getNFT");
  const res = await vehi_contract.methods.tokenURI(id).call({ from: addr });
  c.end(0);

  const split = res.split("#");

  return {
    id: id,
    pkey: split[0],
    startTime: split[1],
    endTime: split[2],
  };
}

export async function setNFTSignature(addr, id, sig) {
  const c = startCall("VcertNFT#setSignature");
  const res = await vehi_contract.methods
    .setSignature(sig, id)
    .send({ from: addr, gasLimit: 1000000 });
  c.end(res.gasUsed);
  console.log(`[${res.gasUsed} GAS] NFT [${id}] - signature: ${sig}`);
}

export async function getNFTSignature(addr, id) {
  const c = startCall("VcertNFT#getNFTSignature");
  const res = await vehi_contract.methods.getSignature(id).call({ from: addr });
  c.end(0);
  return res;
}

export async function watchNewNFT(addr, cb) {
  let connected = false;

  vehi_contract.events
    .NFTMinted(
      {
        fromBlock: await getCurrentBlockNumber(),
      },
      function (error, event) {
        if (!error) {
          /*console.log(event);*/
        } else console.error(error);
      }
    )
    .on("connected", function (subscriptionId) {
      console.info(
        "Connected to blockchain to listen to events",
        subscriptionId
      );
      connected = true;
    })
    .on("data", function (event) {
      if (!connected) return;

      //console.log("data", event); // same results as the optional callback above

      if (event.event === "NFTMinted") cb(event.returnValues._id);
    })
    .on("changed", function (event) {
      //console.log("changed", event);
    })
    .on("error", function (error, receipt) {
      //console.error("error", error, receipt);
    });
}

/**
 * Wait for certificate signature
 */
export async function watchNFTSignature(addr, cb, block) {
  let connected = false;

  vehi_contract.events
    .CertificateAvailable(
      {
        fromBlock: block ?? await getCurrentBlockNumber(),
      },
      function (error, event) {
        if (!error) {
          /*console.log(event);*/
        } else console.error(error);
      }
    )
    .on("connected", function (subscriptionId) {
      console.info(
        "Connected to blockchain to listen to events",
        subscriptionId
      );
      connected = true;
    })
    .on("data", function (event) {
      //console.log("data", event); // same results as the optional callback above

      if (event.event === "CertificateAvailable") cb(event.returnValues._id);
    })
    .on("changed", function (event) {
      //console.log("changed", event);
    })
    .on("error", function (error, receipt) {
      //console.error("error", error, receipt);
    });
}

/**
 * Generate an NFT signature
 */
export function signNFT(nft) {
  const s = JSON.stringify(nft); //`${nft.id}@${nft.startTime}@${nft.endTime}@${nft.pkey}`;

  const sig = new KJUR.crypto.Signature({ alg: SIG_ALG });
  sig.init({ d: SIGN_PRI_KEY, curve: CURVE });
  sig.updateString(s);
  return sig.sign();
}

export function verifyNFTSig(nft, sigHex) {
  const sigNFT = new KJUR.crypto.Signature({ alg: SIG_ALG });
  sigNFT.init({ xy: SIGN_PUB_KEY, curve: CURVE });
  sigNFT.updateString(JSON.stringify(nft));

  if (!sigNFT.verify(sigHex))
    throw new Error("Failed to validate NFT signature!");
}
