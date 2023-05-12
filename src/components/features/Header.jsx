import React from 'react';
import { ethers } from 'ethers';

import { CONTRACT_ADDRESS } from '../../domains/contractAddress';
import contractABI from '../../domains/contractABI.json'

export const Header = ({currentAccount, setCurrentAccount, setContract}) =>{
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

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI.abi,
          signer
        )
        setContract(contract);
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