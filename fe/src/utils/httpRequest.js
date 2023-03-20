import axios from "axios";
import jwt_decode from 'jwt-decode';

const httpRequest = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

httpRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("loginToken");
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        // Token đã hết hạn, gửi yêu cầu đến API để lấy token mới
        return axios
          .post(process.env.REACT_APP_BASE_URL + "refresh-token", { token })
          .then((response) => {
            const newToken = response.data.token;
            localStorage.setItem("loginToken", newToken);
            config.headers.Authorization = `Bearer ${newToken}`;
            return Promise.resolve(config);
          })
          .catch((error) => {
            // Xử lý lỗi khi lấy token mới không thành công
            return Promise.reject(error);
          });
      } else {
        config.headers.Authorization = `Bearer ${token}`;
        return Promise.resolve(config);
      }
    } else {
      return Promise.resolve(config);
    }
  },
  (error) => {
    // Xử lý lỗi khi không thể gửi yêu cầu đến API
    return Promise.reject(error);
  }
);

export const get = async (path, options = {}) => {
  const response = await httpRequest.get(path, options);
  return response.data;
};

export const post = async (path, options = {}) => {
  const response = await httpRequest.post(path, options);
  return response.data;
};

export const destroy = async (path, options = {}) => {
  const response = await httpRequest.delete(path, options);
  return response.data;
};

export default httpRequest;
