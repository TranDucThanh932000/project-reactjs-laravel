import * as httpRequest from '../utils/httpRequest';

export const menuTips = async () => {
    try {
        const res = await httpRequest.get('menu-tips');
        return res;
    } catch (error) {
        console.log(error);
    }
};

