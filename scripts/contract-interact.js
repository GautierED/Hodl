require('dotenv').config();

const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/Hodl.sol/Hodl.json");
const contractAddress = "0x8E7431F40Fa30b4A0303Baad102C78309016Fcc4";
const hodlContract = new web3.eth.Contract(contract.abi, contractAddress);

async function deposit() {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); // get latest nonce
    //const gasEstimate = await hodlContract.methods.deposit().estimateGas();

     // Create the transaction
     const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 8000000, 
        'maxFeePerGas': 8000000000,
        'data': hodlContract.methods.deposit().encodeABI(),
        'value': web3.utils.toHex(web3.utils.toWei("1", "ether"))
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

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

async function main() {
    
    const message = await hodlContract.methods.showBlance.call();
    console.log(JSON.stringify(message, getCircularReplacer()));

    //await deposit();
    
}

main();

