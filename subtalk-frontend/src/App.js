import "./App.css";
import axios from "axios";
import { useState } from "react";
import { Role } from "@huddle01/server-sdk/auth";
import { useRoom } from "@huddle01/react/hooks";
import { useLocalVideo, useLocalAudio } from "@huddle01/react/hooks";
import { useLocalMedia } from "@huddle01/react/hooks";
import { usePeerIds } from "@huddle01/react/hooks";
import { JoinRoom } from "./component/JoinRoom/JoinRoom";
import { RemotePeer } from "./component/RemotePeer/RemotePeer";

function App() {
  const [roomId, setRoomId] = useState("");
  const [apiKey, setAPiKey] = useState("");
  const [jwt, setJwt] = useState({});
  const { peerIds } = usePeerIds({ roles: [Role.HOST, Role.CO_HOST] });

  const { stream, enableVideo, disableVideo, changeVideoSource } =
    useLocalVideo();
  const { enableAudio, disableAudio, changeAudioSource } = useLocalAudio({
    onProduceStart: (producer) => {
      console.log("Started producing your audio stream!");
      console.log(producer);
      // your code here
    },
  });
  const { fetchStream } = useLocalMedia();

  const { joinRoom, leaveRoom } = useRoom({
    onJoin: () => {
      console.log("Joined the room");
    },
    onLeave: () => {
      console.log("Left the room");
    },
  });
  const createRoom = async () => {
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

  return (
    <div className="flex flex-col items-start">
      <button className="btn-secondary" onClick={() => createRoom()}>
        Create Room
      </button>
      <div>{roomId}</div>
      <button onClick={() => leaveRoom(jwt)}>Leave Room</button>
      <button onClick={async () => await enableVideo()}>
        Fetch and Produce Video Stream
      </button>
      <button onClick={async () => await enableAudio()}>
        Fetch and Produce Audio Stream
      </button>
      <button onClick={() => fetchStream({ mediaDeviceKind: "cam" })}>
        Fetch Cam Stream
      </button>

      {/* Mic */}
      <button
        onClick={async () => await fetchStream({ mediaDeviceKind: "mic" })}
      >
        Fetch Mic Stream
      </button>

      <JoinRoom />

      <div>
        {peerIds.map((peerId) => {
          return <RemotePeer peerId={peerId} />;
        })}
      </div>
    </div>
  );
}

export default App;
