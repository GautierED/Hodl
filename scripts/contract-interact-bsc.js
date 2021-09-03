require('dotenv').config();
Web3 = require('web3')

const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

//const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

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

      await signTheTransaction(tx); 
      const latestBlockNumber = await web3.eth.getBlockNumber();
      //block = await web3.eth.getTransactionReceipt(transaction);
      const results = await hodlContract.getPastEvents('fundsDeposited', {fromBlock: latestBlockNumber - 4000});
      console.log(results);
}

async function withdraw() {
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'gas': 8000000, 
      'data': hodlContract.methods.withdraw().encodeABI()
    };

    await signTheTransaction(tx); 
    
}

async function setTimeOfLock(time) {
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'gas': 8000000, 
      'data': hodlContract.methods.setTimeOfLock(time).encodeABI()
    };

    await signTheTransaction(tx); 
}

async function signTheTransaction(tx) {
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

    await deposit("0.1");

    //await setTimeOfLock("3600");

    //const message = await hodlContract.methods.timeOfUnlock().call();
    //console.log("Your time of lock is : " + message);
}

main();

