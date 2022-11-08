// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Document.sol";

contract DocumentFactory {
    mapping (address=>Document[]) addressToDocument;

    function createDoc(string memory name, string memory desc, string memory ipfs, string memory ownerName) public returns (Document){
        Document newDocument = new Document(name, desc, ipfs, msg.sender, ownerName);
        addressToDocument[msg.sender].push(newDocument);
        return newDocument;
    }

    function getDocuments(address account) public view returns (Document[] memory){
        return addressToDocument[account];
    }

    function giveAccessToDoc(string memory signer_name, address signer, Document Doc) public {
        addressToDocument[signer].push(Doc);
        Doc.addSigner(signer_name, signer, msg.sender);
    }
}