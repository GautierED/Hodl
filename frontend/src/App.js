import React, { useState, useEffect } from 'react';
import getWallet from './metamask.js';
var ethers = require('ethers');

function App() {
  const [hodl, setHodl] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [timeOfUnlock, setTimeOfUnlock] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const { hodl } = await getWallet();
      const balance = await hodl.balance();
      const timeOfUnlock = await hodl.timeOfUnlock();
      setHodl(hodl);
      setBalance(balance);
      setTimeOfUnlock(parseInt(timeOfUnlock._hex, 16));
    };
    init();
  }, []);

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

  if(
    typeof hodl === 'undefined'
    || typeof balance === 'undefined'
  ) {
    return 'Loading...';
  }

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

export default App;