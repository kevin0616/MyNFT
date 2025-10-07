import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useWriteContract, useAccount } from 'wagmi';
import { config } from '../../config'
import NFTabi from '../abis/NFTcontract.json'


interface Creator {
  name: string;
  address: string;
}

interface Metadata {
  name: string;
  description: string;
  image: string;
  creator?: Creator[];
}

interface Info{
  tokenId: number,
  name: string,
  description: string,
  tokenURI: string,
  price: bigint,
  owner: string
}

type Props = {
  nft: Info;
};

export default function CollectionsInfo({nft}: Props) {
  const { writeContract, isSuccess } = useWriteContract()
  const {address: wallet_address} = useAccount()

  const [craftData, setCraftData] = useState({
    tag: ""  })
  const [metadata, setMetadata] = useState<Metadata>()
  const [popup, setPopup] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value)
  };

  const handleCraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCraftData({
      ...craftData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(()=>{
    const fetchTags = async() => {
      try {  
        const request = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/api/proof/list',
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },  
            body: JSON.stringify({
              token_id: nft.tokenId.toString(),
            })
          }
        );
        const response = await request.json();
        console.log(response);
        setTags(response.map((item: { tag: any; }) => item.tag));
        //setExist(response.results)
      } catch (error) {
        console.log(error);
      }
    }
    fetchTags()
  }, [])

  const craftProof = async() => {
    try {  
      const request = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/api/proof/create',
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },  
          body: JSON.stringify({ 
            address: wallet_address,
            creator_address: metadata?.creator ? metadata.creator[0].address : "",
            event_info: JSON.stringify({"tag": craftData.tag}), 
            token_uri: nft.tokenURI,
            token_id: nft.tokenId.toString(),
            tag: craftData.tag,
          })
        }
      );
      const response = await request.json();
      console.log(response);
      //setExist(response.results)
      
    } catch (error) {
      console.log(error);
    }
    setCraftData({tag: ""})
    setPopup(false)
  }

  const listNFT = () => {
    writeContract({ 
      abi: NFTabi,
      address: config.NFT_CONTRACT_ADDRESS,
      functionName: 'list',
      args: [nft.tokenId, price],
    });
  }

  useEffect(() => {
    if (!nft.tokenURI) return;

    async function fetchMetadata() {
      try {
        const res = await fetch(nft.tokenURI);
        const data: Metadata = await res.json();
        setMetadata(data);
      } catch (err) {
        console.error("Failed to fetch NFT metadata:", err);
      }
    }

    fetchMetadata();
  }, [nft.tokenURI]);

  useEffect(()=>{
    if(isSuccess){
      console.log('success')
    }
  }, [isSuccess])

  const [tags, setTags] = useState<String[]>(['123', '456', 'abc', 'df', 'ghi'])
  const [price, setPrice] = useState('0');
  const [list, setList] = useState(false);
  return (
    <div className='w-full h-full rounded-lg m-3 bg-slate-200 p-5 w-full flex flex-col justify-center items-center'> 
      <p className='w-full text-left'>#{nft.tokenId.toString()}</p>
      {metadata?.image && <Image
        className="rounded w-full"
          width={150}
          height={150}
          src={metadata?.image as string}
          alt="Image"
        />
      }
      <div className='w-full text-left text-xl font-semibold'>{nft.name}</div>
      <div className='w-full text-left'>{nft.description}</div>
      <div className='w-full flex flex-wrap gap-1'>
        {tags.map((key, index) => (
          <div className='bg-blue-400 px-2 rounded-2xl'>{key}</div>
        ))}
          <div onClick={() => {setPopup(true)}} className='bg-blue-400 px-2 rounded-2xl'>+</div>
      </div>
        <div className='flex flex-row'>
          {list === false ? (
            <div>
              <button onClick={() => {setList(true)}} className="mt-2 mx-2 p-2 bg-blue-300 rounded-lg hover:bg-blue-500 hover:text-white" type="submit">List</button>
            </div>
          ) : (
            <div className='w-full mt-3'>
            <label>Price:</label>
            <input className="outline rounded-sm" type="text" name="description" onChange={handleChange} required />
            <div className='justify-end flex'>
            <button onClick={listNFT} className="mt-2 p-2 bg-blue-300 rounded-lg hover:bg-blue-500 hover:text-white" type="submit">List</button>            
            </div>
            </div>
          )}

        </div>

        {popup &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[50%] bg-white rounded-lg shadow-lg w-96 p-6 relative">
          <button
            onClick={() => {setPopup(false)}}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
          <div className="w-full flex flex-row justify-around items-center">
            <div className="w-[50%]">
            {metadata?.image && <Image
              className="rounded w-full"
                width={150}
                height={150}
                src={metadata?.image as string}
                alt="Image"
              />
            }
            </div>
            <div className="flex flex-col m-2 p-2 gap-2">
              New Tag:<input className="outline rounded-sm" type="text" name="tag" value={craftData.tag} onChange={handleCraftChange}/>
              <button onClick={craftProof} className="mt-2 mx-2 p-2 bg-green-300 rounded-lg hover:bg-green-500 hover:text-white" type="submit">Add</button>
            </div>
          </div>
        </div> 
        </div>
        }
      </div>
  )
}