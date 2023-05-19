import { Box, Grid, TextField } from "@mui/material";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListenTogether.module.scss";

const cx = classNames.bind(styles);

function ListenTogether() {
  const [peerId, setPeerId] = useState(null);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (stream) => {
        currentUserVideoRef.current.srcObject = stream;
        currentUserVideoRef.current.play();
        call.answer(stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });

    // peer.on("connection", (conn) => {
    //   connectionHandler(conn);
    // });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (stream) => {
      currentUserVideoRef.current.srcObject = stream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, stream);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  //   const connectionHandler = (conn) => {
  //     console.log(conn)
  //     conn.on("open", () => {
  //       // only enable add music btn when connected
  //       conn.on("data", (packet) => {
  //         console.log(packet);
  //         // Data received over WebRTC
  //       });
  //     });
  //   };

  return (
    <div className={cx("wrapper")}>
      <Grid container spacing={2} sx={{ my: 2 }}>
        <div>
          <TextField
            label="Phòng"
            variant="outlined"
            type="text"
            value={remotePeerIdValue}
            onChange={(e) => setRemotePeerIdValue(e.target.value)}
          />
          <h1>{peerId}</h1>
          <button onClick={() => call(remotePeerIdValue)}>Gọi</button>
          <Box>
            <Grid container>
              <Grid item sm={12} md={6}>
                <video ref={currentUserVideoRef}></video>
              </Grid>
              <Grid item sm={12} md={6}>
                <video ref={remoteVideoRef}></video>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Grid>
    </div>
  );
}

export default ListenTogether;
