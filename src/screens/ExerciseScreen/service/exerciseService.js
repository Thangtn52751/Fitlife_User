import axios from 'axios';
import { API_BASE_URL } from '../../../redux/config';

export const fetchExercisesFromBackend = async () => {
    const res = await axios.get(`${API_BASE_URL}/exercises`);
    return res.data;
};
