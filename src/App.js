import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import "./App.css";
import Recorder from "./Components/Recorder";

function App() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const currentCallRef = useRef(null);

  useEffect(() => {
    const initializePeer = async () => {
      const peer = new Peer();

      peer.on("open", (id) => {
        setPeerId(id);
      });

      peer.on("call", (call) => {
        const answerCall = async () => {
          try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });

            localStreamRef.current = mediaStream;
            currentUserVideoRef.current.srcObject = mediaStream;

            currentUserVideoRef.current.onloadedmetadata = () => {
              currentUserVideoRef.current.play();
            };

            call.answer(mediaStream);

            call.on("stream", function (remoteStream) {
              remoteStreamRef.current = remoteStream;
              remoteVideoRef.current.srcObject = remoteStream;

              remoteVideoRef.current.onloadedmetadata = () => {
                remoteVideoRef.current.play();
              };
            });

            currentCallRef.current = call;
          } catch (error) {
            console.error("Error accessing media devices:", error);
          }
        };

        answerCall();
      });

      peerInstance.current = peer;
    };

    initializePeer();
  }, []);

  const call = async (remotePeerId) => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = mediaStream;
      currentUserVideoRef.current.srcObject = mediaStream;

      currentUserVideoRef.current.onloadedmetadata = () => {
        currentUserVideoRef.current.play();
      };

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on("stream", (remoteStream) => {
        remoteStreamRef.current = remoteStream;
        remoteVideoRef.current.srcObject = remoteStream;

        remoteVideoRef.current.onloadedmetadata = () => {
          remoteVideoRef.current.play();
        };

        currentCallRef.current = call;
      });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (currentCallRef.current) {
      currentCallRef.current.close();
    }
  };

  const copyPeerId = () => {
    if (peerId) {
      navigator.clipboard.writeText(peerId).then(() => {
        alert("ID copied to clipboard: " + peerId);
      });
    }
  };

  return (
    <div className="App">
      <h1>Current user id is {peerId}</h1>
      <button onClick={copyPeerId}>Copy ID</button>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
      />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <button onClick={endCall}>Hang Up</button>
      <Recorder />
      <div>
        <video ref={currentUserVideoRef} autoPlay playsInline muted />
      </div>
      <div>
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
    </div>
  );
}

export default App;
