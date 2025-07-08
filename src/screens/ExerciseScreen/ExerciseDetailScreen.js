import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Video from "react-native-video";
import axios from "axios";

const ExerciseDetailScreen = ({ route, navigation }) => {
    const { exercise } = route.params;
    const videoRef = useRef(null);

    const [rounds, setRounds] = useState([]);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [countdown, setCountdown] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const fetchRounds = async () => {
            try {
                const res = await axios.get(`http://192.168.0.105:3000/api/exercise-rounds/${exercise._id}`);
                const sorted = res.data.sort((a, b) => a.order - b.order);
                setRounds(sorted);
            } catch (error) {
                console.error("Lỗi khi tải rounds:", error);
            }
        };
        fetchRounds();
    }, [exercise._id]);

    // Đếm ngược và seek video
    useEffect(() => {
        let timer;
        if (isRunning && countdown !== null) {
            if (countdown > 0) {
                timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            } else {
                if (currentRoundIndex < rounds.length - 1) {
                    const nextIndex = currentRoundIndex + 1;
                    const nextRound = rounds[nextIndex];
                    setCurrentRoundIndex(nextIndex);
                    setCountdown(nextRound.durationSec);

                    // Tính tổng giây để seek video
                    let offset = 0;
                    for (let i = 0; i < nextIndex; i++) {
                        offset += rounds[i].durationSec;
                    }
                    videoRef.current?.seek(offset);
                } else {
                    setIsFinished(true);
                    setIsRunning(false);
                    Alert.alert("🎉 Đã hoàn thành bài tập!");
                }
            }
        }
        return () => clearTimeout(timer);
    }, [countdown, isRunning]);

    const handleStart = () => {
        if (rounds.length === 0) return;
        setIsRunning(true);
        setCountdown(rounds[0].durationSec);
        setCurrentRoundIndex(0);
        setIsFinished(false);
        videoRef.current?.seek(0);
    };

    const currentRound = rounds[currentRoundIndex];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>

                <Text style={styles.heading}>{exercise.title}</Text>

                <View style={styles.videoContainer}>
                    <Video
                        ref={videoRef}
                        source={{ uri: exercise.videoUrl }}
                        style={styles.video}
                        controls
                        resizeMode="cover"
                        paused={!isRunning}
                    />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{exercise.title}</Text>
                    <Text style={styles.description}>{exercise.description}</Text>

                    <View style={styles.detailsRow}>
                        <Text style={styles.detailText}>⏱ {exercise.durationMin} phút</Text>
                        <Text style={styles.detailText}>🔥 {exercise.calories} calo</Text>
                        <Text style={styles.detailText}>📈 Cấp độ: {exercise.level}</Text>
                    </View>

                    {rounds.length > 0 && (
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.roundsTitle}>Các bước thực hiện:</Text>
                            {rounds.map((r, i) => (
                                <Text
                                    key={r._id}
                                    style={[
                                        styles.roundText,
                                        i === currentRoundIndex && isRunning && !isFinished && {
                                            fontWeight: "700",
                                            color: "#4ade80",
                                        },
                                    ]}
                                >
                                    {r.order}. {r.title} ({r.durationSec} giây)
                                </Text>
                            ))}
                        </View>
                    )}

                    {isRunning && !isFinished && (
                        <View style={styles.countdownBox}>
                            <Text style={styles.countdownLabel}>🕒 {currentRound?.title}</Text>
                            <Text style={styles.countdownValue}>{countdown}s</Text>
                        </View>
                    )}

                    {!isRunning && !isFinished && (
                        <TouchableOpacity style={styles.completeButton} onPress={handleStart}>
                            <Text style={styles.completeText}>▶️ Bắt đầu</Text>
                        </TouchableOpacity>
                    )}

                    {isFinished && (
                        <TouchableOpacity style={styles.completeButton} onPress={() => navigation.goBack()}>
                            <Text style={styles.completeText}>🔁 Quay về</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ExerciseDetailScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    backButton: {
        position: "absolute",
        top: 14,
        left: 12,
        zIndex: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 18,
    },
    videoContainer: {
        width: "90%",
        height: 200,
        alignSelf: "center",
        marginTop: 20,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#000",
    },
    video: {
        width: "100%",
        height: "100%",
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
    },
    description: {
        fontSize: 13,
        color: "#6b7280",
        lineHeight: 20,
    },
    detailsRow: {
        marginTop: 20,
        gap: 10,
    },
    detailText: {
        fontSize: 14,
        color: "#374151",
    },
    roundsTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    roundText: {
        fontSize: 14,
        color: "#374151",
        paddingVertical: 4,
    },
    countdownBox: {
        marginTop: 30,
        alignItems: "center",
    },
    countdownLabel: {
        fontSize: 16,
        marginBottom: 6,
    },
    countdownValue: {
        fontSize: 38,
        fontWeight: "800",
        color: "#facc15",
    },
    completeButton: {
        marginTop: 30,
        backgroundColor: "#4ade80",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    completeText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
