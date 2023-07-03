import * as httpRequest from '../utils/httpRequest';

export const tips = async (id) => {
    try {
        const res = await httpRequest.get(`tips/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

