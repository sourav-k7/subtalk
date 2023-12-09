import "./App.css";
import axios from "axios";
import { useState } from "react";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { useRoom } from "@huddle01/react/hooks";
import { useLocalVideo, useLocalAudio } from "@huddle01/react/hooks";
import { useLocalMedia } from "@huddle01/react/hooks";
import { usePeerIds } from "@huddle01/react/hooks";
import { JoinRoom } from "./component/JoinRoom/JoinRoom";
import RemotePeer from "./component/RemotePeer/RemotePeer";
import { MdOutlineCallEnd } from "react-icons/md";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function App() {
  const [roomId, setRoomId] = useState("");
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [jwt, setJwt] = useState("");
  const [isMute, setIsMute] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const { peerIds } = usePeerIds({ roles: [Role.HOST, Role.CO_HOST] });
  const { stream, enableVideo, disableVideo, changeVideoSource } =
    useLocalVideo({
      onProduceClose: () => {
        setIsCameraOn(false);
      },
    });
  const { enableAudio, disableAudio, changeAudioSource } = useLocalAudio({
    onProduceStart: (producer) => {
      console.log("Started producing your audio stream!");
      console.log(producer);
      setIsMute(false);
    },
    onProduceClose: () => {
      setIsMute(true);
    },
  });

  const { fetchStream } = useLocalMedia();

  const { joinRoom, leaveRoom } = useRoom({
    onJoin: () => {
      setIsRoomJoined(true);
      console.log("Joined the room");
    },
    onLeave: () => {
      setIsRoomJoined(true);
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
    let rId = response?.data?.data?.roomId;
    setRoomId(rId);
    let accToken = await createAccessToken(rId);
    console.log(accToken);
    let token = await fetchToken(accToken, rId);
    joinRoom(token);
  };

  const createAccessToken = async (roomId) => {
    return new AccessToken({
      apiKey: "NQhHo0SnGuHZ2laLUileHKxXAoKjKV-I",
      roomId: roomId,
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
          walletAddress: "0x9750Cdf9c61941217825A00629B07F308472dec9",
        },
      },
    });
  };

  const fetchToken = async (accToken, rId) => {
    const tempToken = await accToken?.toJwt({
      accessToken: accToken,
      roomId: rId,
    });
    return { roomId: rId, token: tempToken };
  };

  const handleEnableAudio = async () => {
    await fetchStream({ mediaDeviceKind: "mic" });
    await enableAudio();
  };

  const handleEnableVideo = async () => {
    fetchStream({ mediaDeviceKind: "cam" });
    await enableVideo();
  };

  const handleLeaveRoom = async() =>{
    leaveRoom(jwt)
    setIsRoomJoined(false);
  }

  return (
    <div className="flex flex-col ">
      {!isRoomJoined ? (
        <div className="flex justify-center py-16 px-8">
          <button
            className="btn-secondary py-2 px-3 mr-4"
            onClick={() => createRoom()}
          >
            Create Room
          </button>

          <JoinRoom
            createAccessToken={createAccessToken}
            fetchToken={fetchToken}
            onRoomJoin={() => {
              setIsRoomJoined(true);
            }}
            onRoomLeave={() => {
              setIsRoomJoined(false);
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div>
            {peerIds.map((peerId) => {
              return <RemotePeer peerId={peerId} />;
            })}
          </div>
          <div>Room id: {roomId}</div>
          <div>
            <button
              onClick={handleLeaveRoom}
              className={`h-10 w-10 bg-red-500 rounded text-white mr-5`}
            >
              <MdOutlineCallEnd size={25} className={"m-auto"} />
            </button>
            <button
              onClick={() =>
                isCameraOn ? disableVideo() : handleEnableVideo()
              }
              className={`h-10 w-10 ${
                !isCameraOn ? "bg-red-500" : "bg-[#dadce0]"
              } text-white rounded  mr-5`}
            >
              <FaCamera size={25} className={"m-auto"} />
            </button>
            <button
              onClick={() => (!isMute ? disableAudio() : handleEnableAudio())}
              className={`h-10 w-10 ${
                isMute ? "bg-red-500" : "bg-[#dadce0]"
              } text-white rounded  mr-5`}
            >
              <FaMicrophone size={25} className={"m-auto"} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
