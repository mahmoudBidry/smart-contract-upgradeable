// const { expect : any } = require("chai");
// const { ethers : any} = require("hardhat");

import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;
import { NFTV2__factory, MyProxy__factory } from "../typechain";

export default function getFunctionABI(artifact: any, functionName: string) {
  const abi = artifact.abi;
  // @ts-ignore
  const functionABI = abi.filter(item => item.type === "function" && item.name === functionName)[0];
  return functionABI;
}


describe("NFTV1", function () {
  let owner : any;
  let addr1: any;
  let tokenId: any;
  let URI: string = "https://gateway.pinata.cloud/ipfs/QmaXdVYjGRscsa87CBk16CsRpZqpkBWH2BeSsKG5xsiAru/1.json"
  let NFTV2Address : string ;
  let MyProxyAddress : string ;
  let ownerInstance : any;
  let addr1Instance : any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const NFTV2 = new NFTV2__factory(owner);

    const NFTV2Contract =  await NFTV2.deploy(addr1.address);

    NFTV2Address = NFTV2Contract.address;

    const NFTV2Interface = new ethers.utils.Interface(NFTV2__factory.abi);

    const initObject = [owner.address]

    const initData = NFTV2Interface.encodeFunctionData("initialize", initObject )

    const MyProxy = new MyProxy__factory(owner);

    const MyProxyContract =  await MyProxy.deploy(NFTV2Address, initData);

    MyProxyAddress = MyProxyContract.address;
    
    ownerInstance = new NFTV2__factory(owner).attach(MyProxyAddress)

    tokenId = 1;

    
  });

  it("should mint a new token and set the owner to the specified address from the upgraded contract", async function () {
    await ownerInstance.safeMint(addr1.address, tokenId, URI);

    expect(await ownerInstance.ownerOf(tokenId)).to.equal(addr1.address);
    expect(await ownerInstance.tokenURI(tokenId)).to.equal(URI);
  });
});
