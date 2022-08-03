const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

let allowListAddresses = [
"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
"0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
"0x90F79bf6EB2c4f870365E785982E1f101E93b906",
"0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"]

const leafNodes = allowListAddresses.map(address => keccak256(address));
const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs : true});

const address = keccak256("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
const merkleProof = merkleTree.getHexProof(address)

const merkleRoot = merkleTree.getRoot().toString('hex');

console.log("Root - " + merkleRoot)
console.log(merkleProof)

console.log(merkleTree.verify(merkleProof, address, merkleRoot)) // true

