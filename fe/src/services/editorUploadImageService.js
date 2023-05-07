import * as httpRequest from '../utils/httpRequest';

export const uploadImageEditor = async (data) => {
    let formData = new FormData();
    formData.append('images[]', data);
    try {
        const res = await httpRequest.post(`/upload-image-editor`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};