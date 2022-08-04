// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SafuuX is ERC1155, Ownable {

	string public _name;
  string public _symbol;
  string public _merkleTreeInputURI;
  bool public _isGoldListSaleActive;
  bool public _isWhiteListSaleActive; 
  bytes32 immutable public _goldListMerkleRoot;
  bytes32 immutable public _whiteListMerkleRoot;

  uint256 public FULL_NODE_LIMIT = 500;
  uint256 public LITE_NODE_LIMIT = 1500;
  uint256 public FULL_NODE_CURRENT_SUPPLY;
  uint256 public LITE_NODE_CURRENT_SUPPLY;

  mapping(uint => string) public tokenURI;
  mapping(address => bool) public fullNodeClaimed;
  mapping(address => bool) public liteNodeClaimed;

  constructor(string memory name_, 
              string memory symbol_, 
              bytes32 goldListMerkleRoot_,
              bytes32 whiteListMerkleRoot_,
              string memory merkleTreeInputURI_) ERC1155("") {
    _name = name_;
    _symbol = symbol_;
    _merkleTreeInputURI = merkleTreeInputURI_;
    _goldListMerkleRoot = goldListMerkleRoot_;
    _whiteListMerkleRoot = whiteListMerkleRoot_;
  }

	function mintFullNode(bytes32[] calldata merkleProof) external {
    require(FULL_NODE_CURRENT_SUPPLY + 1 <= FULL_NODE_LIMIT, "Purchase would exceed max Full Node supply");
    require(fullNodeClaimed[msg.sender] == false, "Token already claimed by this address");
    
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    require(_checkEligibility(_whiteListMerkleRoot, merkleProof, leaf) == true, "Address not eligible - Invalid merkle proof");

    FULL_NODE_CURRENT_SUPPLY = FULL_NODE_CURRENT_SUPPLY + 1;
    fullNodeClaimed[msg.sender] = true;
 	  _mint(msg.sender, 1, 1, "");
 	}

  function mintLiteNode(uint _amount, bytes32[] calldata merkleProof) external {
    require(_amount < 6, "Max 5 Lite Node tokens allowed per Whitelist address");
    require(LITE_NODE_CURRENT_SUPPLY + _amount <= LITE_NODE_LIMIT, "Purchase would exceed max Lite Node supply");
    require(liteNodeClaimed[msg.sender] == false, "Token already claimed by this address");
    
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    require(_checkEligibility(_whiteListMerkleRoot, merkleProof, leaf) == true, "Address not eligible - Invalid merkle proof");

    LITE_NODE_CURRENT_SUPPLY = LITE_NODE_CURRENT_SUPPLY + _amount;
    liteNodeClaimed[msg.sender] = true;
 	  _mint(msg.sender, 2, _amount, "");
 	}

  function checkGoldListEligibility(bytes32[] calldata merkleProof) external view returns(bool){
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    bool eligibility = _checkEligibility(_goldListMerkleRoot, merkleProof, leaf);
    return eligibility;
  }

  function checkWhiteListEligibility(bytes32[] calldata merkleProof) external view returns(bool){
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    bool eligibility = _checkEligibility(_whiteListMerkleRoot, merkleProof, leaf);
    return eligibility;
  }

  function _checkEligibility(bytes32 merkleRoot, bytes32[] calldata merkleProof, bytes32 leaf) internal view returns(bool){
    return(MerkleProof.verify(merkleProof, merkleRoot, leaf));
  }

  function getMerkleTreeInputURI() public view returns (string memory) {
    return _merkleTreeInputURI;
  }

  function setGoldListSaleStatus(bool _isActive) external {
		_isGoldListSaleActive = _isActive;
	}

  function setWhiteListSaleStatus(bool _isActive) external {
		_isWhiteListSaleActive = _isActive;
	}

  function burn(uint _id, uint _amount) external {
    _burn(msg.sender, _id, _amount);
  }

  function burnBatch(uint[] memory _ids, uint[] memory _amounts) external {
    _burnBatch(msg.sender, _ids, _amounts);
  }

  function burnForMint(address _from, uint[] memory _burnIds, uint[] memory _burnAmounts, uint[] memory _mintIds, uint[] memory _mintAmounts) external onlyOwner {
    _burnBatch(_from, _burnIds, _burnAmounts);
    _mintBatch(_from, _mintIds, _mintAmounts, "");
  }

  function setURI(uint _id, string memory _uri) external onlyOwner {
    tokenURI[_id] = _uri;
    emit URI(_uri, _id);
  }

  function uri(uint _id) public override view returns (string memory) {
    return tokenURI[_id];
  }

  function name() public view returns (string memory) {
		return _name;
	}

	function symbol() public view returns (string memory) {
		return _symbol;
	}

  function withdrawFunds() public onlyOwner {
		payable(msg.sender).transfer(address(this).balance);
	}

  function withdrawTokens(IERC20 tokenContract, address to, uint256 amount) external onlyOwner {
      tokenContract.transfer(to, amount);
  }
}