import { ethers } from "hardhat";

async function main() {
  const ECA = await ethers.getContractFactory("ECA");
  const sc_eca = await ECA.deploy();
  await sc_eca.deployed();
  console.log(`ECA deployed to ${sc_eca.address}`);

  const TimeProvider = await ethers.getContractFactory("TimeProvider");
  const sc_tp = await TimeProvider.deploy(Math.floor(new Date().getTime() / 1000));
  await sc_tp.deployed();
  console.log(`TimeProvider deployed to ${sc_tp.address}`);

  const VcertNFT = await ethers.getContractFactory("VcertNFT");
  const sc = await VcertNFT.deploy(sc_eca.address, sc_tp.address);
  await sc.deployed();
  console.log(`VcertNFT deployed to ${sc.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
