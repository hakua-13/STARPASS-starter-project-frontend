import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { CONTRACT_ADDRESS } from '../../domains/contractAddress';
import contractABI from '../../domains/contractABI.json';

export const TweetList = ({contract, tweetData, setTweetData}) => {
  const [ sortType, setSortType ] = useState('time');

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

      const [ tweetData, tweetLikedStatus ] = await contract.getAllPost();
      let tweetDataCleaned = tweetData.map((tweet, i) => {
        const datetime = new Date(tweet.time.toNumber() * 1000);
        return{
          id: i,
          message: tweet.message,
          totalLike: tweet.totalLike.toNumber(),
          isLike: tweetLikedStatus[i],
          time: datetime,
          posterAddr: tweet.posterAddr,
        }
      })

      tweetDataCleaned = tweetDataCleaned.sort((a,b) => {
        return b.time - a.time;
      })
      console.log('tweetData: ', tweetDataCleaned);
      setTweetData(tweetDataCleaned);
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    if(contract){
      getAllPost();
    }
  }, [contract]);

  const handleSortLike = () => {
    let clonedTweetData = Array.from(tweetData)
    clonedTweetData.sort((a,b) => {
      return b.totalLike - a.totalLike;
    })
    setSortType('like');
    setTweetData(clonedTweetData);
  }

  const handleSortTime = () => {
    let clonedTweetData = Array.from(tweetData);
    clonedTweetData.sort((a,b) => {
      return b.time - a.time;
    });
    setSortType('time');
    setTweetData(clonedTweetData);
  }
  return(
    <div className='h-full border-x border-inherit max-w-screen-sm w-full'>
      <div className='text-end py-2'>
        <button
          className={`mr-2 py-1 px-2 text-xs border font-bold border-cyan-600 rounded-full ${sortType==='time'?'text-white bg-cyan-600':'text-cyan-600'}`}
          onClick={handleSortTime}
        >時系列</button>
        <button
          className={`mr-2 py-1 px-2 text-xs border font-bold border-cyan-600 rounded-full ${sortType==='like'?'text-white bg-cyan-600':'text-cyan-600'}`}
          onClick={handleSortLike}
        >いいね数</button>
      </div>
      {tweetData.length>0? (
        <>
          {tweetData.map((tweet, index) => (
            <div key={ `${tweet.time}-${tweet.posterAddr}`} className='border-b border-inherit p-4 text-left'>
                <p>{tweet.posterAddr}</p>
                <p className='py-2'>{tweet.message}</p>
                <div className='flex items-center gap-4'>
                  <div
                    onClick={() => handleLike(tweet.id, tweet.isLike)}
                    className={
                      `fa-heart cursor-pointer ${tweet.isLike ?
                      'fas text-pink-600':
                      'far text-gray-500 hover:text-pink-600'}`
                  }>
                    {` ${tweet.totalLike}`}
                  </div>
                  <p className='text-gray-500'>{String(tweet.time.toLocaleString('ja-JP'))}</p>
                </div>
            </div>
          ))}
        </>
      ):(
        <p>tweetなし</p>
      )}
      <div className='h-12'></div>
    </div>
  )
}