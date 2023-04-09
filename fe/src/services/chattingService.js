import * as httpRequest from '../utils/httpRequest';

export const sendMessage = async (data) => {
    try {
        const res = await httpRequest.post('chat', data);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getListUserContacted = async () => {
    try {
        const res = await httpRequest.get('chat/users-contacted');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getMessageOfFriend = async (friendId) => {
    try {
        const res = await httpRequest.get('chat/msg-friend?friendId=' + friendId);
        return res;
    } catch (error) {
        console.log(error);
    }
};