import { API_BASE_URL } from "../../../redux/config";

export const saveExerciseHistory = async (userId, exercise) => {
    try {
        const res = await fetch(`${API_BASE_URL}/history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                videoId: exercise._id,
                title: exercise.title,
                thumbnail: exercise.imageUrl,
                duration: exercise.durationMin,
                timestamp: new Date().toISOString()
            })
        });
        return await res.json();
    } catch (err) {
        console.error('Lỗi khi lưu lịch sử:', err);
        throw err;
    }
};

export const fetchExerciseHistory = async (userId) => {
    try {
        const res = await fetch(`${API_BASE_URL}/history/${userId}`);
        return await res.json();
    } catch (err) {
        console.error('Lỗi khi lấy lịch sử:', err);
        return [];
    }
};