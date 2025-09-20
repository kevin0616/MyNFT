import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <div className="p-5 items-center w-full text-xl flex flex-row justify-between bg-blue-200">
      <label className=''>Mint My NFT</label>
      <ConnectButton />
    </div>
  )
}
