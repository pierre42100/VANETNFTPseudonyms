import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const VALID_CHALLENGE = "VALID";
const INVALID_CHALLENGE = "INVALID";

const INIT_TIME = 12345;

describe("TimeProvider", function () {
  async function deployFixture() {
    const TimeProvider = await ethers.getContractFactory("TimeProvider");
    const sc = await TimeProvider.deploy(INIT_TIME);

    const [owner, otherAccount] = await ethers.getSigners();

    return { sc, owner, otherAccount };
  }

  describe("Use", function () {
    it("Get time", async function () {
      const { sc } = await loadFixture(deployFixture);

      expect(await sc.getTime()).to.be.equal(INIT_TIME);
    });
  });

  describe("Update", function () {
    it("Valid owner", async function () {
      const { sc, owner } = await loadFixture(deployFixture);

      const newTime = INIT_TIME + 10;

      expect(await sc.connect(owner).set(newTime));
      expect(await sc.getTime()).to.be.equal(newTime);
    });

    it("Invalid owner", async function () {
      const { sc, otherAccount } = await loadFixture(deployFixture);

      await expect(
        sc.connect(otherAccount).set(INIT_TIME + 10)
      ).to.be.rejectedWith("Only the owner can update the time!");
    });
  });
});
