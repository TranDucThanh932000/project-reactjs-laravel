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

export const updateModeLight = (payload) => {
    localStorage.setItem('light-mode', payload);
    return {
        type: actionName.MODE_LIGHT,
        payload: payload
    }
}

export const updateCurrentUser = (payload) => {
    return {
        type: actionName.CURRENT_USER,
        payload: payload
    }
}