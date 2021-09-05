require('dotenv').config();
Web3 = require('web3')

const API_URL = process.env.API_BSC_TESTNET_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const web3 = new Web3(API_URL);

const contract = require("../artifacts/contracts/Hodl.sol/Hodl.json");
const contractAddress = "0x7d1DB53B7e4f31d7018edcFA7045fD68F58A5175";
const hodlContract = new web3.eth.Contract(contract.abi, contractAddress);

async function deposit(amount) {
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'gas': 8000000, 
        'data': hodlContract.methods.deposit().encodeABI(),
        'value': web3.utils.toHex(web3.utils.toWei(amount, "ether"))
      };

      signTheTransaction(tx);
}

async function withdraw() {
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'gas': 8000000, 
      'data': hodlContract.methods.withdraw().encodeABI()
    };

    signTheTransaction(tx);   
}

async function setTimeOfLock(time) {
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'gas': 8000000, 
      'data': hodlContract.methods.setTimeOfLock(time).encodeABI()
    };

    signTheTransaction(tx); 
}

async function signTheTransaction(tx) {
  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise.then((signedTx) => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
      if (!err) {
        console.log("The hash of your transaction is: ", hash);
        return hash;
      } else {
        console.log("Something went wrong when submitting your transaction:", err)
      }
    });
  }).catch((err) => {
    console.log("Promise failed:", err);
  });
}

async function getEvent(hash, event) {
  const receiptPromise = web3.eth.getTransactionReceipt(hash);
  receiptPromise.then((receiptReceived) => {
    hodlContract.getPastEvents(event, {fromBlock: receiptReceived.blockNumber, toBlock: receiptReceived.blockNumber}, function(err, event) {
      if (!err) {
        console.log(event);
      } else {
        console.log("Something went wrong", err);
      }
    })
  })
}  

async function main() {
    
    //await withdraw();

    const message = await hodlContract.methods.balance().call();
    console.log("Your balance is : " + message + " wei / " + (message/(10 ** 18)) + " ethereum");

    //await deposit("0.01");

    //await setTimeOfLock("3600");

    //const message = await hodlContract.methods.timeOfUnlock().call();
    //console.log("Your time of lock is : " + message);

    //getEvent('0x486ecffa7e78b78b5414843258a0ed1d68465fd9fbb2d89c0b2daa8bf6ed1d39', 'fundsDeposited');
}

main();

