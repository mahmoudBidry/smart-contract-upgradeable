const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTV1", function () {
  let owner;
  let addr1;
  let tokenId;
  let nftContract;
  let upgradedNftContract;
  let URI = "https://gateway.pinata.cloud/ipfs/QmaXdVYjGRscsa87CBk16CsRpZqpkBWH2BeSsKG5xsiAru/1.json"

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const NFTContractV2 = await ethers.getContractFactory("NFTV2");
    nftContractV2 = await upgrades.deployProxy(NFTContractV2, [], { initializer: 'initialize' });
    await nftContractV2.deployed();

    // Upgrade the contract
    upgradedNftContract = await upgrades.upgradeProxy(nftContractV2.address, NFTContractV2);

    tokenId = 1;
  });

  it("should mint a new token and set the owner to the specified address from the upgraded contract", async function () {
    await upgradedNftContract.safeMint(addr1.address, tokenId, URI);

    expect(await upgradedNftContract.ownerOf(tokenId)).to.equal(addr1.address);
    expect(await upgradedNftContract.tokenURI(tokenId)).to.equal(URI);
  });
});
