import * as React from "react";
import Box from "@mui/material/Box";
import {
  IconButton,
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
import * as chattingService from "../../services/chattingService";

const cx = classNames.bind(styles);

const mapStateToProps = (state) => {
  return {
    chatting: state.chattingReducer.chatting,
    currentUser: state.commonReducer.currentUser,
  };
};

const Chatting = (props) => {
  const messagesEndRef = React.useRef(null);
  const [pusher, setPusher] = React.useState(new Pusher("0c1bb67e922d5e222312", {
    cluster: "ap1",
    authEndpoint: 'http://localhost:8000/api/v1/chat/pusher/auth',
    auth: {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('loginToken'),
        "Access-Control-Allow-Origin": "*"
      }
    },
    encrypted: true,
  }));
  const [channel, setChannel] = React.useState(pusher.subscribe("private-chat"));
  const [arrTyping, setArrTyping] = React.useState([]);

  React.useEffect(() => {
    if (props.chatting.length && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [props.chatting.length, messagesEndRef]);

  const generateRandomKey = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  }
  
  const generateUniqueKey = (length, existingKeys) => {
    let key = generateRandomKey(length);
    while (existingKeys.includes(key)) {
      key = generateRandomKey(length);
    }
    return key;
  }

  const handleClickSendMessage = async (message, toUserId, index) => {
    await store.dispatch(
      sendMessage({
        'message': {
          content: message,
          user_id: props.currentUser.id,
          to_user_id: toUserId,
          created_at: new Date(),
          id: generateUniqueKey(16, generateRandomKey(16)),
        },
        currentUser: props.currentUser,
      })
    );

    //scroll to last message
    let list = document.getElementById('end-' + index);
    list.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
    //

    await chattingService
      .sendMessage({
        toUserId,
        message,
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeCurrentMsg = (event, toUserId, index) => {
    store.dispatch(
      updateCurrentMsg({
        currentMsg: event.target.value,
        toUserId,
      })
    );
  };

  const handleKeyPress = (e, msg, toUserId, index) => {
    if (e.key === 'Enter' && msg) {
      handleClickSendMessage(msg, toUserId, index)
    } else if (msg) {
      // trigger event when input
      channel.trigger(`client-typing-from-${props.currentUser.id}-to-${toUserId}`, 'typing-event')
      //receiver message
      props.chatting.forEach(x => {
        channel.bind(`client-typing-from-${x.toUserId}-to-${props.currentUser.id}`, function (data) {
          if(! arrTyping.includes(x.toUserId)) {
            setArrTyping((prev) => [...prev, x.toUserId]);
            setTimeout(() => {
              let newArr = arrTyping.filter(userId => userId == x.toUserId);
              setArrTyping(newArr);
            }, 2000);
          }
        })
      })
    }
  }

  React.useEffect(() => {
    channel.bind(`private-message-${props.currentUser.id}`, function (data) {
      store.dispatch(
        sendMessage({
          message: data.message,
          currentUser: props.currentUser,
        })
      );
    });
  }, [props.currentUser]);

  return (
    <>
      <Box display={"flex"} flexDirection={"row-reverse"}>
        {props.chatting.map((chat, index) => (
          <Box
            className={cx("chat-container")}
            key={chat.toUserId}
            sx={{ right: `${15 + index * 300}px` }}
          >
            <div className={cx("chat-header")}>
              <h3>Chat với {chat.toUserId}</h3>
              <IconButton
                onClick={() => {
                  store.dispatch(openAndCloseChatting(chat.toUserId));
                }}
              >
                <CloseIcon className={cx("text-white")}></CloseIcon>
              </IconButton>
            </div>
            <div className={cx("chat-body")}>
              <ul className={cx("messages")} id={"end-" + (index + 1)}>
                {chat.msg.map((msg) =>
                  msg.toOther ? (
                    <li key={msg.id} className={cx("receiver")}>
                      <div className={cx("receiver__msg")}>
                        <span>{msg.message}</span>
                      </div>
                    </li>
                  ) : (
                    <li key={msg.id} className={cx("sent")}>
                      <div className={cx("sent__msg")}>
                        <span>{msg.message}</span>
                      </div>
                    </li>
                  )
                )}
                <li className={cx(arrTyping.includes(chat.toUserId) ? '' : 'hidden')}>
                  <div className={cx('typing-indicator')}></div>
                  <div className={cx('typing-indicator')}></div>
                  <div className={cx('typing-indicator')}></div>
                </li>
                <li ref={messagesEndRef}></li>
              </ul>
            </div>
            <div className={cx("chat-footer")}>
              <input
                id={"chat-to-" + (index + 1)}
                type="text"
                placeholder="Nhập tin nhắn..."
                value={chat.currentMsg}
                onChange={(e) => {
                  handleChangeCurrentMsg(e, chat.toUserId);
                }}
                onKeyDown={(e) => {
                  handleKeyPress(e, chat.currentMsg, chat.toUserId, (index + 1));
                }}
              />
              <IconButton
                onClick={() => {
                  handleClickSendMessage(chat.currentMsg, chat.toUserId, (index + 1));
                }}
                disabled={chat.currentMsg.length === 0}
              >
                <SendIcon className={cx(chat.currentMsg.length === 0 ? 'text-gray' : 'primary')}></SendIcon>
              </IconButton>
            </div>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default connect(mapStateToProps)(Chatting);
