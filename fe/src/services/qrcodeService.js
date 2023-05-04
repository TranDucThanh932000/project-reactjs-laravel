import * as httpRequest from '../utils/httpRequest';

export const makeQrCode = async (data) => {
    try {
        const formData = new FormData();
        formData.append('inputQrCode', data.inputQrCode);
        formData.append('images[]', data.images);
        const res = await httpRequest.post('qr-code', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};