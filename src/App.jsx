import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// import './App.css';
import contractABI from './domains/contractABI.json';
import { TweetList } from './components/features/TweetList';
import { TweetForm } from './components/features/TweetForm';
import { Header } from './components/features/Header';
import { HeaderSample } from './components/features/HeaderSample';
import { DropMenu } from './components/features/DropMenu';

function App() {
  const CONTRACT_ADDRESS = '0x1da9F8f34F035264711b2536eF185141588E38c6';
  const [ currentAccount, setCurrentAccount ] = useState();
  const [ contract, setContract ] = useState(null);

  const [ tweetData, setTweetData ] = useState([]);

  const checkIfWalletIsConnected = async() => {
    try{
      const { ethereum } = window;
      if(!ethereum){
        console.log('must have metamesk');
        return;
      }
      const address = await ethereum.request({ method: 'eth_accounts'});
      if(address.length > 0){
        setCurrentAccount(address[0]);

        const chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log('chainId: ', chainId);
        if(chainId !== '0xaa36a7'){
          console.log('sepoliaに切り替える');
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: '0xaa36a7'}]
          });
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI.abi,
          signer
        )
        setContract(contract);
      }
    }catch(error){
      console.log('--- error ---');
      console.log(error);
    }
  }

  useEffect(() => {
    if(contract){
      console.log('has contract');
      const filters = contract.filters.TweetPosted(currentAccount);
      contract.on(filters, (posterAddr, message, time) => {
        console.log('event listener: ', posterAddr, message, time);
      })
    }
  }, [contract]);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="flex flex-col mx-auto my-0 text-center items-center App">
      <Header currentAccount={currentAccount} setCurrentAccount={setCurrentAccount} setContract={setContract}/>
      {currentAccount?(
        <>
          <TweetForm/>
          <TweetList contract={contract} tweetData={tweetData} setTweetData={setTweetData}/>
        </>
      ):(
        <>
          <p className='mt-4'>Walletが接続されていません...</p>
        </>
      )}
      
    </div>
  );
}

export default App;
