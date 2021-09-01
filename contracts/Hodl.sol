pragma solidity ^0.8.4;

contract Hodl {
    
    
    address public owner;
    uint public balance;
    
    modifier isOwner {
        require(msg.sender == owner);
        _;
    }
    
    
    constructor () {
        owner = msg.sender;
    }
    
    function deposit() isOwner external payable {
        balance += msg.value;
    }
    
    function withdraw() isOwner public {
        payable(msg.sender).transfer(balance);
    }
    
}