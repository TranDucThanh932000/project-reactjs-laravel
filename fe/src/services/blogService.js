import * as httpRequest from '../utils/httpRequest';

export const blogs = async (from, amount, categories) => {
    if(categories != '') {
        categories = categories.map(x => x.id).join('-');
    }
    try {
        const res = await httpRequest.get(`/blogs?from=${from}&amount=${amount}&categories=${categories}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const createBlogs = async (data) => {
    try {
        let formData = new FormData();
        formData.append('title', data.title);
        formData.append('shortDescription', data.shortDescription);
        formData.append('description', data.description);
        for(let i = 0; i < data.images.length; i++) {
            formData.append('images[]', data.images[i]);
        }
        const res = await httpRequest.post(`/blogs`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

