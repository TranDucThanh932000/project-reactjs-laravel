import * as httpRequest from '../utils/httpRequest';

export const login = async ({ account, password }) => {
    const res = await httpRequest.post('login', {
        account,
        password,
    });
    return res;
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

export const logout = async () => {
    try {
        const res = await httpRequest.post('logout');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const register = async (data) => {
    try {
        const res = await httpRequest.post('register', data);
        return res;
    } catch (error) {
        localStorage.removeItem('loginToken');
        console.log(error);
    }
}

export const checkAccount = async (account) => {
    const res = await httpRequest.get(`check-account?account=${account}`);
    return res;
}