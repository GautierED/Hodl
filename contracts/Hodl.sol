pragma solidity ^0.8.4;

//let you define a time of lock and deposit your token during that time
//you will not be able to withdraw them before the time of unlock

contract Hodl {
    
    
    address public owner;
    uint public balance;
    uint public timeOfUnlock;
    
    modifier isOwner {
        require(msg.sender == owner);
        _;
    }
    
    modifier isTimeOfUnlockNull {
        require(timeOfUnlock == 0);
        _;
    }
    
    modifier isTimeOfDepositOK {
        require(block.timestamp < timeOfUnlock);
        _;
    }
    
    modifier isTimeOfWithdrawOK {
        require(block.timestamp > timeOfUnlock);
        _;
    }
    
    constructor () {
        owner = msg.sender;
    }
    
    function setTimeOfLock(uint time) isOwner isTimeOfUnlockNull public {
        timeOfUnlock = block.timestamp + time;
    }
    
    function deposit() isOwner isTimeOfDepositOK external payable {
        balance += msg.value;
    }
    
    function withdraw() isOwner isTimeOfWithdrawOK public {
        payable(msg.sender).transfer(balance);
        balance = 0;
    }
    
}