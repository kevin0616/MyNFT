import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useWriteContract } from 'wagmi';
import { config } from '../../config'
import NFTabi from '../abis/NFTcontract.json'

interface Info{
  tokenId: number,
  name: string,
  description: string,
  tokenURI: string,
  price: bigint,
  owner: string
}

type Props = {
  nft: Info;
};

export default function CollectionsInfo({nft}: Props) {
  const { writeContract, isSuccess } = useWriteContract()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value)
  };

  const listNFT = () => {
    writeContract({ 
      abi: NFTabi,
      address: config.NFT_CONTRACT_ADDRESS,
      functionName: 'list',
      args: [nft.tokenId, price],
    });
    
  }

  useEffect(()=>{
    if(isSuccess){
      console.log('success')
    }
  }, [isSuccess])

  const [price, setPrice] = useState('0');
  const [list, setList] = useState(false);
  return (
    <div className='w-full h-full rounded-lg m-3 bg-slate-200 p-5 w-full flex flex-col justify-center items-center'> 
      <p className='w-full text-left'>#{nft.tokenId.toString()}</p>
      <Image
        className="rounded w-full"
          width={150}
          height={150}
          src={nft.tokenURI}
          alt="Image"
        />
      <div className='w-full text-left text-xl font-semibold'>{nft.name}</div>
      <div className='w-full text-left'>{nft.description}</div>
        <div className='flex flex-row'>
          {list === false ? (
            <button onClick={() => {setList(true)}} className="mt-2 mx-2 p-2 bg-blue-300 rounded-lg hover:bg-blue-500 hover:text-white" type="submit">List</button>

          ) : (
            <div className='w-full mt-3'>
            <label>Price:</label>
            <input className="outline rounded-sm" type="textarea" name="description" onChange={handleChange} required />
            <div className='justify-end flex'>
            <button onClick={listNFT} className="mt-2 p-2 bg-blue-300 rounded-lg hover:bg-blue-500 hover:text-white" type="submit">List</button>            
            </div>
            </div>
          )}

        </div>
      </div>
  )
}