import React from 'react';

export const Header = ({currentAccount, setCurrentAccount}) =>{
  const handleConnectWallet = async() => {
    try{
      const { ethereum } = window;
      if(!ethereum){
        console.log('must have metamesk');
        return;
      }
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      if(accounts.length > 0){
        console.log('connect!');
        setCurrentAccount(accounts[0]);
      }else{
        console.log('can not connecting...')
      }

    }catch(error){
      console.log(error);
    }
  }

  return(
    <>
      {currentAccount ?(
        <p>connect済み</p>
      ):(
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      )}
    </>
  )
}