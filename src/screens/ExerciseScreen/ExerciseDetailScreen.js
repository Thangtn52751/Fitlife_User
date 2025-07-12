import React, { useState, useRef, useCallback } from 'react';
import {
    View, SafeAreaView, Text, TouchableOpacity,
    StyleSheet, Alert, ScrollView
} from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { saveExerciseHistory } from './service/historyService';
import { useSelector } from 'react-redux';

const ExerciseDetailScreen = ({ route, navigation }) => {
    const { exercise } = route.params;
    const [playing, setPlaying] = useState(true);
    const [hasFinished, setHasFinished] = useState(false);
    const playerRef = useRef();
    const user = useSelector(state => state.auth.user);

    const extractYoutubeId = (url) => {
        const match = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    };

    const onStateChange = useCallback((state) => {
        if (state === 'ended') {
            setPlaying(false);
            setHasFinished(true);
            Alert.alert('🏁 Hoàn thành', 'Bạn đã hoàn thành video bài tập!');
        }
    }, []);

    const handleSave = async () => {
        try {
            const userId = user._id;
            await saveExerciseHistory(userId, exercise);
            Alert.alert(
                '✅ Đã lưu',
                `Bài tập "${exercise.title}" đã được lưu vào lịch sử.`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('ExerciseHistoryScreen')
                    }
                ]
            );
        } catch (error) {
            console.log('❌ Lỗi chi tiết khi lưu lịch sử:', error);
            Alert.alert('❌ Lỗi', 'Không thể lưu vào lịch sử.');
        }
    };

    const handleSeekTo = (time) => {
        if (playerRef.current) {
            playerRef.current.seekTo(time, true);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={26} color="#111827" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
                <Text style={styles.headerTitle} numberOfLines={1}>{exercise.title}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ExerciseHistoryScreen')}>
                    <Ionicons name="time-outline" size={22} color="#10b981" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>

            <View style={{ width: 26 }} />

            <View style={styles.videoWrapper}>
                <YoutubePlayer
                    ref={playerRef}
                    height={230}
                    play={playing}
                    videoId={extractYoutubeId(exercise.videoUrl)}
                    onChangeState={onStateChange}
                />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.title}>{exercise.title}</Text>
                <Text style={styles.description}>{exercise.description}</Text>

                {exercise.durationMin && (
                    <Text style={styles.meta}>🕒 Thời lượng: {exercise.durationMin} phút</Text>
                )}

                <Text style={styles.segmentTitle}>📍 Các đoạn trong video</Text>
                {exercise.segments?.map((seg, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleSeekTo(seg.time)}
                        style={styles.segmentItem}
                    >
                        <Ionicons name="time-outline" size={18} color="#10b981" />
                        <Text style={styles.segmentText}> {seg.title} - {seg.time}s</Text>
                    </TouchableOpacity>
                ))}

                {hasFinished && (
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>💾 Lưu vào lịch sử</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ExerciseDetailScreen;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#e5e7eb'
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10
    },
    videoWrapper: {
        height: 230,
        backgroundColor: '#000'
    },
    content: {
        padding: 16,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827'
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 8
    },
    meta: {
        marginTop: 8,
        fontSize: 13,
        color: '#10b981',
        fontWeight: '500'
    },
    segmentTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
        color: '#111827'
    },
    segmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0fdf4',
        borderRadius: 10,
        marginBottom: 8
    },
    segmentText: {
        color: '#065f46',
        fontSize: 14,
        fontWeight: '500'
    },
    saveButton: {
        backgroundColor: '#22c55e',
        padding: 14,
        borderRadius: 12,
        marginTop: 24,
        alignItems: 'center'
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15
    }
});
