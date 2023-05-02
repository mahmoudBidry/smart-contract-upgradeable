const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Box", function() {

  let Box, BoxContract, BoxV2, BoxV2Contract;

  beforeEach(async function(){
    //Box contract
    Box = await ethers.getContractFactory("Box");

    BoxContract = await upgrades.deployProxy(Box, [42], { initializer: 'store' });
    await BoxContract.deployed();

    //Box contract upgraded
    BoxV2 = await ethers.getContractFactory("BoxV2");
    BoxV2Contract = await upgrades.upgradeProxy(BoxContract.address, BoxV2);
  
  })

  it('Box Contract', async () => {

    const value = await BoxContract.retrieve()
    expect(value.toString()).to.equal('42');

  });

  it.only('BoxV2 Contract Upgrade', async () => {
    await BoxV2Contract.increment()
    const value = await BoxV2Contract.retrieve()
    expect(value.toString()).to.equal('43');
  })
});