import React, { useState, useEffect } from 'react';
import Web3 from 'web3'
import Hodl from './Hodl.json';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';

const bscChainId = '97';
const contractAddress = '0x7d1DB53B7e4f31d7018edcFA7045fD68F58A5175';

function App() {
  const [metamaskInstalled, setMetamaskInstalled] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [chainId, setChainId] = useState(undefined);
  const [hodl, setHodl] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [timeOfUnlock, setTimeOfUnlock] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const metamaskInstalled = typeof window.ethereum !== 'undefined';
      setMetamaskInstalled(metamaskInstalled);
      if(metamaskInstalled) {
        await loadWeb3();
        const hodl = await loadBlockchainData();
        const balance = await hodl.balance();
        const timeOfUnlock = await hodl.timeOfUnlock();
        setHodl(hodl);
        setBalance(balance);
        setTimeOfUnlock(parseInt(timeOfUnlock._hex, 16));
      }
    };  
    init();
  }, []);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
  }

  async function loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    let provider = await detectEthereumProvider();

    if(provider) {
      var _chainId = await provider.request({ method: 'eth_chainId' });
      _chainId = String(parseInt(_chainId, 16));
      setChainId(_chainId);

      if(_chainId === bscChainId){
        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();
        const _hodl = new Contract(
          contractAddress,
          Hodl.abi,
          signer
        );
        return _hodl;
      }
    }  
  };

  const getBalance = async e => {
    e.preventDefault();
    const balance = await hodl.balance();
    setBalance(balance);
  };

  const getTimeOfUnlock = async e => {
    e.preventDefault();
    const timeOfUnlock = await hodl.timeOfUnlock();
    setTimeOfUnlock(parseInt(timeOfUnlock._hex, 16));
  };

  const setTimeOfLock = async e => {
    e.preventDefault();
    const time = e.target.elements[0].value;
    const tx = await hodl.setTimeOfLock(time);
    await tx.wait();
  };

  const deposit = async e => {
    e.preventDefault();
    const amount = e.target.elements[0].value;

    let overrides = {
      value: ethers.utils.parseEther(String(amount))
    }

    const tx = await hodl.deposit(overrides);
    await tx.wait();
  };

  const withdraw = async e => {
    e.preventDefault();
    const tx = await hodl.withdraw();
    await tx.wait();
  };

  if(metamaskInstalled) {
    if (chainId === bscChainId){
      return (

        <div className='container'>
          <div className='row'>

            <div className='col-sm-6'>
              <h2>Token locked :</h2>
              <p>{(balance/(10 ** 18)).toString() + " BNB"}</p>
            </div>

            <div className='col-sm-6'>
              <form className="form-inline" onSubmit={e => getBalance(e)}>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Refresh
                </button>
              </form>
            </div>

            <div className='col-sm-6'>
              <h2>Time of unlock :</h2>
              <p>{timeOfUnlock }</p>
            </div>

            <div className='col-sm-6'>
              <form className="form-inline" onSubmit={e => getTimeOfUnlock(e)}>
              <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Refresh
                </button>
              </form>
              </div>

            <div className='col-sm-6'>
              <h2>Set time of lock</h2>
              <form className="form-inline" onSubmit={e => setTimeOfLock(e)}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Time of lock"
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </form>
            </div>

            <div className='col-sm-6'>
              <h2>Deposit</h2>
              <form className="form-inline" onSubmit={e => deposit(e)}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Amount"
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </form>
            </div>

            <div className='col-sm-6'>
              <h2>Withdraw</h2>
              <form className="form-inline" onSubmit={e => withdraw(e)}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </form>
            </div>

          </div>
        </div>

      );
    }
    else {
      return ('Switch network');
    }
  }
  else {
    return('Install Metamask');
  }
}  

export default App;