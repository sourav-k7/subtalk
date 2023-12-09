import React, { useState } from "react";
import { useRoom } from "@huddle01/react/hooks";
import { RoomJoinStatus } from "../../App";
import Loader from "../loader";

export const JoinRoom = ({
  createAccessToken,
  fetchToken,
  setRoomJoinStatus,
  isRoomJoined,
}) => {
  const [roomId, setRoomId] = useState("");
  const handleRoomChange = (event) => {
    setRoomId(event.target.value);
  };

  const handleJoinRoom = async () => {
    setRoomJoinStatus(RoomJoinStatus.Joining);
    let accToken = await createAccessToken(roomId);
    console.log(accToken);
    let token = await fetchToken(accToken, roomId);
    console.log(token);
    joinRoom(token);
  };

  const { joinRoom } = useRoom({
    onJoin: () => {
      setRoomJoinStatus(RoomJoinStatus.Joined);
      console.log("Joined the room");
    },
    onLeave: () => {
      setRoomJoinStatus(RoomJoinStatus.NotJoined);
      console.log("Left the room");
    },
  });

  return (
    <div className="flex">
      <input
        type="text"
        className="rounded"
        placeholder="Enter room id"
        value={roomId}
        onChange={handleRoomChange}
      />
      {isRoomJoined === RoomJoinStatus.Joining ? (
        <Loader />
      ) : (
        <button
          className="ml-3 outline-btn-secondary text-seconday py-2 px-3"
          onClick={handleJoinRoom}
        >
          Join Room
        </button>
      )}
    </div>
  );
};
