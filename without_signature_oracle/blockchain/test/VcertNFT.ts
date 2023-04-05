import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { getActivationCodes } from "./ECA";

const VALID_CODE = "VALID";
const INVALID_CODE = "INVALID";

function time(): number {
  return Math.floor(new Date().getTime() / 1000);
}

describe("VcertNFT", function () {
  async function deployFixture() {
    const ECA = await ethers.getContractFactory("ECA");
    const sc_eca = await ECA.deploy();

    await sc_eca.addCode(getActivationCodes([VALID_CODE]));

    const TimeProvider = await ethers.getContractFactory("TimeProvider");
    const sc_tp = await TimeProvider.deploy(time());

    const VcertNFT = await ethers.getContractFactory("VcertNFT");
    const sc = await VcertNFT.deploy(sc_eca.address, sc_tp.address);

    const [owner, otherAccount] = await ethers.getSigners();

    return { sc, owner, otherAccount };
  }

  describe("Mint", function () {
    it("Mint a NFT", async function () {
      const { sc } = await loadFixture(deployFixture);

      expect(await sc.mintNFT(VALID_CODE, "addr", time()));
    });

    it("Invalid code", async function () {
      const { sc } = await loadFixture(deployFixture);

      await expect(
        sc.mintNFT(INVALID_CODE, "addr", time())
      ).to.be.revertedWith("The code has been rejected");
    });

    it("Invalid date in the past", async function () {
      const { sc } = await loadFixture(deployFixture);

      await expect(
         sc.mintNFT(VALID_CODE, "addr", time() - 1000)
      ).to.be.revertedWith("Cannot issue certificates for a past time!");
    });

    it("Invalid date in the future", async function () {
      const { sc } = await loadFixture(deployFixture);

      await expect(
         sc.mintNFT(VALID_CODE, "addr", time() + 3600 * 24 * 35)
      ).to.be.revertedWith("Cannot issue certificates that begins so far in the future!");
    });

    it("From other accounts", async function () {
      const { sc, otherAccount } = await loadFixture(deployFixture);

      expect(
        await sc
          .connect(otherAccount)
          .mintNFT(VALID_CODE, "addr", time() + 300)
      );
    });
  });

  describe("Check", function () {
    it("Un-existent token", async function () {
      const { sc, otherAccount } = await loadFixture(deployFixture);

      await expect(sc.connect(otherAccount).tokenURI(10392)).to.be.rejectedWith(
        Error
      );
    });

    it("Retrieve a NFT by its token id", async function () {
      const { sc, owner, otherAccount } = await loadFixture(deployFixture);

      const pubKey = "pubKeyContent";

      const token = await sc
        .connect(owner)
        .mintNFT(VALID_CODE, pubKey, time());
      await expect(token).to.emit(sc, "NFTMinted").withArgs(1);

      const uri = await sc.connect(otherAccount).tokenURI(1);
      expect(uri.startsWith(pubKey + "#")).to.be.true;

      const tokenOwner = await sc.connect(otherAccount).ownerOf(1);
      expect(tokenOwner).to.be.equal(owner.address);
    });
  });
});
