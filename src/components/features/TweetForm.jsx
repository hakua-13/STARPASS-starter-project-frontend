import { ethers } from 'ethers';
import React, {useState} from 'react';

import { CONTRACT_ADDRESS } from '../../domains/contractAddress';
import contractABI from '../../domains/contractABI.json';

export const TweetForm = () => {
  const [ newTweet, setNewTweet ] = useState('');

  const handlePostTweet = async() => {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
         CONTRACT_ADDRESS,
         contractABI.abi,
         signer
      );

      const postTweetTxn = await contract.post(newTweet);
      setNewTweet('');
      await postTweetTxn.wait();
    }catch(error){
      console.log(error);
    }
  }

  return(
    // <div className='flex flex-col items-center bg-gray-100 p-4 shadow-sm w-full'>
    <div className='flex flex-col items-start p-4 w-full max-w-screen-sm border-x border-b border-inherit'>
      <textarea className='w-96 rounded-lg outline-none bg-gray-100  p-3 mb-4' value={newTweet} onChange={e => setNewTweet(e.target.value)} placeholder='ツイート' />
      <button className='bg-cyan-600 text-white px-6 py-2 rounded-full font-bold' onClick={handlePostTweet}>投稿</button>
    </div>
  )
}