import * as httpRequest from '../utils/httpRequest';

export const getNotification = async () => {
    try {
        const res = await httpRequest.get('notification');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const countNotification = async () => {
    try {
        const res = await httpRequest.get('notification/count-noti-unread');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const markStatusRead = async (data) => {
    try {
        const res = await httpRequest.post('notification/mark-status-read', data);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const seenAll = async (data) => {
    try {
        const res = await httpRequest.post('notification/seen-all', data);
        return res;
    } catch (error) {
        console.log(error);
    }
};

