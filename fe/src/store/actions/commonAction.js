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

export const pushNotification = (payload) => {
    return {
        type: actionName.PUSH_NOTIFICATION,
        payload: payload
    }
}

export const setNotification = (payload) => {
    return {
        type: actionName.SET_NOTIFICATION,
        payload: payload
    }
}

export const updateNotification = (payload) => {
    return {
        type: actionName.UPDATE_NOTIFICATION,
        payload: payload
    }
}

export const updateNotiStack = (payload) => {
    return {
        type: actionName.STACK_NOTIFICATION,
        payload: payload
    }
}

export const removeFirstNotiStack = () => {
    return {
        type: actionName.REMOVE_FIRST_NOTI_STACK,
    }
}