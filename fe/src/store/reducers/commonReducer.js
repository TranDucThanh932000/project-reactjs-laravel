import { actionName } from "../constants";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

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
  ]
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
    default:
      return state;
  }
};

export default commonReducer;