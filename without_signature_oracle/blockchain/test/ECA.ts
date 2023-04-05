import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

function solhash(string: string): string {
  return ethers.utils.solidityKeccak256(["string"], [string]);
}

export function getActivationCodes(codes?: string[]): any[] {
  const activation_codes = [];
  if (codes) {
    return codes.map(solhash);
  }

  for (let index = 0; index < 5; index++) {
    const code = (Math.random() + 1).toString(36).substring(10);
    const hash = solhash(code);
    activation_codes.push(hash);
  }

  return activation_codes;
}

describe("HashFunction", () => {
  it("hello", () => {
    const value = "hello";
    const hash =
      "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8";

    expect(solhash(value)).to.be.equal(hash);
  });
});

describe("ECA", function () {
  async function deployFixture() {
    const ECA = await ethers.getContractFactory("ECA");
    const sc = await ECA.deploy();

    const [owner, otherAccount] = await ethers.getSigners();

    return { sc, owner, otherAccount };
  }

  describe("Push new codes", function () {
    it("Valid", async function () {
      const { sc } = await loadFixture(deployFixture);

      expect(await sc.addCode(getActivationCodes()));
    });

    it("From different account", async function () {
      const { sc, otherAccount } = await loadFixture(deployFixture);

      await expect(
        sc.connect(otherAccount).addCode(getActivationCodes())
      ).to.be.revertedWith("Only the owner can push new codes to this SC!");
    });
  });

  describe("Check", function () {
    it("Invalid challenge", async function () {
      const { sc } = await loadFixture(deployFixture);
      const res = await (await sc.checkCode("invalid")).wait();
      expect(res.events![0].args!.accepted).to.be.false;
    });

    it("Valid challenge", async function () {
      const { sc } = await loadFixture(deployFixture);

      const codes = getActivationCodes(["good"]);
      expect(await sc.addCode(codes));

      const res = await (await sc.checkCode("good")).wait();
      expect(res.events![0].args!.accepted).to.be.true;
    });

    it("Use challenge twice", async function () {
      const { sc } = await loadFixture(deployFixture);

      const codes = getActivationCodes(["good"]);
      expect(await sc.addCode(codes));

      const res = await (await sc.checkCode("good")).wait();
      expect(res.events![0].args!.accepted).to.be.true;

      const res2 = await (await sc.checkCode("good")).wait();
      expect(res2.events![0].args!.accepted).to.be.false;
    });

    it("Multiple challenges", async function () {
      const { sc } = await loadFixture(deployFixture);

      const codes = getActivationCodes(["good", "great", "other"]);
      expect(await sc.addCode(codes));

      const res = await (await sc.checkCode("good")).wait();
      expect(res.events![0].args!.accepted).to.be.true;

      const res2 = await (await sc.checkCode("great")).wait();
      expect(res2.events![0].args!.accepted).to.be.true;
    });
  });
});
