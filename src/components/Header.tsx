import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';

type Props = {
  onChange: (tab: 'Upload' | "Collections") => void
}

export default function Header({onChange} : Props) {
  return (
    <div className="p-5 items-center w-full text-xl flex flex-row justify-between bg-blue-200">
      <label className=''>Mint My NFT</label>
      <button onClick={() => onChange("Upload")}>Upload</button>
      <button onClick={() => onChange("Collections")}>Collections</button>

      <ConnectButton />
    </div>
  )
}
