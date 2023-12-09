import { useRemoteAudio, useRemoteVideo } from "@huddle01/react/hooks";
import React, { useEffect, useRef } from "react";


const RemotePeer = ({ peerId }) => {

  // const wsUrl = `wss://api.rev.ai/speechtotext/v1/stream?access_token=02PW3mjjokhQYAtlrL0Ijz169-C0za5d_K4OTS3prgLwYJf79MnwQJi86xuTzlS6FQWRU03ShqtxEcynjTa7H4bPFdJMk&content_type=audio/x-raw;layout=interleaved;rate=16000;format=S16LE;channels=1`;

  const exampleSocket = new WebSocket("wss://api.rev.ai/speechtotext/v1/stream?access_token=02PW3mjjokhQYAtlrL0Ijz169-C0za5d_K4OTS3prgLwYJf79MnwQJi86xuTzlS6FQWRU03ShqtxEcynjTa7H4bPFdJMk&content_type=audio/x-raw;layout=interleaved;rate=16000;format=S16LE;channels=1");

  exampleSocket.onopen = (event) => {
    console.log("Opened connection")
  };

  exampleSocket.onmessage = (event) => {
    console.log("on message", event.data);
  };

  const { stream: videoStream, state: videoState } = useRemoteVideo({ peerId });
  const { stream: audioStream, state: audioState, track: audioTrack } = useRemoteAudio({
    peerId, onPlayable: (data) => {
      console.log("from on playable ", data)
      const mediaRecorder = new MediaRecorder(data.stream, { mimeType: 'audio/webm' });
      console.log("media Recorder playable", mediaRecorder)
      let chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        console.log("media recorder data playable", e.data)
        exampleSocket.send(e.data);
        // wsUrl.send(e.data);
        chunks.push(e.data);
      };
      // mediaRecorder.onstop = () => {
      //   const recordedBlob = new Blob(chunks, { type: 'audio/webm' });
      // Do something with the recordedBlob (e.g., save it, play it, etc.)
      //   console.log("recorded blob", recordedBlob)
      // };

      mediaRecorder.start();

      setInterval(() => {
        mediaRecorder.requestData();
      }, 5000)

      // setTimeout(() => {
      //   mediaRecorder.stop();
      // }, 10000); // Stop recording after 5 second
    }
  });
  const vidRef = useRef(null);
  const audioRef = useRef(null);
  console.log('remote audio stream', audioStream);
  console.log('remote video stream', videoStream);


  useEffect(() => {
    if (videoStream && vidRef.current && videoState === "playable") {
      vidRef.current.srcObject = videoStream;

      vidRef.current.onloadedmetadata = async () => {
        try {
          // console.log();
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
    console.log("audio stream", audioStream)
    console.log("audio track ", audioTrack)

    if (audioStream && audioRef.current && audioState === "playable") {
      audioRef.current.srcObject = audioStream;
      console.log("audio peer stream ", audioStream)

      // const mediaRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });
      // console.log("media Recorder", mediaRecorder)
      // let chunks = [];
      // mediaRecorder.ondataavailable = (e) => {
      //   console.log("media recorder", e.data)
      //   chunks.push(e.data);
      // };

      audioRef.current.onloadedmetadata = async () => {
        try {
          console.log("in audioRef", audioRef.current)
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