import React, { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { config } from '../../config'
import NFTabi from '../abis/NFTcontract.json'
import CollectionsInfo from './CollectionsInfo'

interface Info{
    tokenId: number,
    name: string,
    description: string,
    tokenURI: string,
    price: bigint,
    owner: string
}

export default function Collections() {
    const {address} = useAccount()
    const [infos, setInfos] = useState<Info[]>([])
    const { data } = useReadContract({
        abi: NFTabi,
        address: config.NFT_CONTRACT_ADDRESS,
        functionName: 'getInfos',
    })
    
    
    useEffect(()=>{
        if(data){
          const cleanInfos = (data as Info[]).map((info: Info, i: number) => ({
          tokenId: info.tokenId,
          name: info.name,
          description: info.description,
          tokenURI: info.tokenURI,
          price: info.price,
          owner: info.owner,
        })).filter((nft) => (nft.owner == address))

        setInfos(cleanInfos);
        }
    }, [data])

  return (
    <div>
      <div className='w-full grid grid-cols-4 gap-5 flex justify-between '>
        {infos != null &&
        (infos).map((nft, idx) => (
          //<div>{n.name}</div>
          <CollectionsInfo key={idx} nft={nft}></CollectionsInfo>
        ))}
      </div>
    </div>
  )
}
