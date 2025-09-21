import React, { useEffect, useState } from 'react'
import icon from '../assets/icon.jpg'
import Image from 'next/image'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { config } from '../../config'
import NFTabi from '../abis/NFTcontract.json'
import MintCardInfo from './MintCardInfo'
import Form from './Form'

export default function MintCard() {
    const {address} = useAccount()

    const { writeContract, isSuccess } = useWriteContract()
    
    const { data: total } = useReadContract({
        abi: NFTabi,
        address: config.NFT_CONTRACT_ADDRESS,
        functionName: 'totalSupply',
    })
    const { data: amount } = useReadContract({
        abi: NFTabi,
        address: config.NFT_CONTRACT_ADDRESS,
        functionName: 'balanceOf',
        args: [address],
    })
    const { data: ids } = useReadContract({
        abi: NFTabi,
        address: config.NFT_CONTRACT_ADDRESS,
        functionName: 'getAllId',
        args: [address],
    })
    const [totalSupply, setTotalSupply ] = useState<string>('0')
    const [balance, setBalance ] = useState<string>('0')
    const [tokenIDs,setTokenIDs] = useState<string[]>([])

    useEffect(() => {
        if(total){
            setTotalSupply(total?.toString())
        }
    }, [total])

    useEffect(() => {
        if(amount){
            setBalance(amount?.toString())
        }
    }, [amount])

    useEffect(()=>{
        if(ids){
            setTokenIDs((ids as bigint[]).map(n => n.toString()))
        }
    }, [ids])

    return (
    <div className='p-5 w-full flex flex-col justify-center items-center'> 
        <Image width={200} height={200} src={icon} alt='Icon'></Image>
        <div>Total Minted: {totalSupply}</div>
        <div>You Minted: {balance}</div>
        
        <Form/>
    </div>
  )
}


/*

<button className='mx-5 p-2 bg-blue-300 rounded-lg hover:bg-blue-500' 
            onClick={() => 
                writeContract({ 
                    abi: NFTabi,
                    address: config.NFT_CONTRACT_ADDRESS,
                    functionName: 'mintNFT',
                })}>MINT</button>

<p>My Mint</p>
        <div className='w-full grid grid-cols-5 gap-5 flex justify-between '>
        {tokenIDs != null &&
        (tokenIDs).map((n, idx) => (
            <MintCardInfo key={idx} tokenId={n.toString()}></MintCardInfo>

        ))}
      </div>*/