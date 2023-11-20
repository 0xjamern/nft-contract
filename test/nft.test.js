const { expect } = require("chai");
const { ethers } = require("hardhat");

const { parseEther } = ethers;

describe("UNFT test", function () {
  before("Deploy contract", async function () {
    [this.owner, this.treasury, this.alice, this.bob] = await ethers.getSigners();

    const NftContract = await ethers.getContractFactory("UNFT");
    this.nft = await NftContract.deploy(parseEther("0.01"));
    await this.nft.waitForDeployment();

    this.nftAddr = await this.nft.getAddress();

    this.uri1 = "uri1";
    this.uri2 = "uri2";
    this.uri3 = "uri3";

    console.log(`NFT contract deployed to: ${this.nft.address}`)
  })

  describe("Test mint functionality", function () {
    it("Users can not mint nft without ETH", async function () {
      await expect(
        this.nft.connect(this.alice).mint(this.uri1)
      ).to.be.revertedWithCustomError(
        this.nft,
        "InsufficientETHAmount()"
      );

      await expect(
        this.nft.connect(this.bob).mint(this.uri2)
      ).to.be.revertedWithCustomError(
        this.nft,
        "InsufficientETHAmount()"
      );
    })

    it("Users can not mint nft with sufficient ETH", async function () {
      await expect(
        this.nft.connect(this.alice).mint(
          this.uri1,
          {
            value: parseEther("0.005")
          }
        )
      ).to.be.revertedWithCustomError(
        this.nft,
        "InsufficientETHAmount()"
      );

      await expect(
        this.nft.connect(this.bob).mint(
          this.uri2,
          {
            value: parseEther("0.005")
          }
        )
      ).to.be.revertedWithCustomError(
        this.nft,
        "InsufficientETHAmount()"
      );
    })

    it("Users can mint with sufficient ETH", async function () {
      const valueAmt = parseEther("0.01");
      await this.nft.connect(this.alice).mint(this.uri1, {
        value: valueAmt
      });

      await this.nft.connect(this.alice).mint(this.uri2, {
        value: valueAmt
      });

      await this.nft.connect(this.bob).mint(this.uri3, {
        value: valueAmt
      });

      const aliceBalance = await this.nft.balanceOf(this.alice.address);
      const bobBalance = await this.nft.balanceOf(this.bob.address);

      expect(aliceBalance).to.be.eq(2);
      expect(bobBalance).to.be.eq(1);
    })
  })

  describe("Check withdraw", function () {
    it("Only admin can withdraw", async function () {
      await expect(
        this.nft.connect(this.alice).withdrawFund(this.treasury.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(
        this.nft.connect(this.bob).withdrawFund(this.treasury.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    })

    it("Admin withdraw funds", async function () {
      const beforeTreasury = await ethers.provider.getBalance(this.treasury.address);
      const contractBalance = await ethers.provider.getBalance(this.nftAddr);

      await this.nft.connect(this.owner).withdrawFund(this.treasury.address)

      const afterTreasury = await ethers.provider.getBalance(this.treasury.address);

      expect(afterTreasury - beforeTreasury).to.be.eq(contractBalance)
    })
  })

  describe("Check nft's metadata", async function () {
    it("Check Alice's nfts metadata", async function () {
      const token1Uri = await this.nft.tokenURI(1);
      const token2Uri = await this.nft.tokenURI(2);
      expect(token1Uri).to.be.eq(this.uri1)
      expect(token2Uri).to.be.eq(this.uri2)

      const token1Owner = await this.nft.ownerOf(1);
      const token2Owner = await this.nft.ownerOf(2);
      expect(token1Owner).to.be.eq(this.alice.address);
      expect(token2Owner).to.be.eq(this.alice.address);
    })

    it("Check Bob's nfts metadata", async function () {
      const token3Uri = await this.nft.tokenURI(3);
      expect(token3Uri).to.be.eq(this.uri3)

      const token3Owner = await this.nft.ownerOf(3);
      expect(token3Owner).to.be.eq(this.bob.address)
    })
  });
});
