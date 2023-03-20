import * as httpRequest from '../utils/httpRequest';

export const like = async (blogId) => {
    try {
        const res = await httpRequest.post('/bloglikes', {
            blogId
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const unlike = async (blogId) => {
    try {
        const res = await httpRequest.destroy(`/bloglikes/${blogId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

