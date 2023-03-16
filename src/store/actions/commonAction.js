import { actionName } from "../constants";

export const openSidebar = () => {
    return {
        type: actionName.OPEN_SIDEBAR,
        payload: true,
    }
}

export const closeSidebar = () => {
    return {
        type: actionName.OPEN_SIDEBAR,
        payload: false,
    }
}