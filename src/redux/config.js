import axios from 'axios';

export const API_BASE_URL = 'http://192.168.1.16:3000/api';
export const API_SONG_URL = 'http://192.168.1.16:3000'

export const AUTH_URL = `${API_BASE_URL}/auth`;
export const SONG_URL = `${API_SONG_URL}/songs/song`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;