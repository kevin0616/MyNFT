import React, { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { config } from '../../config'
import NFTabi from '../abis/NFTcontract.json'
import MintCardInfo from './MintCardInfo'

export default function Collections() {
    const {address} = useAccount()

    const { data: ids } = useReadContract({
        abi: NFTabi,
        address: config.NFT_CONTRACT_ADDRESS,
        functionName: 'getAllId',
        args: [address],
    })

    useEffect(()=>{
        if(ids){
            setTokenIDs((ids as bigint[]).map(n => n.toString()))
        }
    }, [ids])

    const [tokenIDs,setTokenIDs] = useState<string[]>([])
  return (
    <div>
        <div className='w-full grid grid-cols-5 gap-5 flex justify-between '>
        {tokenIDs != null &&
        (tokenIDs).map((n, idx) => (
            <MintCardInfo key={idx} tokenId={n.toString()}></MintCardInfo>

        ))}
      </div>
    </div>
  )
}
