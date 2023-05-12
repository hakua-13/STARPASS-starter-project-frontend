import React from 'react';
import {ethers} from 'ethers';
import { useEffect, useState } from 'react';

import './App.css';
import contractABI from './contractABI.json';


function App() {
  const CONTRACT_ADDRESS = '0x1da9F8f34F035264711b2536eF185141588E38c6';
  const [ currentAccount, setCurrentAccount ] = useState();
  const [ contract, setContract ] = useState(null);
  const [ newTweet, setNewTweet ] = useState('');

  const [ tweetData, setTweetData ] = useState([]);

  const checkWalletConnection = async() => {
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

          console.log('1');
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: '0xaa36a7'}]
          });
          console.log('2');
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

  const getAllPost = async() => {
    try{
      const { ethereum } = window;
      if(!ethereum){
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      )

      console.log('getAllPost');
      const tweetData = await contract.getAllPost();
      console.log('finish getAllPost');
      const tweetDataCleaned = tweetData.map((tweet, i) => {
        const datetime = new Date(tweet.time.toNumber() * 1000)
        const datetimeFormat = datetime.toLocaleString('ja-JP');
        return{
          id: tweet.postId.toNumber(),
          message: tweet.message,
          totalLike: tweet.totalLike.toNumber(),
          isLike: tweet.isLike,
          time: datetimeFormat,
          posterAddr: tweet.posterAddr,
        }
      })

      console.log('tweetData: ', tweetDataCleaned);
    setTweetData(tweetDataCleaned);
    }catch(error){
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
    checkWalletConnection();
    getAllPost();
  }, []);

  const handleConnectWallet = async() => {
    try{
      const { ethereum } = window;
      if(!ethereum){
        console.log('must have metamesk');
        return;
      }
      const address = await ethereum.request({method: 'eth_requestAccounts'});
      if(address > 0){
        console.log('connect!');
      }else{
        console.log('can not connecting...')
      }

    }catch(error){
      console.log(error);
    }
  }

  const handlePostTweet = async() => {
    if(!contract){
      return;
    }
    try{
      const postTweetTxn = await contract.post(newTweet);
      setNewTweet('');
      await postTweetTxn.wait();
    }catch(error){
      console.log(error);
    }
  }

  const handleLike = async(index, isLike) => {
    if(!contract){
      return;
    }

    if(isLike){
      const unlike = await contract.unlike(index);
      await unlike.wait();
    }else{
      const like = await contract.like(index);
      await like.wait();
    }
  }

  return (
    <div className="App">
      <button onClick={handleConnectWallet}>Connect wallet</button>
      <textarea value={newTweet} onChange={e => setNewTweet(e.target.value)} placeholder='ツイート' />
      <button onClick={handlePostTweet}>投稿</button>
      
      
      {tweetData.length>0? (
        <>
          {tweetData.map((tweet, index) => (
            <div key={tweet.id}>
                <p>{tweet.message}</p>
                <div onClick={() => handleLike(index, tweet.isLike)} className={`heart icon ${tweet.isLike && 'like'}`}></div>
                <p>{tweet.totalLike}</p>
                <p>{String(tweet.time)}</p>
            </div>
          ))}
        </>
      ):(
        <p>tweetなし</p>
      )}
    </div>
  );
}

export default App;
