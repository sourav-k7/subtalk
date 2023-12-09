import { useRemoteAudio, useRemoteVideo } from "@huddle01/react/hooks";
import React, { useEffect, useRef } from "react";


const RemotePeer = ({ peerId }) => {
  const { stream: videoStream, state: videoState } = useRemoteVideo({ peerId });
  const { stream: audioStream, state: audioState } = useRemoteAudio({ peerId });
  const vidRef = useRef(null);
  const audioRef = useRef(null);
  console.log('remote audio stream',audioStream);
  console.log('remote video stream',videoStream);

  useEffect(() => {
    if (videoStream && vidRef.current && videoState === "playable") {
      vidRef.current.srcObject = videoStream;

      vidRef.current.onloadedmetadata = async () => {
        try {
          console.log("here 2");
          vidRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      vidRef.current.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [videoStream]);

  useEffect(() => {
    if (audioStream && audioRef.current && audioState === "playable") {
      audioRef.current.srcObject = audioStream;

      audioRef.current.onloadedmetadata = async () => {
        try {
          console.log("here 2");
          audioRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      audioRef.current.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [audioStream]);

  return (
    <div>
      <video
        ref={vidRef}
        autoPlay
        muted
        className="border-2 rounded-xl border-white-400 aspect-video"
      />
      <audio ref={audioRef} autoPlay></audio>
    </div>
  );
};

export default RemotePeer;