import { useRemoteAudio, useRemoteVideo } from "@huddle01/react/hooks";
import React, { useEffect, useRef, useState } from "react";
import translate from "translate";

const RemotePeer = ({ peerId }) => {
  const [subTitle, setSubTitle] = useState("");
  const wsRef = useRef(null);
  // const wsUrl = `wss://api.rev.ai/speechtotext/v1/stream?access_token=02PW3mjjokhQYAtlrL0Ijz169-C0za5d_K4OTS3prgLwYJf79MnwQJi86xuTzlS6FQWRU03ShqtxEcynjTa7H4bPFdJMk&content_type=audio/x-raw;layout=interleaved;rate=16000;format=S16LE;channels=1`;

  const { stream: videoStream, state: videoState } = useRemoteVideo({ peerId });
  const {
    stream: audioStream,
    state: audioState,
    track: audioTrack,
  } = useRemoteAudio({
    peerId,
    onPlayable: (data) => {
      wsRef.current = new WebSocket(
        "wss://api.rev.ai/speechtotext/v1/stream?access_token=02PW3mjjokhQYAtlrL0Ijz169-C0za5d_K4OTS3prgLwYJf79MnwQJi86xuTzlS6FQWRU03ShqtxEcynjTa7H4bPFdJMk&content_type=audio/webm;layout=interleaved;rate=16000;format=S16LE;channels=1&skip_postprocessing=true&priority=speed"
      );

      console.log("from on playable ", data);
      const mediaRecorder = new MediaRecorder(data.stream, {
        mimeType: "audio/webm",
      });
      console.log("media Recorder playable", mediaRecorder);
      let chunks = [];
      wsRef.current.onopen = () => {
        console.log("In socket open connection");
        mediaRecorder.ondataavailable = async (e) => {
          if (e.data.size > 0) {
            const buffer = await e.data.arrayBuffer();
            console.log("media recorder data playable", e.data);
            console.log("buffere data ", buffer);
            wsRef.current.send(buffer);
            // wsUrl.send(e.data);
            chunks.push(e.data);
          }
        };
      };

      wsRef.current.onmessage = (event) => {
        console.log("On message function", event.data);
        const data = JSON.parse(event.data);
        let subT = "";
        data.elements?.forEach((textObj) => {
          if (textObj.value !== "<unk>") subT += textObj.value;
        });
        console.log('subT',subT);
        subT = subT.trim();
        if (subT !== "" && data.type==="final") {
          textTranslate(subT);
        }
        // setSubTitle(subT);
      };

      // mediaRecorder.onstop = () => {
      //   const recordedBlob = new Blob(chunks, { type: 'audio/webm' });
      // Do something with the recordedBlob (e.g., save it, play it, etc.)
      //   console.log("recorded blob", recordedBlob)
      // };

      mediaRecorder.start();

      setInterval(() => {
        if (mediaRecorder?.state === "recording") {
          mediaRecorder.requestData();
        }
      }, 3000);

      // setTimeout(() => {
      //   mediaRecorder.stop();
      // }, 10000); // Stop recording after 5 second
    },
    onClose: () => {},
  });
  const vidRef = useRef(null);
  const audioRef = useRef(null);
  console.log("remote audio stream", audioStream);
  console.log("remote video stream", videoStream);

  const textTranslate  =async (subT)=>{
    translate.engine = "google";
    translate.key = process.env.DEEPL_KEY;
    const text = await translate(subT, "hi");
    setSubTitle(text);
  }

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
    const msg = new SpeechSynthesisUtterance()
    msg.lang='hi-IN';
    msg.text = subTitle
    window.speechSynthesis.speak(msg)
  }, [subTitle])


  useEffect(() => {
    console.log("audio stream", audioStream);
    console.log("audio track ", audioTrack);

    if (audioStream && audioRef.current && audioState === "playable") {
      audioRef.current.srcObject = audioStream;
      console.log("audio peer stream ", audioStream);

      // const mediaRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });
      // console.log("media Recorder", mediaRecorder)
      // let chunks = [];
      // mediaRecorder.ondataavailable = (e) => {
      //   console.log("media recorder", e.data)
      //   chunks.push(e.data);
      // };

      audioRef.current.onloadedmetadata = async () => {
        try {
          console.log("in audioRef", audioRef.current);
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
    <div className="text-center">
      <video
        ref={vidRef}
        autoPlay
        muted
        className="border-2 rounded-xl border-white-400 aspect-video bg-black"
      />
      <audio ref={audioRef} autoPlay></audio>
      {subTitle}
    </div>
  );
};

export default RemotePeer;
