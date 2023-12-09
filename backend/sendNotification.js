import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import dotenv from 'dotenv';
dotenv.config(); 

const PK = process.env.PK;
console.log(PK);
const Pkey = `0x${process.env.PK}`;
const signer = new ethers.Wallet(Pkey);

const sendNotification = async() => {
  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 1, 
      identityType: 2, 
      notification: {
        title: `Heyy, your friend joined the stream`,
        body: `Your friend has joined the stream, enjoy the stream over subtalk`
      },
      payload: {
        title: `Heyy, your friend joined the stream`,
        body: `Your friend has joined the stream, enjoy the stream over subtalk`,
        cta: '',
        img: ''
      },
      recipients: '',//['eip155:5:0x6BE7Cc13326907f3AF2D3C173B58f60a6d0A231e', 'eip155:5:0x2278D5cC7f7c7241049Ff9B300A3A89Ca14E0376'], // recipient address
      channel: 'eip155:5:0xFaadD7A7091bd909D90893317a9A94ae7B32fA18', // your channel address
      env: 'staging'
    });
    
    console.log('API repsonse: ', apiResponse);
  } catch (err) {
    console.error('Error: ', err);
  }
}

sendNotification();



/// NFT published
// NFT bought
//payouts released