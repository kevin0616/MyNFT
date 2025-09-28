import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { config } from '../../config'
import NFTabi from '../abis/NFTcontract.json'
import { form } from "wagmi/chains";

const JWT = process.env.NEXT_PUBLIC_JWT;

const Form = () => {
  const {address} = useAccount()
  const [exist, setExist] = useState(false)
  const [username, setUsername] = useState('')

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
          setUsername(response.creator.username)
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkCreator()
  }, [])

  const register = async() => {
    try {  
      const request = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/api/creator/register',
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },  
          body: JSON.stringify({ wallet_address: address, username: username })
        }
      );
      const response = await request.json();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
   console.log(address, username)
  }
  
  const { writeContract, isSuccess } = useWriteContract()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const [NFTURI, setNFTURI] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    if (file) {
      data.append("file", file);
    }
    try {  
      const request = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          body: data,
        }
      );
      const response = await request.json();
      //console.log(response);
      const URI = process.env.NEXT_PUBLIC_PINATA_URL + response.IpfsHash?.toString()
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: URI,
        creator: [
          {
            name: username,
            address: address,
          }
        ]
      }; 

      const request2 = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(metadata),
        }
      );

      const response2 = await request2.json();
      setNFTURI(process.env.NEXT_PUBLIC_PINATA_URL + response2.IpfsHash?.toString())

    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
    if (NFTURI){
      writeContract({ 
        abi: NFTabi,
        address: config.NFT_CONTRACT_ADDRESS,
        functionName: 'mintNFT',
        args: [formData.name, formData.description, NFTURI],
      });
    }
  }, [NFTURI])

  return (
    <div className="p-5 items-center w-full text-md flex flex-row justify-between">
    {exist ? (
      <form className="w-full flex flex-col m-3 bg-slate-100 p-3 rounded-lg" onSubmit={handleSubmit}>
        <div className="flex flex-row items-center justify-around">
          <div className="items-center w-64">
            <label className="flex flex-col">
              Upload Your File Here:
              <input className="outline rounded-sm hidden" id="fileupload" type="file" onChange={handleFileChange} />
              <div className="w-64 h-64 border-2 border-dashed border-gray-400 flex items-center justify-center bg-gray-100">
                {file ? (
                <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-full object-cover"
                />
                ) : (
                <span className="text-gray-400">Click to Upload</span>
                )}
              </div>
            </label>
          </div>
          <div className="flex flex-col items-center justify-center w-1/2">
            <label className="flex flex-col">
              Name:
              <input className="outline rounded-sm" type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label className="flex flex-col">
              Description:
              <input className="outline rounded-sm" type="text" name="description" value={formData.description} onChange={handleChange} required />
            </label>
            </div>
        </div>
        <div className="flex flex-col m-2 p-2 items-center">
          <button className="mx-2 p-2 bg-blue-300 rounded-lg hover:bg-blue-500 hover:text-white" type="submit">Mint</button>
        </div>
      </form>
    ) : (
      <div className="w-full flex flex-col items-center">
        Not a creator yet...? Pick a username and become one right now!
        <div>
          <input className="outline rounded-sm" type="text" name="username" value={username} onChange={(e) => {setUsername(e.target.value)}} required />
          <button onClick={register} className="mx-2 mt-4 p-2 bg-blue-300 rounded-lg hover:bg-blue-500 hover:text-white">Register</button>
        </div>
      </div>
    ) 
    }
    </div>
  );
};

export default Form;
