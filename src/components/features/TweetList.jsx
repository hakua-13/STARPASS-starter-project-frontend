import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { CONTRACT_ADDRESS } from '../../domains/contractAddress';
import contractABI from '../../domains/contractABI.json';

export const TweetList = ({contract, tweetData, setTweetData}) => {
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
    getAllPost();
  }, []);

  return(
    <>
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
    </>
  )
}