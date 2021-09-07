import React, { useState, useEffect } from 'react';
import getWallet from './metamask.js';

function App() {
  const [hodl, setHodl] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const { hodl } = await getWallet();
      const balance = await hodl.balance();
      setHodl(hodl);
      setBalance(balance);
    };
    init();
  }, []);

  const getBalance = async e => {
    e.preventDefault();
    const balance = await hodl.balance();
    setBalance(balance);
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
          <h2>Balance :</h2>
          <p>{balance.toString()}</p>
        </div>

        <div className='col-sm-6'>
          <h2>Get balance</h2>
          <form className="form-inline" onSubmit={e => getBalance(e)}>
            
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