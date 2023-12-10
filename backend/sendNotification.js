const { PushAPI }  = require("@pushprotocol/restapi");
const hre = require("hardhat");

// const PK = process.env.PK;
// console.log(PK);
const Pkey = `0x0xb2ba1656a94c3212aa6ef384b19165224400289a920278568e6f51d6831db38d`;
const signer = new hre.ethers.Wallet(Pkey);

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
      channel: 'eip155:5:0x9750Cdf9c61941217825A00629B07F308472dec9', // your channel address
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