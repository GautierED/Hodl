require('dotenv').config();

const API_URL = process.env.API_ROPSTEN;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/Hodl.sol/Hodl.json");
const contractAddress = "0x39307A8373c36cB87F547BBed1BD1ADB4280eC8B";
const hodlContract = new web3.eth.Contract(contract.abi, contractAddress);

async function deposit(amount) {
     const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); 
     //const gasEstimate = await hodlContract.methods.withdraw().estimateGas();
     const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 8000000, 
        'maxFeePerGas': 8000000000,
        'data': hodlContract.methods.deposit().encodeABI(),
        'value': web3.utils.toHex(web3.utils.toWei(amount, "ether"))
      };
      
      const transactionReceipt = await signTheTransaction(tx);
      console.log(transactionReceipt.blockNumber);
}

async function withdraw() {
   const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); 
   //const gasEstimate = await hodlContract.methods.withdraw().estimateGas();
   const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': 8000000, 
      'maxFeePerGas': 80000000000,
      'data': hodlContract.methods.withdraw().encodeABI()
    };
    
    const transactionReceipt = await signTheTransaction(tx); 
    console.log(transactionReceipt);  
}

async function setTimeOfLock(time) {
   const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); 
   //const gasEstimate = await hodlContract.methods.deposit().estimateGas();
   const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': 8000000, 
      'maxFeePerGas': 80000000000,
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
    
  await withdraw();

  //const message = await hodlContract.methods.balance().call();
  //console.log("Your balance is : " + message + " wei / " + (message/(10 ** 18)) + " bnb");

  //await deposit("0.01");

  //await setTimeOfLock("3600");

  //const message = await hodlContract.methods.timeOfUnlock().call();
  //console.log("Your time of lock is : " + message);

  //getEvent('0x486ecffa7e78b78b5414843258a0ed1d68465fd9fbb2d89c0b2daa8bf6ed1d39', 'fundsDeposited');
}

main();

