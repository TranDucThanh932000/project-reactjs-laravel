import axios from "axios";
import jwt_decode from 'jwt-decode';

const httpRequest = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

httpRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("loginToken");
    if (token && token !== 'undefined' && token !== 'null') {
      const decodedToken = jwt_decode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        // Token đã hết hạn, gửi yêu cầu đến API để lấy token mới
        return axios
          .post(process.env.REACT_APP_BASE_URL + "refresh-token", { token })
          .then((response) => {
            const newToken = response.data.token;
            if(newToken) {
              localStorage.setItem("loginToken", newToken);
            } else {
              localStorage.removeItem("loginToken");
            }
            config.headers.Authorization = `Bearer ${newToken}`;
            return Promise.resolve(config);
          })
          .catch((error) => {
            // Xử lý lỗi khi lấy token mới không thành công
            localStorage.removeItem("loginToken");
            return Promise.reject(error);
          });
      } else {
        config.headers.Authorization = `Bearer ${token}`;
        return Promise.resolve(config);
      }
    } else {
      localStorage.removeItem("loginToken");
      return Promise.resolve(config);
    }
  },
  (error) => {
    // Xử lý lỗi khi không thể gửi yêu cầu đến API
    localStorage.removeItem("loginToken");
    return Promise.reject(error);
  }
);

export const get = async (path, options = {}) => {
  const response = await httpRequest.get(path, options);
  return response.data;
};

export const post = async (path, options = {}, config = {}) => {
  const response = await httpRequest.post(path, options, config);
  return response.data;
};

export const destroy = async (path, options = {}) => {
  const response = await httpRequest.delete(path, options);
  return response.data;
};

export default httpRequest;
