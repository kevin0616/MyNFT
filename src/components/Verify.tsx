import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { config } from '../../config'
import NFTabi from '../abis/NFTcontract.json'
import { form } from "wagmi/chains";

const JWT = process.env.NEXT_PUBLIC_JWT;

interface Metadata{
  created_at: string,
  creator_address: string,
  hash: string,
  id: string,
  info: string,
  signature: string,
  token_id: string,
  token_uri: string,

}

const Verify = () => {
  const {address} = useAccount()
  const [exist, setExist] = useState(false)
  const [username, setUsername] = useState('')
  const [metadata, setMetadata] = useState<Metadata[]>([])
  useEffect(()=>{
    const checkCreator = async() => {
      //console.log(address)
      try {  
        const request = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/api/creator/check',
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },  
            body: JSON.stringify({ wallet_address: address })
          }
        );
        const response = await request.json();
        //console.log(response);
        setExist(response.results)
        if(response.results){
          try {  
            const request = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL + '/api/proof/verify/',
            {
              method: "POST",
              headers: {
              'Content-Type': 'application/json'
              },  
              body: JSON.stringify({ wallet_address: address })
            }
            );
            const response = await request.json();

            console.log(response);
            setMetadata(
            response.map((value: Metadata, idx: number) => ({
              ...value
            }))
            )
            //setExist(response.results)
            
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkCreator()
  }, [])

  return (
    <div className="p-5 items-center w-full text-md flex flex-row justify-between">
    {exist ? (
      <div>
        {metadata.map((item, idx) => (
        <div key={idx}>
          <h3>{item.token_id}</h3>
          <p>{item.token_uri}</p>
          <p>Creator: {item.creator_address}</p>
        </div>
        ))}
      </div>
    ) : (
      <div className="w-full flex flex-col items-center">
        Not a creator yet...? Pick a username and become one right now!
        <div>
          <input className="outline rounded-sm" type="text" name="username" value={username} onChange={(e) => {setUsername(e.target.value)}} required />
        </div>
      </div>
    ) 
    }
    </div>
  );
};

export default Verify;
