require('dotenv').config();
Web3 = require('web3')

const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

//Binance smart chain 
// mainnet 
//const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
// testnet
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

const contract = require("../artifacts/contracts/Hodl.sol/Hodl.json");
const contractAddress = "0x7d1DB53B7e4f31d7018edcFA7045fD68F58A5175";
const hodlContract = new web3.eth.Contract(contract.abi, contractAddress);

async function deposit(amount) {
    //const gasEstimate = await hodlContract.methods.deposit().estimateGas();

     // Create the transaction
     const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'chainId': 97,
        'gas': 8000000, 
        'maxFeePerGas': 8000000000,
        'data': hodlContract.methods.deposit().encodeABI(),
        'value': web3.utils.toHex(web3.utils.toWei(amount, "ether"))
      };

    // Sign the transaction
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

async function withdraw() {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); // get latest nonce
  //const gasEstimate = await hodlContract.methods.deposit().estimateGas();

   // Create the transaction
   const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': 8000000, 
      'maxFeePerGas': 80000000000,
      'data': hodlContract.methods.withdraw().encodeABI()
    };

  // Sign the transaction
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

async function setTimeOfUnlock(time) {

   const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'gas': 8000000, 
      'maxFeePerGas': 80000000000,
      'data': hodlContract.methods.setTimeOfLock(time).encodeABI()
    };

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

    //const message = await hodlContract.methods.balance().call();
    //console.log("Your balance is : " + message + " wei / " + (message/(10 ** 18)) + " ethereum");

    //await deposit("1");

    await setTimeOfUnlock("200");

    //const message = await hodlContract.methods.timeOfUnlock().call();
    //console.log("Your time of lock is : " + message);
    
}

main();

