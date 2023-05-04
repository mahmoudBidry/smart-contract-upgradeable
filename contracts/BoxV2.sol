// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


contract BoxV2 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 private _value;

    // address private immutable __self = address(this);

    // modifier onlyProxy() {
    //     require(address(this) != __self, "Function must be called through delegatecall");
    //     require(_getImplementation() == __self, "Function must be called through active proxy");
    //     _;
    // }

    // Emitted when the stored value changes
    event ValueChanged(uint256 value);

    constructor() {
        _disableInitializers();
    }

    function store(uint256 value) public{
        _value = value;
        emit ValueChanged(value);
    }

    function retrieve() public view returns (uint256) {
        return _value;
    }

    function increment() public onlyProxy  {
        _value = _value + 1;
        emit ValueChanged(_value);
    }

    function decrement() public notDelegated {
        _value = _value - 1;
        emit ValueChanged(_value);
    }


    function initialize(uint256 value) initializer public {
        __Ownable_init();
        __UUPSUpgradeable_init();
        _value = value;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}
