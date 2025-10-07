import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

type Props = {
  onChange: (tab: 'Homepage' | 'Upload' | "Collections" | "Market" | "Verify") => void
}

export default function Header({onChange} : Props) {
  return (
    <div className="p-5 items-center w-full text-xl flex flex-row justify-between bg-blue-200">
      <label className='text-2xl font-bold'>MintMyNFT</label>
      <div className='flex flex-row gap-10 justify-start'>
        <button className='h-full hover:cursor-pointer hover:text-white' onClick={() => onChange("Homepage")}>Homepage</button>
        <button className='h-full hover:cursor-pointer hover:text-white' onClick={() => onChange("Upload")}>Upload</button>
        <button className='h-full hover:cursor-pointer hover:text-white' onClick={() => onChange("Collections")}>Collections</button>
        <button className='h-full hover:cursor-pointer hover:text-white' onClick={() => onChange("Market")}>Market</button>
      </div>
      <ConnectButton />
    </div>
  )
}
