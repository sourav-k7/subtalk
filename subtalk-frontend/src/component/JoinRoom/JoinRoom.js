import React, { useEffect, useState } from "react";
import { useRoom } from "@huddle01/react/hooks";

export const JoinRoom = ({ accessToken }) => {
  const [roomId, setID] = useState("");
  const [jwt, setjwt] = useState("");
  const handleRoomChange = (event) => {
    setID(event.target.value);
    console.log(event.target.value);
  };

  const fetchToken = async () => {
    console.log(accessToken);
    const tempToken = await accessToken?.toJwt({
      accessToken,
      roomId: roomId,
    });
    setjwt({ roomId: roomId, token: tempToken });
    return { roomId: roomId, token: tempToken };
  };

  const handleJoinRoom = async () => {
    let token = await fetchToken();
    console.log(token);
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
