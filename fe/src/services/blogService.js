import * as httpRequest from '../utils/httpRequest';

export const blogs = async (from, amount) => {
    try {
        const res = await httpRequest.get(`/blogs?from=${from}&amount=${amount}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

