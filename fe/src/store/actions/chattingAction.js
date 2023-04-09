import { actionName } from "../constants";

export const openAndCloseChatting = (payload) => {
    return {
        type: actionName.OPEN_AND_CLOSE_CHAT,
        payload: payload,
    }
}

export const sendMessage = (payload) => {
    return {
        type: actionName.SEND_MESSAGE,
        payload: payload,
    }
}

export const updateCurrentMsg = (payload) => {
    return {
        type: actionName.UPDATE_CURRENT_MSG,
        payload: payload,
    }
}

export const updateUsersContacted = (payload) => {
    return {
        type: actionName.USERS_CONTACTED,
        payload: payload,
    }
}

export const openAndGetMsg = (payload) => {
    return {
        type: actionName.OPEN_AND_GET_MSG,
        payload: payload,
    }
}