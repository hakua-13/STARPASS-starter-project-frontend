import React, {useState} from 'react';

export const TweetForm = ({contract}) => {
  const [ newTweet, setNewTweet ] = useState('');

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

  return(
    <>
      <textarea value={newTweet} onChange={e => setNewTweet(e.target.value)} placeholder='ツイート' />
      <button onClick={handlePostTweet}>投稿</button>
    </>
  )
}