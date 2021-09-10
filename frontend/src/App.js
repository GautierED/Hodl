import React, { useState, useEffect } from 'react';
import Hodl from './Hodl.json';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';

const bscChainId = '97';
const contractAddress = '0x7d1DB53B7e4f31d7018edcFA7045fD68F58A5175';

function App() {
  const [account, setAccount] = useState(undefined);
  const [chainId, setChainId] = useState(undefined);
  const [hodl, setHodl] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [dateOfUnlock, setDateOfUnlock] = useState(undefined);
  const [metamaskInstalled, setMetamaskInstalled] = useState(undefined);
  const [lockPeriodDefined, setLockPeriodDefined] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const provider = await detectEthereumProvider();
      if(provider) {
        setMetamaskInstalled(1);
        const hodl = await loadContractData();
        if(hodl){
          const balance = await hodl.balance();
          let timeOfUnlock = await hodl.timeOfUnlock();
          if(parseInt(timeOfUnlock._hex, 16)){ setLockPeriodDefined(1); } else { setLockPeriodDefined(0); }
          var dateOfUnlock = new Date(parseInt(timeOfUnlock._hex, 16) *1000);
          setHodl(hodl);
          setBalance(balance);
          setDateOfUnlock(dateOfUnlock.toLocaleString());
        }
      }
    };  
    init();
  }, []);

  async function loadContractData() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    let provider = await detectEthereumProvider();
    var chainId = await provider.request({ method: 'eth_chainId' });
    chainId = String(parseInt(chainId, 16));
    setChainId(chainId);
    if(chainId === bscChainId){
      provider = new ethers.providers.Web3Provider(provider);
      const signer = provider.getSigner();
      const hodl = new Contract(
        contractAddress,
        Hodl.abi,
        signer
      );
      return hodl;
    } 
  };

  const getBalance = async e => {
    e.preventDefault();
    const balance = await hodl.balance();
    setBalance(balance);
  };

  const getTimeOfUnlock = async e => {
    e.preventDefault();
    let timeOfUnlock = await hodl.timeOfUnlock();
    var dateOfUnlock = new Date(parseInt(timeOfUnlock._hex, 16) *1000);
    setDateOfUnlock(dateOfUnlock.toLocaleString());
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

  window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
  window.ethereum.on('accountsChanged', (_account) => window.location.reload());

  console.log(lockPeriodDefined);

  if(metamaskInstalled) {

    if(!chainId){ 
      return ('Connect Wallet');
    }

    if (chainId === bscChainId){
      if (lockPeriodDefined) {

        return (

          <div className='container'>
            <div className='row'>

              <div className='col-sm-6'>
                <h2>Account :</h2>
                <p>{account}</p>
              </div>

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
                <h2>Date of unlock :</h2>
                <p>{dateOfUnlock}</p>
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
                <h2>Deposit</h2>
                <form className="form-inline" onSubmit={e => deposit(e)}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Amount (BNB)"
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

      } else {

        return (

          <div className='container'>
            <div className='row'>

              <div className='col-sm-6'>
                <h2>Account :</h2>
                <p>{account}</p>
              </div>

              <div className='col-sm-6'>
                <h2>Set time of lock</h2>
                <form className="form-inline" onSubmit={e => setTimeOfLock(e)}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Time (seconds)"
                  />
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