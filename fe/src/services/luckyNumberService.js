import * as httpRequest from '../utils/httpRequest';

export const today = async () => {
    try {
        const res = await httpRequest.get('lucky-number-today');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const latest = async () => {
    try {
        const res = await httpRequest.get('lucky-number-latest');
        return res;
    } catch (error) {
        console.log(error);
    }
};
