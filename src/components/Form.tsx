import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { config } from '../../config'
import NFTabi from '../abis/NFTcontract.json'

const JWT = process.env.NEXT_PUBLIC_JWT;

const Form = () => {
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

  const [NFTURL, setNFTURL] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 使用 FormData 送出
    const data = new FormData();
    //data.append("name", formData.name);
    //data.append("description", formData.description);
    if (file) {
      data.append("file", file);
    }
    data.forEach((value, key) => {
        console.log(key, value);
    });

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
        console.log(response);
        console.log(process.env.NEXT_PUBLIC_PINATA_URL + response.IpfsHash?.toString())
        setNFTURL(process.env.NEXT_PUBLIC_PINATA_URL + response.IpfsHash?.toString())
        
    } catch (error) {
        console.log(error);
    }
    //const tokenURI = process.env.NEXT_PUBLIC_PINATA_URL + ipfsHash?.toString()
    //console.log(NFTURL)
    

  };

  useEffect(() => {
    if (NFTURL){
        writeContract({ 
            abi: NFTabi,
            address: config.NFT_CONTRACT_ADDRESS,
            functionName: 'mintNFT',
            args: [NFTURL],
        });
    }
  }, [NFTURL]);

  return (
    <div className="p-5 items-center w-full text-md flex flex-row justify-between">
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
                            //src={NFTURL}
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
                        <input className="outline rounded-sm" type="textarea" name="description" value={formData.description} onChange={handleChange} required />
                    </label>
                </div>
            </div>
            <div className="flex flex-col m-2 p-2 items-center">
                <button className="mx-2 p-2 bg-blue-300 rounded-lg hover:bg-blue-500 hover:text-white" type="submit">Mint</button>
            </div>
        </form>
    </div>
  );
};

export default Form;
