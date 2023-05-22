import { Box, Button, Grid, TextField } from "@mui/material";
import Peer from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListenTogether.module.scss";
import YouTube from "react-youtube";

const cx = classNames.bind(styles);

function ListenTogether() {
  const [peerId, setPeerId] = useState(null);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const peerInstance = useRef(null);
  const videoId = useRef("");
  const [urlYoutube, setUrlYoutube] = useState("");
  const [listSong, setListSong] = useState([]);
  const connection = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    peerInstance.current = new Peer();
  }, []);

  useEffect(() => {
    peerInstance.current.on("open", (id) => {
      setPeerId(id);
    });

    peerInstance.current.on("call", handleCall);
    peerInstance.current.on("connection", handleConnection);

    return () => {
      peerInstance.current.off("call", handleCall);
      peerInstance.current.off("connection", handleConnection);
    };
  }, [connection, peerInstance]);

  const handleConnection = useCallback(
    (conn) => {
      conn.on("data", (data) => {
        if (!videoId.current) {
          videoId.current = data;
        }
        setListSong((prev) => [...prev, data]);
      });
      setRemotePeerIdValue(conn.peer);
      setConnected(true);
      connection.current = conn;
    },
    [connection, videoId, listSong]
  );

  const parseYtbLinkToVideoId = useCallback((url) => {
    let regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }, []);

  const handleCall = (call) => {
    setConnected(true);
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
  };

  const call = (remotePeerId) => {
    const connect = peerInstance.current.connect(remotePeerId);
    // connect.on("open", () => {
    //   connect.send("Send connect");
    // });
    connection.current = connect;

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
    setRemotePeerIdValue(remotePeerId);
    setConnected(true);
  };

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
    },
  };

  const onPlayerReady = (event) => {
    event.target.playVideo();
  };


  const handleEnd = useCallback((e) => {
    let newList = [...listSong];
    newList.shift();
    videoId.current = newList[0];
    setListSong([...newList]);
  });

  const handleAddSong = useCallback(() => {
    let id = parseYtbLinkToVideoId(urlYoutube);
    if(listSong.findIndex(x => x === id) >= 0) {
      return;
    }
    if (!connected) {
      const connect = peerInstance.current.connect(remotePeerIdValue);
      connect.on("open", () => {
        connect.send(id);
      });
      connection.current = connect;
    } else {
      connection.current.send(id);
    }
    if (!videoId.current) {
      videoId.current = id;
    }
    setListSong((prev) => [...prev, id]);
    setUrlYoutube('');
  }, [urlYoutube, connection, listSong]);

  const handleClickConnection = () => {
    if (!connected) {
      call(remotePeerIdValue)
    } else {
      connection.current = null;
      setConnected(false);
    }
  }

  return (
    <div className={cx("wrapper")}>
      <Grid container spacing={2} sx={{ m: 2 }}>
        <div>
          <h1>ID của bạn là: {peerId}</h1>
          <TextField
            label="Phòng"
            variant="outlined"
            type="text"
            value={remotePeerIdValue}
            onChange={(e) => setRemotePeerIdValue(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <br />
          <Button style={{ marginBottom: 8 }} variant="outlined" onClick={handleClickConnection}>
            {! connected ? "Kết nối" : "Ngắt kết nối"}
          </Button>

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
          <TextField
            label="Đường dẫn Youtube"
            variant="outlined"
            type="text"
            value={urlYoutube}
            onChange={(e) => setUrlYoutube(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <br />
          <Button
            variant="outlined"
            onClick={handleAddSong}
            style={{ marginBottom: 8 }}
          >
            Thêm bài hát
          </Button>
          <br />
          <ol>
            {listSong.map((song) => (
              <li
                key={song}
                className={cx(song === videoId.current ? "bolder" : "")}
              >
                {song}
              </li>
            ))}
          </ol>
          {listSong.length === 0 && <p className={cx('text-red')}>Chưa có sẵn bài hát nào</p>}
        </div>
      </Grid>
      <YouTube
        videoId={videoId.current}
        opts={opts}
        onReady={onPlayerReady}
        onEnd={handleEnd}
      ></YouTube>
    </div>
  );
}

export default ListenTogether;
