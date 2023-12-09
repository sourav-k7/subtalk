import React, { useEffect, useState } from "react";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { useRoom } from "@huddle01/react/hooks";

export const JoinRoom = () => {
  const [roomId, setID] = useState("");
  const [jwt, setjwt] = useState("");
  const [accessToken, setAccessToken] = useState();
  const handleRoomChange = (event) => {
    setID(event.target.value);
  };

  const fetchToken = async (accToken) => {
    const tempToken = await accToken?.toJwt({
      accessToken: accToken,
      roomId: roomId,
    });
    setjwt({ roomId: roomId, token: tempToken });
    return { roomId: roomId, token: tempToken };
  };

  const handleJoinRoom = async () => {
    let accToken = await createAccessToken(roomId);
    setAccessToken(accToken);
    let token = await fetchToken(accToken);
    joinRoom(token);
  };

  const { joinRoom, leaveRoom } = useRoom({
    onJoin: () => {
      console.log("Joined the room");
    },
    onLeave: () => {
      console.log("Left the room");
    },
  });

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

  return (
    <div className="">
      <label htmlFor="roomName">Room Name:</label>
      <input
        type="text"
        id="roomId"
        name="roomID"
        value={roomId}
        onChange={handleRoomChange}
        required
      />

      <button type="submit" onClick={handleJoinRoom}>
        Join Room
      </button>
    </div>
  );
};
