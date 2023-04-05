//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ECA.sol";
import "./TimeProvider.sol";

contract VcertNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address private _owner;

    address private _eca_address;
    address private _time_provider_address;

    mapping(uint256 => string) _signatures;

    event NFTMinted(uint256 indexed _id);
    event CertificateAvailable(uint256 indexed _id);

    constructor(
        address eca_address,
        address time_provider_address
    ) ERC721("VcertNFT", "NFT") {
        _owner = msg.sender;
        _eca_address = eca_address;
        _time_provider_address = time_provider_address;
    }

    function mintNFT(
        string memory code,
        string memory pubkey,
        uint256 startTime
    ) public returns (uint256) {
        _tokenIds.increment();

        // Check the request code
        require(
            ECA(_eca_address).checkCode(code),
            "The code has been rejected"
        );

        // The certificate is valid for one day
        uint256 endTime = startTime + 3600 * 24;

        // Check start time (with a 3min frame)
        uint256 currTime = TimeProvider(_time_provider_address).getTime();
        require(
            currTime - 180 < startTime,
            "Cannot issue certificates for a past time!"
        );
        require(
            currTime + 3600 * 24 * 30 > startTime,
            "Cannot issue certificates that begins so far in the future!"
        );

        string memory certificate = string.concat(
            pubkey,
            "#",
            Strings.toString(startTime),
            "#",
            Strings.toString(endTime)
        );

        uint256 nftId = _tokenIds.current();
        _mint(msg.sender, nftId);
        _setTokenURI(nftId, certificate);

        emit NFTMinted(nftId);
        return nftId;
    }

    function setSignature(string memory signature, uint256 nftID) public {
        require(
            msg.sender == _owner,
            "Only the owner can set signature to NFT!"
        );

        require(
            nftID <= _tokenIds.current(),
            "Can not sign NFT that do not exist yet!"
        );

        require(
            bytes(_signatures[nftID]).length == 0,
            "Certificate has already been set!"
        );

        _signatures[nftID] = signature;

        emit CertificateAvailable(nftID);
    }

    function getSignature(uint256 nftID) public view returns (string memory) {
        require(
            bytes(_signatures[nftID]).length > 0,
            "Certificate is not available yet!"
        );

        return _signatures[nftID];
    }
}
