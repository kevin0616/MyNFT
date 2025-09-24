import React, { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { config } from '../../config'
import NFTabi from '../abis/NFTcontract.json'
import MarketInfo from './MarketInfo'

export default function Market() {
    const {address} = useAccount()
    const [infos, setInfos] = useState<any[]>([])
    const { data } = useReadContract({
        abi: NFTabi,
        address: config.NFT_CONTRACT_ADDRESS,
        functionName: 'getInfos',
    })
    
    
    useEffect(()=>{
      if(data){
        const cleanInfos = (data as any[]).map((info: any, i: number) => ({
          tokenId: info.tokenId,
          name: info.name,
          description: info.description,
          tokenURI: info.tokenURI,
          price: info.price,
          owner: info.owner,
    })).filter((nft) => (nft.price > 0))

        setInfos(cleanInfos);
        }
    }, [data])
  return (
    
    <div>
      <div className='w-full grid grid-cols-4 gap-5 flex justify-between'>
        {infos != null &&
        (infos).map((nft, idx) => (
          <MarketInfo key={idx} nft={nft}></MarketInfo>
        ))}
      </div>
    </div>
  )
}
