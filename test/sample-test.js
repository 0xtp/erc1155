const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SafuuX", function () {

  before(async function(){
    this.accounts = await ethers.getSigners();

    const SafuuX = await ethers.getContractFactory("SafuuX");
    this.safuux = await SafuuX.deploy("Safuu", "Safuu", "0x77e700f03437c8e81143fabca89ab927d28d5207bf6ed00aa9b4d8ed5cdd6f7c");
    await this.safuux.deployed();
  })
  
  
  it("Should check name and symbol", async function(){
    const tokenName = await this.safuux.name();
    const tokenSymbol = await this.safuux.symbol();
    console.log(this.accounts[0].address);
    expect(tokenName).to.equal("Safuu");
    expect(tokenSymbol).to.equal("Safuu");
  })

  it("Should mint Full Node tokens", async function () {

    //Check balance before mint
    const balBefore = await this.safuux.balanceOf(this.accounts[0].address, 1);
    expect(balBefore.toNumber()).to.equal(0);
    
    //Mint Full Node with supply "1"
    const tx = await this.safuux.mintFullNode(1, ["0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0","0x7e0eefeb2d8740528b8f598997a219669f0842302d3c573e9bb7262be3387e63","0xf4ca8532861558e29f9858a3804245bb30f0303cc71e4192e41546237b6ce58b"]);

    //Check balance after mint
    const balAfter = await this.safuux.balanceOf(this.accounts[0].address, 1);
    expect(balAfter.toNumber()).to.equal(1);

  });

  it("Should mint Lite Node tokens", async function () {

    //Check balance before mint
    const balBefore = await this.safuux.balanceOf(this.accounts[0].address, 2);
    expect(balBefore.toNumber()).to.equal(0);
    
    //Mint Lite Node with supply "5"
    const tx = await this.safuux.mintLiteNode(5, ["0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0","0x7e0eefeb2d8740528b8f598997a219669f0842302d3c573e9bb7262be3387e63","0xf4ca8532861558e29f9858a3804245bb30f0303cc71e4192e41546237b6ce58b"]);

    //Check balance after mint
    const balAfter = await this.safuux.balanceOf(this.accounts[0].address, 2);
    expect(balAfter.toNumber()).to.equal(5);

  });
});
