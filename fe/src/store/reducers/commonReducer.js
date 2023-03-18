import { actionName } from "../constants";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const initialState = {
  loading: false,
  logged: false,
  openSidebar: true,
  sideBarItems: [
    {
      text: 'Bài viết',
      url: '/',
      icon: <NewspaperIcon/>
    },
    {
      text: 'Số may mắn hôm nay',
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
    default:
      return state;
  }
};

export default commonReducer;