import * as httpRequest from '../utils/httpRequest';

export const login = async ({ account, password }) => {
    try {
        const res = await httpRequest.post('login', {
            account,
            password,
        });
        return res.token;
    } catch (error) {
        console.log(error);
    }
};

export const checkToken = async () => {
    try {
        const res = await httpRequest.post('check-token', {
            token: localStorage.getItem('loginToken')
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};
