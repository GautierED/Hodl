import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';
import Hodl from './Hodl.json';

const contractAddress = "0x7d1DB53B7e4f31d7018edcFA7045fD68F58A5175";

const getWallet = () =>
  new Promise( async (resolve, reject) => {
    let provider = await detectEthereumProvider();
    if(provider) {
      await provider.request({ method: 'eth_requestAccounts' });
      const networkId = await provider.request({ method: 'net_version' })
      provider = new ethers.providers.Web3Provider(provider);
      const signer = provider.getSigner();
      const hodl = new Contract(
        //Hodl.networks[networkId].address,
        contractAddress,
        Hodl.abi,
        signer
      );
      resolve({hodl});
      return;
    }
    reject('Install Metamask');
  });

export default getWallet;