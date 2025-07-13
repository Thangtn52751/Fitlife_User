import axios from 'axios';
import { API_BASE_URL } from '../../../redux/config';

export const fetchRoundsByExerciseId = async (exerciseId) => {
    const res = await axios.get(`${API_BASE_URL}/exercise-rounds/${exerciseId}`);
    return res.data;
};
