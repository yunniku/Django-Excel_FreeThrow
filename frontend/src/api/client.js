// Django API에 요청 보내는 axios 인스턴스
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 60000,
});

// 요청할 때마다 토큰 자동으로 붙여주기
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// 토큰 만료되면 자동으로 로그인 페이지로
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;