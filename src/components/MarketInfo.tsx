import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useWriteContract } from 'wagmi';
import { config } from '../../config'
import NFTabi from '../abis/NFTcontract.json'

interface Creator {
  name: string;
  address: string;
}

interface Metadata {
  name: string;
  description: string;
  image: string;
  creator?: Creator[];
}

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

export default function MarketInfo({nft}: Props) {
  const { writeContract, isSuccess } = useWriteContract()
  
  const [metadata, setMetadata] = useState<Metadata>()
  
  useEffect(() => {
    if (!nft.tokenURI) return;

    async function fetchMetadata() {
      try {
        const res = await fetch(nft.tokenURI);
        const data: Metadata = await res.json();
        setMetadata(data);
      } catch (err) {
        console.error("Failed to fetch NFT metadata:", err);
      }
    }

    fetchMetadata();
  }, [nft.tokenURI]);
  
  const buyNFT = () => {
    writeContract({ 
      abi: NFTabi,
      address: config.NFT_CONTRACT_ADDRESS,
      functionName: 'buy',
      args: [nft.tokenId],
      value: nft.price,
    });    
  }

  return (
    <div className='w-full h-full rounded-lg m-3 bg-slate-200 p-5 w-full flex flex-col justify-center items-center'> 
      <p className='w-full text-left'>#{nft.tokenId.toString()}</p>
      {metadata && 
      <Image
        className="rounded w-full"
        width={150}
        height={150}
        src={metadata?.image as string}
        alt="Image"
      />
      }
      <div className='w-full text-left text-xl font-semibold'>{nft.name}</div>
      <div className='w-full text-left'>{nft.description}</div>
      <div className='m-2 w-full text-left flex justify-between items-center'>
        <label>Price: {nft.price}</label>
        <button onClick={buyNFT} className=" px-4 p-2 bg-blue-300 rounded-lg hover:bg-blue-500 hover:text-white" type="submit">Buy</button>            
      </div>
    </div>
  )
}