import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';
import Hodl from './Hodl.json';

const contractAddress = "0x7d1DB53B7e4f31d7018edcFA7045fD68F58A5175";
const binanceTestnetChainId = "97";

const getWallet = () =>
new Promise( async (resolve, reject) => {
  let provider = await detectEthereumProvider();
  if(provider) {
    var chainId = await provider.request({ method: 'eth_chainId' });
    chainId = String(parseInt(chainId, 16));
    if(chainId === binanceTestnetChainId) {
      provider = new ethers.providers.Web3Provider(provider);
      const signer = provider.getSigner();
      const hodl = new Contract(
        contractAddress,
        Hodl.abi,
        signer
      );
      resolve({hodl});
      return;
    } reject ('Switch Network');  
  }
  reject('Install Metamask');
});

export default getWallet;