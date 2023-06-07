import * as httpRequest from '../utils/httpRequest';

export const getTop5Follower = async () => {
    try {
        const res = await httpRequest.get('/follow/top5');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const follow = async (follower) => {
    try {
        const res = await httpRequest.post('/follow', {
            follower
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const unfollow = async (follower) => {
    try {
        const res = await httpRequest.destroy(`/follow/${follower}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const checkStatusFollowing = async (follower) => {
    try {
        const res = await httpRequest.get(`/follow/status/${follower}`);
        return res;
    } catch (error) {
        console.log(error);
    } 
}