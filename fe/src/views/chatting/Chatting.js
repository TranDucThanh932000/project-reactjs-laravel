import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { connect } from "react-redux";
import {
  openAndCloseChatting,
  sendMessage,
  updateCurrentMsg,
} from "../../store/actions/chattingAction";
import store from "../../store";
import SendIcon from "@mui/icons-material/Send";
import Pusher from "pusher-js";
import styles from "./Chatting.module.scss";
import classNames from "classnames/bind";
import * as chattingService from "../../services/chattingService"

const cx = classNames.bind(styles);

const mapStateToProps = (state) => {
  return {
    chatting: state.chattingReducer.chatting,
    currentUser: state.commonReducer.currentUser,
  };
};

const Chatting = (props) => {

  React.useEffect(() => {
    if(props.chatting.length) {
      document.getElementById('end-' + props.chatting.length).scrollIntoView({ behavior: 'smooth' });
    }
  }, [props.chatting]);

  const handleClickSendMessage = async (message, toUserId) => {
    await chattingService.sendMessage({
      toUserId,
      message
    })
    .then(() => {
    })
    .catch((err) => {
      console.log(err)
    })
  };

  const handleChangeCurrentMsg = (event, toUserId) => {
    store.dispatch(updateCurrentMsg({
      currentMsg: event.target.value,
      toUserId
    }))
  }

  React.useEffect(() => {
    const pusher = new Pusher("0c1bb67e922d5e222312", {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data) {
      store.dispatch(
        sendMessage({
          message: data.message,
          currentUser: props.currentUser,
        })
      );
    });
  }, []);

  return (
    <>
      <Box display={"flex"} flexDirection={"row-reverse"}>
        {props.chatting.map((chat, index) => (
          <Box className={cx("chat-container")} key={chat.toUserId} sx={{ right: `${(index) * 300}px` }}>
            <div className={cx("chat-header")}>
              <h3>Chat với {chat.toUserId}</h3>
              <IconButton
                onClick={() => {
                  store.dispatch(openAndCloseChatting(chat.toUserId));
                }}
              >
                <CloseIcon></CloseIcon>
              </IconButton>
            </div>
            <div className={cx("chat-body")} id={'end-' + (index + 1)}>
              <ul className={cx("messages")}>
                {chat.msg.map((msg) =>
                  msg.toOther ? (
                    <li key={msg.id} className={cx("receiver")}>{msg.message}</li>
                  ) : (
                    <li key={msg.id} className={cx("sent")}>{msg.message}</li>
                  )
                )}
              </ul>
            </div>
            <div className={cx("chat-footer")}>
              <input 
                type="text" 
                placeholder="Nhập tin nhắn..."
                value={chat.currentMsg}
                onChange={(e) => { handleChangeCurrentMsg(e, chat.toUserId) }}/>
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      handleClickSendMessage(chat.currentMsg, chat.toUserId);
                    }}
                    edge="end"
                  >
                    <SendIcon color="primary"></SendIcon>
                  </IconButton>
                </InputAdornment>
            </div>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default connect(mapStateToProps)(Chatting);
