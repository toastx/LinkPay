'use client';

const {
    Horizon,
    Networks,
    TransactionBuilder
  } = require('@stellar/stellar-sdk');

import { isConnected,requestAccess, signTransaction } from "@stellar/freighter-api";
import axios from "axios";
import { useParams } from 'next/navigation';
import { MaskContainer } from "@/components/ui/svg-mask-effect";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import  { useState } from "react";

interface PayPageProps {
    params: {
        amount: string;
        receiver: string;
        key?: string;
    };
}

export default function PayPage({ params }: PayPageProps) {

    const server = new Horizon.Server('https://horizon-futurenet.stellar.org');
    const [address, setAddress] = useState("");
   
    const {amount, receiver, key} = params

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

    async function pay(){
        await getPubkey();
        const data = {
            'amount': parseFloat(amount),
            'receiver': receiver,
            'key': key,
            'sender': address
        };
        console.log(data);
        try {
            const response = await axios.post('http://127.0.0.1:5000/pay', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'http://127.0.0.1:5000'
                },
            });

            let xdr = response.data["xdr"]
            let tx = await signTransaction(xdr,{networkPassphrase: Networks.FUTURENET})
            console.log(tx)
            
            const transactionToSubmit = TransactionBuilder.fromXDR(
                tx,
                Networks.FUTURENET
              );

            const final = await server.submitTransaction(transactionToSubmit);
            console.log(final)

        } catch (error) {
            console.error('Error:', error);
        }
    }



    

    return (
        <div className="h-screen w-full flex items-center flex-col justify-center mx-8 overflow-hidden md:flex-row">
            <MaskContainer
                revealText={
                    <p className="max-w-4xl mx-auto text-white-800 text-center text-4xl font-bold">
                        Successfully fetched the request.
                    </p>
                }
                className="h-[40rem] rounded-md"
            >
                A <span className="text-red-500">simplest</span> way to send and receive funds. A simplest way to
                <span className="text-red-500">onboard</span> users to
                <span className="text-red-500">web3</span>.
            </MaskContainer>

            <Card className="w-[350px] mx-36">
                <CardHeader>
                    <CardTitle>Pay {amount}</CardTitle>
                    <CardDescription>To {receiver}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                    <Button className=" flex w-52" onClick={() => pay()}>Pay</Button>
                </CardFooter>
            </Card>
        </div>
    );
}