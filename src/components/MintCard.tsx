import React, { useEffect, useState } from 'react'
import icon from '../assets/icon.jpg'
import Image from 'next/image'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { config } from '../../config'
import NFTabi from '../abis/NFTcontract.json'
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
    const [totalSupply, setTotalSupply ] = useState<string>('0')
    const [balance, setBalance ] = useState<string>('0')

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

    return (
    <div className='p-5 w-full flex flex-col justify-center items-center'> 
        <Image width={200} height={200} src={icon} alt='Icon'></Image>
        <div>Total Minted: {totalSupply}</div>
        <div>You Minted: {balance}</div>
        <Form/>
    </div>
  )
}