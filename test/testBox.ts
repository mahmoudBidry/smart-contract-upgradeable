
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;
import { BoxV2__factory, MyProxy__factory } from "../typechain";
describe("Box", function() {

  let owner : any;
  let addr1: any;
  let BoxV2Address : string ;
  let MyProxyAddress : string ;
  let ownerInstance : any;
  let addr1Instance : any;

  let BoxV2Simple : any;
  let BoxV2ContractSimple : any;
  let initalValue = 42


  beforeEach(async function(){
    [owner, addr1] = await ethers.getSigners();
    
    const BoxV2 = new BoxV2__factory(owner);

    const BoxV2Contract =  await BoxV2.deploy();

    BoxV2Address = BoxV2Contract.address;

    const BoxV2Interface = new ethers.utils.Interface(BoxV2__factory.abi);

    const initObject = [initalValue]

    const initData = BoxV2Interface.encodeFunctionData("initialize", initObject )

    const MyProxy = new MyProxy__factory(owner);

    const MyProxyContract =  await MyProxy.deploy(BoxV2Address, initData);

    MyProxyAddress = MyProxyContract.address;
    
    ownerInstance = new BoxV2__factory(owner).attach(MyProxyAddress)
    addr1Instance = new BoxV2__factory(addr1).attach(MyProxyAddress)

    // ----------------------------------------------

    BoxV2Simple = await ethers.getContractFactory("BoxV2");
    BoxV2ContractSimple = await BoxV2Simple.deploy();
    await BoxV2ContractSimple.deployed();

  })

  
  it('BoxV2 Contract Upgrade (pass)', async () => {
    let value = await addr1Instance.retrieve();

    expect(value.toString()).to.equal(initalValue.toString());

    await ownerInstance.increment(); //pass

    value = await addr1Instance.retrieve();

    expect(value.toString()).to.equal( (initalValue+1).toString());
  })

  it('BoxV2 Contract Upgrade (revert)', async () => {
    let value = await addr1Instance.retrieve();

    expect(value.toString()).to.equal(initalValue.toString());

    await ownerInstance.decrement(); // revert

    value = await addr1Instance.retrieve();

    expect(value.toString()).to.equal((initalValue-1).toString());
  })
  
  it.only('BoxV2 Contract Simple (pass)', async () => {
    await BoxV2ContractSimple.store(initalValue)

    let value = await BoxV2ContractSimple.retrieve()

    expect(value.toString()).to.equal(initalValue.toString());

    await BoxV2ContractSimple.decrement(); // pass

    value = await BoxV2ContractSimple.retrieve()

    expect(value.toString()).to.equal((initalValue - 1).toString());

  })


  it.only('BoxV2 Contract Simple (revert)', async () => {
    await BoxV2ContractSimple.store(initalValue)

    let value = await BoxV2ContractSimple.retrieve()

    expect(value.toString()).to.equal(initalValue.toString());

    await BoxV2ContractSimple.increment(); // revert

    value = await BoxV2ContractSimple.retrieve()

    expect(value.toString()).to.equal((initalValue + 1).toString());


  })


});