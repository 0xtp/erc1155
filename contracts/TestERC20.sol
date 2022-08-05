// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20 {

    constructor(
    ) ERC20("Test", "TEST") {
        _mint(msg.sender, 100000);
    }

    function mint() external{
        _mint(msg.sender, 10000);
    }
}