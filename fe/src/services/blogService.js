import * as httpRequest from '../utils/httpRequest';

export const blogs = async () => {
    try {
        const res = await httpRequest.get('/blogs');
        return res;
    } catch (error) {
        console.log(error);
    }
};

