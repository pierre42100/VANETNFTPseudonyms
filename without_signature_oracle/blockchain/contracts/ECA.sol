// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract ECA {
    address _owner;

    // True : if challenge is available
    // False : otherwise (challenge)
    mapping (bytes32 => bool) _codes_hash;

    event CodeAccepted(bool accepted);

    constructor() {
        _owner = msg.sender;
    }

    // Check and consume activation code
    function checkCode(
        string memory code
    ) public returns (bool) {
        bytes32 code_hash = keccak256(abi.encodePacked(code));

        if (!_codes_hash[code_hash]) {
            emit CodeAccepted(false);
            return false;
        }

        _codes_hash[code_hash] = false;
        emit CodeAccepted(true);
        return true;
    }

    // Push new codes to the SC memory
    function addCode(bytes32[] memory codes) public {
        require(msg.sender == _owner, "Only the owner can push new codes to this SC!");

        for (uint i=0; i< codes.length; i++) {
            _codes_hash[codes[i]] = true;
        }
    }
}
