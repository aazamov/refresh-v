import React, { useState } from "react";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";

function Recorder() {
  const [recordState, setRecordState] = useState(null);

  const start = () => {
    setRecordState(RecordState.START);
  };

  const stop = () => {
    setRecordState(RecordState.STOP);
  };

  const onStop = (audioData) => {
    console.log("audioData", audioData);
    const newUrl = audioData.url;

    function downloadFileFromLink(url, filename) {
      // Create a hidden anchor element for downloading
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = filename;

      // Trigger a click event to start the download
      downloadLink.click();
    }

    // Example usage:
    // Replace the URL and filename with your specific values
    const fileUrl = newUrl; // Replace with your URL
    const filename = "Desktop"; // Replace with your desired filename

    downloadFileFromLink(fileUrl, filename);
  };

  const bitrate = 8;

  // download audio

  return (
    <div>
      <AudioReactRecorder
        state={recordState}
        onStop={onStop}
        bitrate={bitrate}
        type={"audio/mp3"}
      />

      <button className="btn" onClick={start}>
        Start
      </button>
      <button className="btn" onClick={stop}>
        Stop
      </button>
    </div>
  );
}

export default Recorder;
