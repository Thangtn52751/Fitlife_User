import axios from 'axios';
import { API_BASE_URL } from '../../config';

export const saveRoute = (gpsPoints, stats, userId) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/routes`, {
            gpsPoints,
            stats,
            userId,
        });
        dispatch({ type: 'SAVE_ROUTE_SUCCESS', payload: response.data });
    } catch (err) {
        dispatch({ type: 'SAVE_ROUTE_FAILURE', payload: err.message });
    }
};
