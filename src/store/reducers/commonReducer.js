import { actionName } from "../constants";

const initialState = {
  openSidebar: true,
  sideBarItems: [
    {
      text: 'Blog',
      url: '/'
    },
    {
      text: 'Email',
      url: '/email'
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
    default:
      return state;
  }
};

export default commonReducer;