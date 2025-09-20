import React, { useEffect, useState } from 'react'
import icon from '../assets/icon.jpg'
import Image from 'next/image'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { config } from '../../config'
import NFTabi from '../abis/NFTcontract.json'

export default function MintCardInfo({tokenId}) {
  const { data: tokenURI } = useReadContract({
        abi: NFTabi,
        address: config.NFT_CONTRACT_ADDRESS,
        functionName: 'tokenURI',
        args: [tokenId],
  })
  console.log(typeof tokenURI)
  useEffect(()=>{

  }, [])

  //console.log(data)
  return (
    <div className='rounded-lg m-3 bg-slate-200 p-5 w-full flex flex-col justify-center items-center'> 
      <p>#{tokenId}</p>
      <Image width={100} height={100} src={tokenURI}></Image>
    </div>
  )
}