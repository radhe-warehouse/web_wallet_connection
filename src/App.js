import React, { useState, useEffect } from 'react';
import { BrowserProvider } from "ethers";

const WALLET_TYPES = {
  METAMASK: 'metamask', 
  PHANTOM: 'phantom',
  WALLETCONNECT: 'walletconnect',
  COINBASE: 'coinbase'
};
const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [availableWallets, setAvailableWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');

  const detectWallets = () => {
    const wallets = [];    
    // Check if window.ethereum exists first
    if (window.ethereum) {
      // Check for multiple injected providers
      const providers = window.ethereum.providers || [window.ethereum];
      providers.forEach(provider => {
        if (provider.isMetaMask) {
          wallets.push({ type: WALLET_TYPES.METAMASK, name: 'MetaMask' });
        }
      });
    }
    // For Solana-specific Phantom wallet
    if (window.solana?.isPhantom) {
      wallets.push({ 
        type: WALLET_TYPES.PHANTOM, 
        name: 'Phantom' 
      });
    }
    setAvailableWallets(wallets);
  };
  const connectWallet = async () => {
    try {
      if (!selectedWallet) {
       return;
      }  
      let provider;
      let accounts;
      switch (selectedWallet) {
        case WALLET_TYPES.METAMASK:
          if (!window.ethereum?.isMetaMask) {
            throw new Error('MetaMask not installed');
          }
          provider = new BrowserProvider(window.ethereum);
          accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          break;
  
        case WALLET_TYPES.PHANTOM:
          if (!window.solana?.isPhantom) {
            throw new Error('Phantom not installed');
          }
          const resp = await window.solana.connect();
          accounts = [resp.publicKey.toString()];
          provider = window.solana;
          break;
        default:
          throw new Error('Unsupported wallet type');
      } 
      if (!accounts || !accounts[0]) {
        throw new Error('No accounts found');
      }
      setAddress(accounts[0]);
      setProvider(provider);
      setWalletType(selectedWallet);
      setIsConnected(true);
  
    } catch (error) {
      console.error('Connection error:', error);
      alert(error.message);
    }
  };
  const disconnectWallet = async () => {
  try {
    switch (walletType) {
      case WALLET_TYPES.METAMASK:
        if (provider) {
          await provider.removeAllListeners();
        }
        break;

      case WALLET_TYPES.PHANTOM:
        if (window.solana) {
          await window.solana.disconnect();
        }
        break;

      default:
        break;
    }
    // Clear states
    setIsConnected(false);
    setAddress('');
    setProvider(null);
    setWalletType(null);
    setSelectedWallet('');

    // Clear local storage if used
    localStorage.removeItem('walletType');
    localStorage.removeItem('isConnected');
  } catch (error) {
    console.error('Disconnect error:', error);
    alert(error.message);
  }
};
  useEffect(() => {
    detectWallets();
  }, []);

  return (
    <div className='top-0 right-0 fixed'>
      {!isConnected ? (
        <div className=' flex flex-col w-32 border border-black m-1 bg-pink-100'>
             <button 
            onClick={connectWallet}
            disabled={!selectedWallet}
          >
            Connect {selectedWallet ? `with ${selectedWallet}` : 'Wallet'}
          </button>
          <select  className='text-center bg-pink-100'
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            style={{ marginBottom: '6px' }}
          >
            <option value="">Select</option>
            {availableWallets.map((wallet) => (
              <option key={wallet.type} value={wallet.type}>
                {wallet.name}
              </option>
            ))}
          </select>
       
        </div>
      ) : (
        <div className='p-1'>
          <p>Hello 👋: {address}</p>
          <button className='bg-red-400 float-end' onClick={disconnectWallet}>Disconnect</button>
        </div>
      )}
    </div>
  );
};
export default App;