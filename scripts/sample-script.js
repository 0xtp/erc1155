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

  // We get the contract to deploy
  const SafuuX = await hre.ethers.getContractFactory("SafuuX");
  const safuux = await SafuuX.deploy("Safuu", "Safuu", "0x77e700f03437c8e81143fabca89ab927d28d5207bf6ed00aa9b4d8ed5cdd6f7c", "0x77e700f03437c8e81143fabca89ab927d28d5207bf6ed00aa9b4d8ed5cdd6f7c", "ipfs://ipfs/....");

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
