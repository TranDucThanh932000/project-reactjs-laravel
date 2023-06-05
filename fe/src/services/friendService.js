import * as httpRequest from '../utils/httpRequest';

export const addFriend = async (friend) => {
    try {
        const res = await httpRequest.post('/friend', {
            friend
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const unFriend = async (friend) => {
    try {
        const res = await httpRequest.destroy(`/friend/${friend}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const cancelRequest = async (friend) => {
    try {
        const res = await httpRequest.post(`/friend/cancel-request`, {
            friend
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const acceptRequest = async (friend) => {
    try {
        const res = await httpRequest.post(`/friend/accept-request`, {
            friend
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const checkRelationship = async (friend) => {
    try {
        const res = await httpRequest.get(`/friend/status/${friend}`)
        return res;
    } catch (error) {
        console.log(error);
    }
}