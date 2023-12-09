import React from "react";

export const JoinRoom = () => {
  return (
    <div className="">
      <form onSubmit={handleJoinRoom}>
        <label htmlFor="roomName">Room Name:</label>
        <input
          type="text"
          id="roomName"
          name="roomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />

        <label htmlFor="userName">Your Name:</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};
