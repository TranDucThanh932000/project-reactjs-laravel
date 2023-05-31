import * as httpRequest from '../utils/httpRequest';

export const changeInfor = async (data) => {
    let formData = new FormData();
    formData.append('_method', 'put');
    formData.append('id', data.id);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('images[]', data.images);
    try {
        const res = await httpRequest.post(`user/${data.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getListFriend = async (id) => {
    try {
        const res = await httpRequest.get(`friend/list-friend/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getListBlogOfUser = async (id) => {
    try {
        const res = await httpRequest.get(`user/list-blog/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
}

export const getById = async (id) => {
    try {
        const res = await httpRequest.get(`user/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
}