import { useState, useEffect } from 'react';
import { getcredentials } from './components/contractdata';
import { ethers } from 'ethers';
import './App.css';
import Loading from './components/Loading';
function App() {
  const [state, setState] = useState({provider: null,signer: null, contract: null});
  const [isconnected, setisconnected] = useState(false);
  const [error, setError] = useState('');
  const [account, setAccount] = useState('Not connected');
  const { contractAddress, todoListABI } = getcredentials();

  const connectWallet = async () => {
    try {
      setis(true);
      setError('');
      
      const { ethereum } = window;
      if (!ethereum) {
        setError('MetaMask is not installed');
        return;
      }

      // Request account access
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      // Get the first account
      const currentAccount = accounts[0];
      console.log('Connected account:', currentAccount);
      setAccount(currentAccount);

      // Create provider and signer
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();   
      // Create contract instance
      const contract = new ethers.Contract(
        contractAddress,
        todoListABI,
        signer
      );
      

      setState({ provider, signer, contract });
      
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      setAccount('Not connected');
    } finally {
    }
  };
  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            console.log('Found authorized account:', accounts[0]);
            setAccount(accounts[0]);
            // Reconnect provider, signer and contract
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
              contractAddress,
              todoListABI,
              signer
            );
            setState({ provider, signer, contract });
          }
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    };
    checkConnection();
  }, [contractAddress, todoListABI]);
  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          console.log('Account changed to:', accounts[0]);
          setAccount(accounts[0]);
          // Reconnect with new account
          await connectWallet();
        } else {
          console.log('Account disconnected');
          setAccount('Not connected');
          setState({ provider: null, signer: null, contract: null });
        }
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const disconnectWallet = () => {
    setState({ provider: null, signer: null, contract: null });
    setAccount('Not connected');
  };

  // Format account address for display
  const formatAddress = (address) => {
    console.log('Address:', address);
    if (address === 'Not connected') return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="app-container">
      {error && (
        <div className="error" style={{ color: 'red', margin: '10px' }}>
          Error: {error}
        </div>
      )}
      
      {is ? (
        <div className="loading" style={{ margin: '10px' }}>
          Connecting to MetaMask...
        </div>
      ):(<div className="wallet-info" style={{ margin: '10px' }}>
        <p>Connected Account: {formatAddress(account)}</p>
        {account !== 'Not connected' ? (
          <button 
            onClick={disconnectWallet}
            style={{ padding: '10px', margin: '5px' }}
          >
            Disconnect
          </button>
        ) : (
          <button 
            onClick={connectWallet}
            style={{ padding: '10px', margin: '5px' }}
          >
            Connect Wallet
          </button>
        )}
      </div>)}

      {/* Debug info */}
      <div style={{ margin: '10px', fontSize: '12px' }}>
        <p>Contract Address: {contractAddress}</p>
        <p>Provider: {state.provider ? 'Yes' : 'No'}</p>
        <p>Has Signer: {state.signer ? 'Yes' : 'No'}</p>
        <p>Has Contract: {state.contract ? 'Yes' : 'No'}</p>
        <p>Full Account: {account}</p>
      </div>
    </div>
  );
}

export default App;