import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    FlatList,
    Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Video from "react-native-video";
import axios from "axios";
import { API_BASE_URL } from "../../redux/config";

const ExerciseDetailScreen = ({ route, navigation }) => {
    const { exercise } = route.params;
    const videoRef = useRef(null);
    const flatListRef = useRef(null);

    const [rounds, setRounds] = useState([]);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const fetchRounds = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/exercise-rounds/${exercise._id}`);
                const sorted = res.data.sort((a, b) => a.order - b.order);

                // Tính thời điểm bắt đầu mỗi round
                let time = 0;
                const roundsWithStart = sorted.map((r) => {
                    const result = { ...r, startTime: time };
                    time += r.durationSec;
                    return result;
                });

                setRounds(roundsWithStart);
            } catch (error) {
                console.error("Lỗi khi tải rounds:", error);
            }
        };
        fetchRounds();
    }, [exercise._id]);

    const handleStart = () => {
        if (rounds.length === 0) return;
        setIsRunning(true);
        setCurrentRoundIndex(0);
        setIsFinished(false);
    };

    // const handleComplete = async () => {
    //     try {
    //         await axios.post(`${API_BASE_URL}/api/history`, {
    //             exerciseId: exercise._id,
    //             timestamp: new Date(),
    //         });
    //         Alert.alert("✅ Thành công", "Đã lưu vào lịch sử!");
    //         navigation.goBack();
    //     } catch (error) {
    //         console.error("Lỗi khi lưu lịch sử:", error);
    //         Alert.alert("❌ Lỗi", "Không thể lưu lịch sử.");
    //     }
    // };

    const renderRoundItem = ({ item, index }) => {
        const isCurrent = isRunning && currentRoundIndex === index;

        return (
            <TouchableOpacity
                style={[styles.roundItem, isCurrent && !isFinished && { backgroundColor: "#bbf7d0" }]}
                onPress={() => {
                    if (videoRef.current && item.startTime !== undefined) {
                        videoRef.current.seek(item.startTime); // ⏩ Seek video
                        setCurrentRoundIndex(index);
                        setIsRunning(true);
                        setIsFinished(false);
                    }
                }}
            >
                <ImageBackground
                    source={{ uri: item.imageUrl }}
                    style={styles.roundImage}
                    imageStyle={{ borderRadius: 12 }}
                />
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                    <Text style={styles.roundTitle}>{item.title}</Text>
                    <Text style={styles.roundDuration}>00:{item.durationSec.toString().padStart(2, '0')}</Text>
                </View>
                <Ionicons name="play" size={20} color="#000" />
            </TouchableOpacity>
        );
    };

    const currentRound = rounds[currentRoundIndex];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tên Bộ Bài Tập</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.previewContainer}>
                    {!isRunning ? (
                        <TouchableOpacity
                            onPress={handleStart}
                            activeOpacity={0.8}
                            style={styles.previewTouchable}
                        >
                            <ImageBackground
                                source={{ uri: exercise.imageUrl }}
                                style={styles.previewImage}
                                imageStyle={{ borderRadius: 16 }}
                            >
                                <Ionicons name="play-circle" size={64} color="#f472b6" />
                            </ImageBackground>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.previewImage}>
                            <Video
                                ref={videoRef}
                                source={{ uri: `${API_BASE_URL}/videos/yoga.mp4` }}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                                controls
                                paused={false}
                            />
                        </View>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                    <Text style={styles.description}>{exercise.description}</Text>

                    <View style={styles.detailsRow}>
                        <Text style={styles.detailText}>⏱ {exercise.durationMin} phút</Text>
                        <Text style={styles.detailText}>🔥 {exercise.calories} calo</Text>
                        <Text style={styles.detailText}>📈 Cấp độ: {exercise.level}</Text>
                    </View>

                    <View style={styles.roundsHeader}>
                        <Text style={styles.roundsTitle}>Rounds</Text>
                        <Text style={styles.roundsProgress}>
                            {currentRoundIndex + 1}/{rounds.length}
                        </Text>
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={rounds}
                        keyExtractor={(item) => item._id}
                        renderItem={renderRoundItem}
                        scrollEnabled={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />

                    {isFinished && (
                        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                            <Text style={styles.completeText}>✅ Hoàn thành & Lưu</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ExerciseDetailScreen;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#fff", marginTop: 20 },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 10,
    },
    headerTitle: { fontSize: 16, fontWeight: "700" },
    previewContainer: { marginTop: 16, alignItems: "center" },
    previewTouchable: { width: "90%", height: 200 },
    previewImage: {
        width: "100%",
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#000",
    },
    infoContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30 },
    exerciseTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
    description: { fontSize: 13, color: "#6b7280", lineHeight: 20 },
    detailsRow: { marginTop: 20, gap: 10 },
    detailText: { fontSize: 14, color: "#374151" },
    roundsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 8,
    },
    roundsTitle: { fontSize: 16, fontWeight: "600" },
    roundsProgress: { fontSize: 14, color: "#6b7280" },
    roundItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#bfdbfe",
        padding: 10,
        borderRadius: 12,
        marginBottom: 10,
    },
    roundImage: { width: 50, height: 50 },
    roundTitle: { fontSize: 14, fontWeight: "600" },
    roundDuration: { fontSize: 12, color: "#6b7280" },
    completeButton: {
        marginTop: 30,
        backgroundColor: "#4ade80",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    completeText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
