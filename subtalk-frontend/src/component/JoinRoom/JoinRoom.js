import React, { useState } from "react";
import { useRoom } from "@huddle01/react/hooks";

export const JoinRoom = ({ createAccessToken, fetchToken,onRoomLeave,onRoomJoin }) => {
  const [roomId, setRoomId] = useState("");
  const handleRoomChange = (event) => {
    setRoomId(event.target.value);
  };

  const handleJoinRoom = async () => {
    let accToken = await createAccessToken(roomId);
    console.log(accToken);
    let token = await fetchToken(accToken, roomId);
    console.log(token);
    joinRoom(token);
  };

  const { joinRoom } = useRoom({
    onJoin: () => {
      onRoomJoin();
      console.log("Joined the room");
    },
    onLeave: () => {
      onRoomLeave();
      console.log("Left the room");
    },
  });

  return (
    <div>
      <input type="text" className="rounded" placeholder="Enter room id" value={roomId} onChange={handleRoomChange} />
      <button className="ml-3 outline-btn-secondary text-seconday py-2 px-3" onClick={handleJoinRoom}>
        Join Room
      </button>
    </div>
  );
};
