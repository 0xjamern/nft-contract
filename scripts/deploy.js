const { ethers } = require("hardhat");

const { parseEther } = ethers;

async function main() {
  const NftContract = await ethers.getContractFactory("UNFT");
  const nftContract = await NftContract.deploy(parseEther("0.01"));
  await nftContract.waitForDeployment();

  const nftAddr = await nftContract.getAddress();

  console.log(`NFT contract deployed to: ${nftAddr}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
