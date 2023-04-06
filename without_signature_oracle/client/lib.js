import Web3 from "web3";
import Contract from "web3-eth-contract";
import { startCall } from "./tracker.js";
import { writeFileSync, readFileSync } from "fs";

const SERVER = "127.0.0.1:8545";
const TIME_SC_ADDR = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const VEHI_SC_ADDR = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const ECA_SC_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const CODES_FILE = "activation_codes.csv";

export const ACCOUNTS = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
];

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
          name: "challenge",
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

export async function printBlockNumber() {
  const t = startCall("getBlockNumber");
  await new Promise((res, rej) =>
    web3.eth.getBlockNumber(function (error, result) {
      if (error) rej(error);
      else {
        t.end(0);
        console.log(`Current block number: ${result}`);
        res(result);
      }
    })
  );
}

export function time() {
  return Math.floor(new Date().getTime() / 1000);
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
    .send({ from: addr });
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
    .send({ from: addr });
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
    pkey: split[0],
    startTime: split[1],
    endTime: split[2],
  };
}
