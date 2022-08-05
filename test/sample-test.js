const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SafuuX", function () {

  before(async function () {
    this.accounts = await ethers.getSigners();

    const TestERC20 = await ethers.getContractFactory("TestERC20");
    this.testERC20 = await TestERC20.deploy();
    await this.testERC20.deployed();

    const SafuuX = await ethers.getContractFactory("SafuuX");
    this.safuux = await SafuuX.deploy("Safuu", "Safuu", this.testERC20.address, "0x74a2480e451fb1ec5b00c02140086c04994bc9366824b93aa8b1be2ececf9dcc", "0x74a2480e451fb1ec5b00c02140086c04994bc9366824b93aa8b1be2ececf9dcc", "ipfs://ipfs/....");
    await this.safuux.deployed();

    console.log("Account -", this.accounts[0].address);
  })

  it("Should check name and symbol", async function () {
    const tokenName = await this.safuux.name();
    const tokenSymbol = await this.safuux.symbol();
    expect(tokenName).to.equal("Safuu");
    expect(tokenSymbol).to.equal("Safuu");
  })

  it("Should enable GoldList mint", async function () {
    const saleStatus = this.safuux.setGoldListSaleStatus(true);
    expect(await this.safuux._isGoldListSaleActive()).to.equal(true);
  })

  it("Should approve TestERC20 token", async function () {
    this.testERC20.approve(this.safuux.address, 1000000000000000);
  })

  it("Should mint from GoldList", async function () {

    //Check balance before mint
    const fullNodeBalBefore = await this.safuux.balanceOf(this.accounts[0].address, 1);
    const liteNodeBalBefore = await this.safuux.balanceOf(this.accounts[0].address, 2);
    
    expect(fullNodeBalBefore.toNumber()).to.equal(0);
    expect(liteNodeBalBefore.toNumber()).to.equal(0);

    //Mint 1 Full Node and 3 Lite Nodes
    const tx = await this.safuux.mintGoldList(1, 3, ["0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229", "0x343750465941b29921f50a28e0e43050e5e1c2611a3ea8d7fe1001090d5e1436", "0x28ee50ccca7572e60f382e915d3cc323c3cb713b263673ba830ab179d0e5d57f"]);

    //Check balance after mint
    const fullNodeBalAfter = await this.safuux.balanceOf(this.accounts[0].address, 1);
    const liteNodeBalAfter = await this.safuux.balanceOf(this.accounts[0].address, 2);
    
    expect(fullNodeBalAfter.toNumber()).to.equal(1);
    expect(liteNodeBalAfter.toNumber()).to.equal(3);

  });

  it("Should NOT mint from Whitelist while GoldList is active only", async function () {
    await expect(this.safuux.mintWhiteList(0, 2, ["0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229", "0x343750465941b29921f50a28e0e43050e5e1c2611a3ea8d7fe1001090d5e1436", "0x28ee50ccca7572e60f382e915d3cc323c3cb713b263673ba830ab179d0e5d57f"]))
    .to.be.revertedWith("WhiteList sale not active")
  });

  it("Should enable WhiteList mint", async function () {
    const saleStatus = this.safuux.setWhiteListSaleStatus(true);
    expect(await this.safuux._isWhiteListSaleActive()).to.equal(true);
  })

  it("Should mint from WhiteList", async function () {

    //Check balance before mint
    const fullNodeBalBefore = await this.safuux.balanceOf(this.accounts[0].address, 1);
    const liteNodeBalBefore = await this.safuux.balanceOf(this.accounts[0].address, 2);
    
    expect(fullNodeBalBefore.toNumber()).to.equal(1);
    expect(liteNodeBalBefore.toNumber()).to.equal(3);

   //Mint 0 Full Node and 2 Lite Nodes
   const tx = await this.safuux.mintWhiteList(0, 2, ["0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229", "0x343750465941b29921f50a28e0e43050e5e1c2611a3ea8d7fe1001090d5e1436", "0x28ee50ccca7572e60f382e915d3cc323c3cb713b263673ba830ab179d0e5d57f"]);

   //Check balance after mint
   const fullNodeBalAfter = await this.safuux.balanceOf(this.accounts[0].address, 1);
   const liteNodeBalAfter = await this.safuux.balanceOf(this.accounts[0].address, 2);
   
   expect(fullNodeBalAfter.toNumber()).to.equal(1);
   expect(liteNodeBalAfter.toNumber()).to.equal(5);

  });
});
