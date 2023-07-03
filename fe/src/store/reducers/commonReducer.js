import { actionName } from "../constants";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { QrCode, Shop } from "@mui/icons-material";
import { TypeNotification, StatusRead } from "../../utils/constants";
import HeadphonesIcon from '@mui/icons-material/Headphones';

const initialState = {
  loading: false,
  logged: false,
  openSidebar: true,
  textAlert: '',
  modeLight: localStorage.getItem('light-mode') ?? 'light',
  sideBarItems: [
    {
      text: 'Bài viết',
      url: '/',
      icon: <NewspaperIcon/>
    },
    {
      text: 'Số may mắn',
      url: '/lucky-number-today',
      icon: <StarOutlineIcon/>
    },
    {
      text: 'Tạo QRCODE',
      url: '/qr-code',
      icon: <QrCode/>
    },
    {
      text: 'Cùng nghe nhạc',
      url: '/listen-together',
      icon: <HeadphonesIcon/>
    },
    {
      text: 'Mẹo trò chơi',
      url: '/tips',
      icon: <Shop/>
    },
  ],
  currentUser: null,
  notifications: [],
  notiStack: [],
  listFriendOnline: [],
  openListFriend: false,
  listFriend: [],
  listFollowerRanking: []
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionName.OPEN_SIDEBAR:
      return {
        ...state,
        openSidebar: action.payload,
      };
    case actionName.STATUS_LOGIN:
      return {
        ...state,
        logged: action.payload
      }
    case actionName.STATUS_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    case actionName.TEXT_ALERT: 
      return {
        ...state,
        textAlert: action.payload 
      }
    case actionName.MODE_LIGHT: 
      return {
        ...state,
        modeLight: action.payload 
      }
    case actionName.CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload 
      }
    case actionName.PUSH_NOTIFICATION:
      switch(action.payload.type) {
        case TypeNotification.ADD_FRIEND: {
          state.notifications.unshift({
            id: action.payload.id,
            userId: action.payload.user.id,
            userName: action.payload.user.name,
            userImg: action.payload.user.avatar,
            type: TypeNotification.ADD_FRIEND,
            status: StatusRead.UNREAD,
            is_waiting: true
          })
          state.notifications = state.notifications.map(x => {
            if(action.payload.user.id === x.userId) {
              return {
                ...x,
                is_waiting: true
              }
            }
            return x;
          })
          break;
        }
        case TypeNotification.ACCEPT_FRIEND: {
          state.notifications.unshift({
            id: action.payload.id,
            userId: action.payload.user.id,
            userName: action.payload.user.name,
            userImg: action.payload.user.avatar,
            type: TypeNotification.ACCEPT_FRIEND,
            status: StatusRead.UNREAD
          })
          break;
        }
        case TypeNotification.FOLLOW: {
          state.notifications.unshift({
            id: action.payload.id,
            userId: action.payload.user.id,
            userName: action.payload.user.name,
            userImg: action.payload.user.avatar,
            type: TypeNotification.FOLLOW,
            status: StatusRead.UNREAD
          })
          break;
        }
        default: 
          break;
      }

      return {
        ...state,
        notifications: JSON.parse(JSON.stringify(state.notifications)),
      }
    case actionName.SET_NOTIFICATION:
      return {
        ...state,
        notifications: JSON.parse(JSON.stringify(action.payload))
      }
    case actionName.UPDATE_NOTIFICATION:
      let noti = state.notifications.find(x => {
        return x.id === action.payload.id;
      })
      noti.status = action.payload.status

      return {
        ...state,
        notifications: JSON.parse(JSON.stringify(state.notifications))
      }
    case actionName.STACK_NOTIFICATION:
      state.notiStack.push(action.payload)

      return {
        ...state,
        notiStack: JSON.parse(JSON.stringify(state.notiStack))
      }
    case actionName.REMOVE_FIRST_NOTI_STACK:
      state.notiStack.shift();  

      return {
        ...state,
        notiStack: JSON.parse(JSON.stringify(state.notiStack))
      }
    case actionName.LIST_FRIEND_ONLINE:

      return {
        ...state,
        listFriendOnline: action.payload
      }
    case actionName.UPDATE_FRIEND:
      
      return {
        ...state,
        listFriend: action.payload
      }
    case actionName.UPDATE_STATUS_POPUP_FRIEND:

      return {
        ...state,
        openListFriend: action.payload
      }
    case actionName.UPDATE_LIST_RANKING_FOLLOWER:

      return {
        ...state,
        listFollowerRanking: [...action.payload]
      }
    default:
      return state;
  }
};

export default commonReducer;