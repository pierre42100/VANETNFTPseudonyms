// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeProvider {
    address private _owner;
    uint256 private _time;

    constructor(uint256 time) {
        _time = time;
        _owner = msg.sender;
    }

    function set(uint256 time) public {
        require(msg.sender == _owner, "Only the owner can update the time!");

        _time = time;
    }

    function getTime() public view returns (uint256) {
        return _time;
    }
}
