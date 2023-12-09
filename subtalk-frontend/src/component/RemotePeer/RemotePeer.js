import {
  useLocalAudio,
  useRemoteAudio,
  useRemoteVideo,
} from "@huddle01/react/hooks";

export const RemotePeer = ({ peerId }) => {
  const { stream } = useRemoteAudio({ peerId });

  console.log("audio stream", stream);

  return <Audio stream={stream} />;
};
