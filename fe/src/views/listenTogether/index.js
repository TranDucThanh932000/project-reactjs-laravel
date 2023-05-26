import { Box, Button, Grid, TextField } from "@mui/material";
import Peer from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListenTogether.module.scss";
import YouTube from "react-youtube";
import axios from "axios";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

const cx = classNames.bind(styles);

function ListenTogether() {
  const [peerId, setPeerId] = useState(null);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const peerInstance = useRef(null);
  const videoId = useRef('');
  const [urlYoutube, setUrlYoutube] = useState("");
  const [listSong, setListSong] = useState([]);
  const connection = useRef(null);
  const [connected, setConnected] = useState(false);
  const [playing, setPlaying] = useState(true);
  const youtubeIFrame = useRef(null);
  const APIYoutubeKey = "AIzaSyBoRb3wU0c_ZzpStSumt9ygSsS1s2fXBf0";
  const [duration, setDuration] = useState(0);

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

  const getTimeVideo = () => {
    youtubeIFrame.current.internalPlayer.getDuration().then((time) => {
      let timeRounded = Math.round(time);
      setDuration(timeRounded);
    });
  };

  const handleGetInfoVideoYoutube = async (videoId) => {
    return axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${APIYoutubeKey}`
      )
      .then((res) => {
        const videoInfo = res.data.items[0].snippet;
        return {
          videoId,
          title: videoInfo.localized.title,
          channel: videoInfo.channelTitle,
          thumbnail: videoInfo.thumbnails.default.url,
        };
      });
  };

  const handleDisconnect = () => {
    videoId.current = null;
    connection.current = null;
    setRemotePeerIdValue("");
    setListSong([]);
    setConnected(false);
  };

  const handlePlay = () => {
    const connect = peerInstance.current.connect(remotePeerIdValue);
    if (playing) {
      connect.on("open", () => {
        connect.send(false);
      });
      youtubeIFrame.current.internalPlayer.pauseVideo();
    } else {
      connect.on("open", () => {
        connect.send(true);
      });
      youtubeIFrame.current.internalPlayer.playVideo();
    }
    setPlaying(!playing);
  };

  const handleConnection = useCallback(
    (conn) => {
      conn.on("data", async (data) => {
        if (data === "disconnect") {
          handleDisconnect();
          return;
        }
        if (data === true || data === false) {
          if (data === true) {
            youtubeIFrame.current.internalPlayer.playVideo();
          } else {
            youtubeIFrame.current.internalPlayer.pauseVideo();
          }
          setPlaying(data);
          return;
        }
        if (!videoId.current) {
          videoId.current = data;
        }
        await handleGetInfoVideoYoutube(data).then((data) => {
          setListSong((prev) => [...prev, data]);
        });
      });
      setRemotePeerIdValue(conn.peer);
      setConnected(true);
      connection.current = conn;
    },
    [connection, videoId.current, listSong.length, playing]
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

    getUserMedia({ video: false, audio: true }, (stream) => {
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

    getUserMedia({ video: false, audio: true }, (stream) => {
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

  const handleEnd = useCallback(() => {
    let newList = [...listSong];
    newList.shift();
    if (newList.length === 0) {
      videoId.current = null;
      setListSong([]);
      return;
    }
    if(videoId.current === newList[0].videoId) {
      youtubeIFrame.current.internalPlayer.playVideo();
    } else {
      videoId.current = newList[0].videoId;
    }
    setListSong([...newList]);
    getTimeVideo();
  });

  const handleAddSong = useCallback(async () => {
    let id = parseYtbLinkToVideoId(urlYoutube);
    // if (listSong.findIndex((x) => x === id) >= 0) {
    //   return;
    // }
    const connect = peerInstance.current.connect(remotePeerIdValue);
    connect.on("open", () => {
      connect.send(id);
    });
    if (!connected) {
      connection.current = connect;
    }
    if (!videoId.current) {
      videoId.current = id;
    }
    await handleGetInfoVideoYoutube(id).then((data) => {
      setListSong((prev) => [...prev, data]);
    });
    setUrlYoutube("");
  }, [urlYoutube, connection, listSong, videoId]);

  const handleClickConnection = () => {
    if (!connected) {
      call(remotePeerIdValue);
    } else {
      const connect = peerInstance.current.connect(remotePeerIdValue);
      connect.on("open", () => {
        connect.send("disconnect");
      });
      handleDisconnect();
    }
  };

  const handlePause = (e) => {
    e.target.pauseVideo();
  };

  const formatSecondToHour = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className={cx("wrapper")}>
      <Grid container sx={{ m: 2 }}>
        <div>
          <h1>ID của bạn là: {peerId}</h1>
          <TextField
            label="ID Phòng"
            variant="outlined"
            type="text"
            value={remotePeerIdValue}
            onChange={(e) => setRemotePeerIdValue(e.target.value)}
            style={{ marginBottom: 8, minWidth: "350px" }}
          />
          <br />
          <Button
            style={{ marginBottom: 8 }}
            variant="outlined"
            onClick={handleClickConnection}
          >
            {!connected ? "Kết nối" : "Ngắt kết nối"}
          </Button>
          <div>
            {connected && (
              <>
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
                  style={{ marginBottom: 8, minWidth: "350px" }}
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
                <div>
                  {listSong.map((song, index) =>
                    index === 0 ? (
                      <div className={cx("player")} key={index}>
                        <div
                          id="info"
                          className={cx("info", playing ? "active" : "")}
                        >
                          <span className={cx("artist")}>{song.title}</span>
                          <span className={cx("name")}>
                            {song.channel} - {formatSecondToHour(duration)}
                          </span>
                        </div>
                        <div
                          id="control-panel"
                          className={cx(
                            "control-panel",
                            playing ? "active" : ""
                          )}
                        >
                          <div
                            className={cx(
                              "album-art",
                              "image-spin",
                              playing ? "image-spin-animation" : ""
                            )}
                            style={{
                              backgroundImage: `url(${song.thumbnail})`,
                            }}
                          ></div>
                          <div className={cx("controls")}>
                            <div className={cx("prev")}></div>
                            <div
                              id="play"
                              className={cx("play")}
                              onClick={handlePlay}
                            ></div>
                            <div className={cx("next")}></div>
                          </div>
                        </div>
                        {listSong.length > 1 ? (
                          <h3
                            className={cx("bolder")}
                            style={{ marginTop: "10px" }}
                          >
                            Tiếp theo{" "}
                            <KeyboardDoubleArrowDownIcon
                              style={{ verticalAlign: "middle" }}
                            />
                          </h3>
                        ) : (
                          <></>
                        )}
                      </div>
                    ) : (
                      <div style={{ marginTop: "5px" }} key={index}>
                        <span className={cx("name")}>{song.title}</span>
                        <span className={cx("artist")}> - {song.channel}</span>
                      </div>
                    )
                  )}
                </div>

                {listSong.length === 0 && (
                  <p className={cx("text-red")}>Chưa có sẵn bài hát nào</p>
                )}
              </>
            )}
          </div>
        </div>
      </Grid>
      <YouTube
        videoId={videoId.current}
        opts={opts}
        onReady={onPlayerReady}
        onEnd={handleEnd}
        onPause={handlePause}
        onStateChange={getTimeVideo}
        ref={youtubeIFrame}
      ></YouTube>
    </div>
  );
}

export default ListenTogether;
