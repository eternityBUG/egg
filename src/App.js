import React, {useState, useEffect} from 'react';
import {ethers} from "ethers";
import abi from './abi'
import './App.css';

function App() {
  const [ethereum] = useState(window.ethereum || null);
  const [deal, setDeal] = useState(false);
  const [chai, setChai] = useState(false);
  const [provider] = useState(() => {
    return window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null
  });
  const [accounts, setAccounts] = useState([]);
  
  useEffect(async () => {
    if (ethereum) {
      setAccounts(await ethereum.request({method: 'eth_requestAccounts'}));
      setChai(await ethereum.request({ method: 'eth_chainId' }) === ethers.utils.hexValue(97));
  
      ethereum.on('accountsChanged', (acc) => {
        setAccounts(acc);
      });
  
      ethereum.on('chainChanged', (chainId) => {
        setChai(chainId === ethers.utils.hexValue(97));
      });
  
    }
  }, [ethereum])
  
  const link = () => {
    if (provider) {
      ethereum.request({method: 'eth_requestAccounts'});
    } else {
      window.location.href = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
    }
  }
  
  const open = async () => {
    if (!accounts.length) {
      await ethereum.request({method: 'eth_requestAccounts'});
    }
    if (!deal && chai) {
      setDeal(true);
      const contract = abi['EGG'];
      const myContract = new ethers.Contract(contract.address, contract.abi, provider);
      const signer = provider.getSigner()
      const daiWithSigner = myContract.connect(signer);
      try {
        const tx = await daiWithSigner.openEgg({
          value: ethers.utils.parseEther("0.0001")
        });
        console.log(tx);
      } catch (e) {}
      setDeal(false);
    }
  }
  
  return (
    <div className="App">
      <div className="button" onClick={link}>{accounts[0] ? accounts[0] : provider ? "Link Wallet" : "Install MetaMask" }</div>
      <img className="eggImg" src={require('./egg.png')} alt=''/>
      <div className={!deal && chai ? 'button' : 'DButton'} onClick={open}>{deal ? 'Transaction processing' : 'Open EGG'}</div>
      <div className="errText">{chai ? '' : 'Please link to Binance Smart Chain Testnet'}</div>
    </div>
  );
}

export default App;
