// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

error InvalidMintValue();
error ETHTransferFailed();
error InsufficientETHAmount();

contract UNFT is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;

    uint public mintValue;

    Counters.Counter private _tokenIds;

    event UpdateMintValue(uint newValue);
    event Mint(address indexed user, uint tokenId);

    constructor(uint _mintValue) ERC721("TestNFT", "UNFT") {
        updateMintValue(_mintValue);
    }

    function updateMintValue(uint _mintValue) public onlyOwner {
        if (_mintValue == 0) revert InvalidMintValue();
        mintValue = _mintValue;

        emit UpdateMintValue(mintValue);
    }

    function mint(
        string calldata metaURI
    ) external payable returns (uint tokenId) {
        if (msg.value < mintValue) revert InsufficientETHAmount();

        _tokenIds.increment();
        tokenId = _tokenIds.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, metaURI);

        if (msg.value > mintValue) {
            (bool success, ) = payable(msg.sender).call{
                value: msg.value - mintValue
            }("");
            if (!success) revert ETHTransferFailed();
        }

        emit Mint(msg.sender, tokenId);
    }

    function withdrawFund(address wallet) external onlyOwner {
        uint currentBalance = address(this).balance;
        if (currentBalance != 0) {
            (bool success, ) = payable(wallet).call{value: currentBalance}("");
            if (!success) revert ETHTransferFailed();
        }
    }
}
