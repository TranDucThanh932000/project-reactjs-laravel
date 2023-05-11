import { actionName } from "../constants";

const initialState = {
    chatting: [],
    usersContacted: []
};

const chattingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionName.OPEN_AND_CLOSE_CHAT:
      let updListChatting = [...state.chatting];
      let index = updListChatting.findIndex(x => x.toUserId == action.payload);
      if(index >= 0) {
          updListChatting.splice(index, 1);
      }

      return {
        ...state,
        chatting: [...updListChatting],
      };
    case actionName.OPEN_AND_GET_MSG: 
      state.chatting.push(action.payload)

      return {
        ...state,
        chatting: JSON.parse(JSON.stringify(state.chatting)),
      };
    case actionName.SEND_MESSAGE:
      if(action.payload.message.user_id == action.payload.currentUser.id) {
        for(let i = 0; i < state.chatting.length; i++) {
          if (state.chatting[i].toUserId == action.payload.message.to_user_id) {
            state.chatting[i].msg.push({
              message: action.payload.message.content,
              toOther: true,
              created_at: action.payload.message.created_at,
              id: action.payload.message.id
            });
            state.chatting[i].currentMsg = ''
            break;
          }
        }
      } else {
        for(let i = 0; i < state.chatting.length; i++) {
          if (state.chatting[i].toUserId == action.payload.message.user_id) {
            state.chatting[i].msg.push({
              message: action.payload.message.content,
              toOther: false,
              created_at: action.payload.message.created_at,
              id: action.payload.message.id
            });
            state.chatting[i].currentMsg = ''
            break;
          }
        }
      }

      return {
        ...state,
        chatting: JSON.parse(JSON.stringify(state.chatting)),
      };
    case actionName.UPDATE_CURRENT_MSG:
      state.chatting.forEach(x => {
        if (x.toUserId == action.payload.toUserId) {
          x.currentMsg = action.payload.currentMsg
          return;
        }
      })

      return {
        ...state,
        chatting: JSON.parse(JSON.stringify(state.chatting)),
      };
    case actionName.USERS_CONTACTED:
      return {
        ...state,
        usersContacted: JSON.parse(JSON.stringify(action.payload)),
      };
    default:
      return state;
  }
};

export default chattingReducer;