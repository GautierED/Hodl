require('dotenv').config();

const API_URL = process.env.API_ROPSTEN;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/Hodl.sol/Hodl.json");
const contractAddress = "0x905c9Be321Ecd39550Cb9Af36974e67dAE9D971C";
const hodlContract = new web3.eth.Contract(contract.abi, contractAddress);

async function deposit(amount) {
     const gasEstimate = await hodlContract.methods.withdraw().estimateGas();
     const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); 
     const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': gasEstimate, 
        'maxFeePerGas': 8000000000,
        'data': hodlContract.methods.deposit().encodeABI(),
        'value': web3.utils.toHex(web3.utils.toWei(amount, "ether"))
      };
      await signTransaction(tx);
}

async function withdraw() {
   const gasEstimate = await hodlContract.methods.withdraw().estimateGas();
   const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); 
   const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': gasEstimate, 
      'maxFeePerGas': 80000000000,
      'data': hodlContract.methods.withdraw().encodeABI()
    };
    await signTransaction(tx);
}

async function setTimeOfLock(time) {
   const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); 
   const gasEstimate = await hodlContract.methods.deposit().estimateGas();
   const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': gasEstimate, 
      'maxFeePerGas': 80000000000,
      'data': hodlContract.methods.setTimeOfLock(time).encodeABI()
    };
    await signTransaction(tx);
}

async function signTransaction(tx) {
  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise.then((signedTx) => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
      if (!err) {
        console.log("The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
      } else {
        console.log("Something went wrong when submitting your transaction:", err)
      }
    });
  }).catch((err) => {
    console.log("Promise failed:", err);
  });
}

async function main() {
    
    //await withdraw();
    //await hodlContract.events.fundsWithdrawn;

    //const message = await hodlContract.methods.balance().call();
    //console.log("Your balance is : " + message + " wei / " + (message/(10 ** 18)) + " ethereum");

    //await deposit("1");
    //const receipt = await hodlContract.methods.emitEvent();
    //console.log(receipt.receipt);

    await setTimeOfLock("6000");

    //const message = await hodlContract.methods.timeOfUnlock().call();
    //console.log("Your time of lock is : " + message);


    //const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); // get latest nonce
    //console.log(nonce);
}

main();

