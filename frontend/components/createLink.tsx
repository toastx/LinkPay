'use client';

import React, { useState } from "react";
import axios from "axios";
import { Label } from "@/components/ui/labelacc";
import { Input } from "@/components/ui/inputacc";
import { cn } from "@/utils/cn";
const {
    Horizon,
    Networks,
    TransactionBuilder
  } = require('@stellar/stellar-sdk');
import { isConnected,requestAccess, signTransaction } from "@stellar/freighter-api";

export default function CreateLink() {
    const server = new Horizon.Server('https://horizon-futurenet.stellar.org');
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [link,setLink] = useState("");
    async function getPubkey() {
        if (await isConnected()) {
            console.log("user has freighter")
          }
        else{
            alert("no freighter installed")
            return
        }

        const retrievePublicKey = async () => {
            let publicKey = "";
            let error = "";
          
            try {
              publicKey = await requestAccess();
            } catch (e) {
              alert(e)
            }
          
            if (error) {
              alert("error")
              return
            }
          
            setAddress(publicKey)
          };

          retrievePublicKey();
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            'amount': parseFloat(amount),
            'receiver_public': address
        };
        console.log(data);
        try {
            const response = await axios.post('https://toastx11.pythonanywhere.com/create', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'https://toastx11.pythonanywhere.com'
                },
            });

            console.log('Success:', response.data);
            let xdr = response.data["xdr"]
            let tx = await signTransaction(xdr,{networkPassphrase: Networks.FUTURENET})
            console.log(tx)
            
            const transactionToSubmit = TransactionBuilder.fromXDR(
                tx,
                Networks.FUTURENET
              );

            const final = await server.submitTransaction(transactionToSubmit);
            console.log(response.data['url'])

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen ">
            <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Create Links
                </h2>
                <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    Simple steps to send funds.
                </p>

                <form className="my-8" onSubmit={handleSubmit}>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="address">Receiver Address </Label>
                        <Input
                            id="address"
                            placeholder="Wallet Address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </LabelInputContainer>

                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            placeholder="1000"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </LabelInputContainer>

                    <button
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                    >
                        Create Link &rarr;
                        
                    </button>
                    <BottomGradient />
                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                    <button
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="button"
                        onClick={()=>getPubkey()}
                    >
                        Get pubkey from freighter
                        
                    </button>
                </form>

                {link && <div className="text-white flex items-center w-screen">
                    {link}
                </div> }
            </div>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};