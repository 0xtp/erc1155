// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const TestERC20 = await hre.ethers.getContractFactory("TestERC20");
  const testERC20 = await TestERC20.deploy();
  await testERC20.deployed();
  console.log("TestERC20 deployed to:", testERC20.address);

  // We get the contract to deploy
  const SafuuX = await hre.ethers.getContractFactory("SafuuX");
  const safuux = await SafuuX.deploy("Safuu", "Safuu", testERC20.address, "0x74a2480e451fb1ec5b00c02140086c04994bc9366824b93aa8b1be2ececf9dcc", "0x74a2480e451fb1ec5b00c02140086c04994bc9366824b93aa8b1be2ececf9dcc", "ipfs://ipfs/....");
  await safuux.deployed();
  console.log("SafuuX deployed to:", safuux.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
