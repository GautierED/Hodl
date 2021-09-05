require('dotenv').config();
Web3 = require('web3')

const API_URL = process.env.API_BSC_TESTNET;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const web3 = new Web3(API_URL);

const { resolveProperties } = require('@ethersproject/properties');
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

      const transactionReceipt = await signTheTransaction(tx);
      console.log(transactionReceipt.blockNumber);
}

async function withdraw() {
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'gas': 8000000, 
      'data': hodlContract.methods.withdraw().encodeABI()
    };

    const transactionReceipt = await signTheTransaction(tx); 
    console.log(transactionReceipt);  
}

async function setTimeOfLock(time) {
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'gas': 8000000, 
      'data': hodlContract.methods.setTimeOfLock(time).encodeABI()
    };

    const transactionReceipt = await signTheTransaction(tx); 
    console.log(transactionReceipt);
}

async function signTheTransaction(tx) {
  try{
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const hash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return hash;
  }
  catch(err) {
    return err;
  }
}  

async function getEvent(hash, event) {
  try{
    var receipt = await web3.eth.getTransactionReceipt(hash);
    const events = await hodlContract.getPastEvents(event, {fromBlock: receipt.blockNumber, toBlock: receipt.blockNumber});
    console.log(events);
  }
  catch(err) {
    console.log("Something went wrong");
  }
}  

async function main() {
    
    //await withdraw();

    //const message = await hodlContract.methods.balance().call();
    //console.log("Your balance is : " + message + " wei / " + (message/(10 ** 18)) + " ethereum");

    await deposit("0.01");

    //await setTimeOfLock("3600");

    //const message = await hodlContract.methods.timeOfUnlock().call();
    //console.log("Your time of lock is : " + message);

    //getEvent('0x486ecffa7e78b78b5414843258a0ed1d68465fd9fbb2d89c0b2daa8bf6ed1d39', 'fundsDeposited');
}

main();

