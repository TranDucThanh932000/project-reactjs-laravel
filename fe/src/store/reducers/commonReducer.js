import { actionName } from "../constants";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { TypeNotification, StatusRead } from "../../utils/constants";

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
  ],
  currentUser: null,
  notifications: [],
  notiStack: []
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
          state.notifications.push({
            id: action.payload.id,
            userId: action.payload.user.id,
            userName: action.payload.user.name,
            userImg: '',
            type: TypeNotification.ADD_FRIEND,
            status: StatusRead.UNREAD
          })
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
        return x.id == action.payload.id;
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
    default:
      return state;
  }
};

export default commonReducer;