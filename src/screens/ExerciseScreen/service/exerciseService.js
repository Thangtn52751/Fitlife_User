import axios from "axios";
import { API_BASE_URL } from "../../../redux/config";


export const fetchExercisesFromBackend = async (token = null) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/exercises`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log("📦 Dữ liệu API:", res.data);

        return Array.isArray(res.data)
            ? res.data
            : res.data.data || [];
    } catch (err) {
        console.error("❌ Lỗi API exercises:", err.response?.data || err.message);
        return [];
    }
};
