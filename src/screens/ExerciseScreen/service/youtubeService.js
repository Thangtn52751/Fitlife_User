const API_KEY = 'AIzaSyBET6R9TNSh-R7KD--N1H0Bf5Dk9m2wRuE';

export const fetchYouTubeExercises = async (keyword = 'cardio tại nhà') => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
        keyword
    )}&maxResults=10&key=${API_KEY}`;

    const res = await fetch(url);
    const json = await res.json();

    return json.items.map(item => ({
        _id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        imageUrl: item.snippet.thumbnails.medium.url,
        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        calories: Math.floor(Math.random() * 200) + 50,
        durationMin: Math.floor(Math.random() * 15) + 5,
        level: ['Dễ', 'Trung bình', 'Khó'][Math.floor(Math.random() * 3)],
        segments: [
            { title: 'Khởi động', time: 0 },
            { title: 'Bài chính', time: 60 },
            { title: 'Thư giãn', time: 120 }
        ]
    }));
};
