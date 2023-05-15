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
    // <div className='h-32 shadow-xl w-full border-style border'>
    <div className='relative w-full p-2 pr-10 shadow flex justify-between '>
      <p className='p-3'>uwitter</p>
      {currentAccount ?(
        <p className='p-3 text-neutral-700'>conected</p>
      ):(
        <button className='p-3 text-neutral-700 hover:bg-gray-100 rounded-full' onClick={handleConnectWallet}>Connect Wallet</button>
      )}
    </div>
  )
}