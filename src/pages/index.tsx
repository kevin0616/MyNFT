import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import MintCard from "@/components/MintCard";
import Form from '@/components/Form';
import { useState } from "react";
import Collections from "@/components/Collections";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [tab, setTab] = useState<'Upload' | 'Collections'>('Upload')

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen`}
    >
      <main className="flex flex-col">
        <Header onChange={setTab}/>
        {tab === 'Upload' && <MintCard/>}
        {tab === 'Collections' && <Collections/>}

      </main>
      
    </div>
  );
}
