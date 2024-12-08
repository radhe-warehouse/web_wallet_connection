// import React, { useState, useEffect } from 'react';
// import { BrowserProvider, ethers, Interface } from "ethers";

// export const connection = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [address, setAddress] = useState('');
//   const [providerInfo, setProviderInfo] = useState(null);
//   const [provider, setProvider] = useState(null);
  
//   // Handle account changes
//   const handleAccountsChanged = () => {
//     disconnectWallet();
//   };

//   // Handle chain/network changes  
//   const handleChainChanged = () => {
//     window.location.reload();
//   };

//   const disconnectWallet = async () => {
//     try {      
//       localStorage.removeItem('walletAddress');
//       localStorage.removeItem('isWalletConnected');              
//       // Clear provider instance
//       if (provider) {
//         await provider.removeAllListeners();
//         setProvider(null);
//       }
//       // Force MetaMask to disconnect
//       if (window.ethereum.selectedAddress) {
//         await window.ethereum.request({
//           method: 'wallet_requestPermissions',
//           params: [{ eth_accounts: {} }]
//         });
//       }
//       // Remove listeners
//       window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//       window.ethereum.removeListener('chainChanged', handleChainChanged);
  
//       // Reset states
//       setIsConnected(false);
//       setAddress('');
//       setProviderInfo(null);  
//       console.log('Wallet disconnected successfully');
//     } catch (error) {
//       console.error('Error disconnecting:', error);
//       // Clear localStorage even if error occurs
//       localStorage.clear();
//       setIsConnected(false);
//       setAddress('');
//     }
//   };
  
//   // Add this to connectWallet function
//   const connectWallet = async () => {
//     try {
//       if (window.ethereum) {
//         const accounts = await window.ethereum.request({
//           method: 'eth_requestAccounts'
//         });
//         setAddress(accounts[0]);
//         setIsConnected(true);
//         // Save to localStorage
//         localStorage.setItem('walletAddress', accounts[0]);
//         localStorage.setItem('isWalletConnected', 'true');
//       }
//     } catch (error) {
//       console.error('Error connecting:', error);
//     }
//   };
//   useEffect(() => {
//     // Add listeners when component mounts
//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', handleAccountsChanged);
//       window.ethereum.on('chainChanged', handleChainChanged);
//     }

//     // Cleanup on unmount
//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//         window.ethereum.removeListener('chainChanged', handleChainChanged);
//       }
//     };
//   }, []);
// };
