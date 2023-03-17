import { actionName } from "../constants";

const initialState = {
  logged: false,
  openSidebar: true,
  sideBarItems: [
    {
      text: 'Blog',
      url: '/'
    },
    {
      text: 'Login',
      url: '/login'
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
    default:
      return state;
  }
};

export default commonReducer;