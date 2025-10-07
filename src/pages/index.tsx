import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Homepage from "@/components/Homepage";
import { useState } from "react";
import Collections from "@/components/Collections";
import Market from "@/components/Market";
import Form from "@/components/Form";
import Verify from "@/components/Verify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [tab, setTab] = useState<'Homepage' | 'Upload' | 'Collections' | 'Market' | 'Verify'>('Homepage')

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen min-w-screen flex`} 
    >
      <main className="flex flex-col">
        <Header onChange={setTab}/>
        {tab === 'Homepage' && <Homepage/>}
        {tab === 'Upload' && <Form/>}
        {tab === 'Collections' && <Collections/>}
        {tab === 'Market' && <Market/>}
        {tab === 'Verify' && <Verify/>}

      </main>
      
    </div>
  );
}
