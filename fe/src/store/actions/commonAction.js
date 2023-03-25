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

export const updateStatusLogin = (payload) => {
    return {
        type: actionName.STATUS_LOGIN,
        payload: payload
    }
}

export const updateStatusLoading = (payload) => {
    return {
        type: actionName.STATUS_LOADING,
        payload: payload
    }
}

export const updateTextAlert = (payload) => {
    return {
        type: actionName.TEXT_ALERT,
        payload: payload
    }
}