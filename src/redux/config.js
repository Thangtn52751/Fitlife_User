import axios from 'axios';

export const API_BASE_URL = 'http://192.168.1.13:3000/api';
export const API_SONG_URL = 'http://192.168.1.13:3000'

export const AUTH_URL     = `${API_BASE_URL}/auth`;
export const SONG_URL     = `${API_SONG_URL}/songs/song`;
export const BMI_URL      = `${API_BASE_URL}/bmi/user`
export const ADD_BMI_URL  = `${API_BASE_URL}/bmi`
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;