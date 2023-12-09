import logo from "./logo.svg";
import "./App.css";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRoom } from "@huddle01/react/hooks";
import { useLocalVideo, useLocalAudio } from "@huddle01/react/hooks";
import { useLocalMedia } from "@huddle01/react/hooks";
import { usePeerIds } from "@huddle01/react/hooks";

function App() {
  const [roomId, setRoomId] = useState("");
  const [apiKey, setAPiKey] = useState("");
  const { stream, enableVideo, disableVideo, changeVideoSource } =
    useLocalVideo();
  const { enableAudio, disableAudio, changeAudioSource } = useLocalAudio();
  const { fetchStream } = useLocalMedia();

  const { joinRoom, leaveRoom } = useRoom({
    onJoin: () => {
      console.log("Joined the room");
    },
    onLeave: () => {
      console.log("Left the room");
    },
  });
  const roomIDFunction = async () => {
    const response = await axios.post(
      "https://api.huddle01.com/api/v1/create-room",
      {
        title: "Huddle01-Test",
        hostWallets: ["0x9750Cdf9c61941217825A00629B07F308472dec9"],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "NQhHo0SnGuHZ2laLUileHKxXAoKjKV-I",
        },
      }
    );

    setRoomId(response?.data?.data?.roomId);
  };
  useEffect(() => {
    setAPiKey(process.env.API_KEY);
    roomIDFunction();

    /*const accessToken = new AccessToken({
      apiKey: "NQhHo0SnGuHZ2laLUileHKxXAoKjKV-I",
      roomId: id,
      role: Role.HOST,
      permissions: {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      },
      options: {
        metadata: {
          // you can add any custom attributes here which you want to associate with the user
          walletAddress: "axit.eth",
        },
      },
    });*/
  }, []);

  // useEffect(() => {
  //   console.log(roomId);
  // }, [roomId]);
  console.log(roomId);

  return (
    <div>
      <button onClick={() => joinRoom(roomId)}>Join Room</button>
      <button onClick={() => leaveRoom(roomId)}>Leave Room</button>
      <button onClick={enableVideo}>Fetch and Produce Video Stream</button>
      <button onClick={enableAudio}>Fetch and Produce Audio Stream</button>
      <button onClick={() => fetchStream({ mediaDeviceKind: "cam" })}>
        Fetch Cam Stream
      </button>

      {/* Mic */}
      <button onClick={() => fetchStream({ mediaDeviceKind: "mic" })}>
        Fetch Mic Stream
      </button>
    </div>
  );
}

export default App;
