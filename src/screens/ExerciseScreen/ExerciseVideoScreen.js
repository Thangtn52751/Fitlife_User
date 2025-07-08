import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    StatusBar,
    ActivityIndicator
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";

const ExerciseVideoScreen = ({ navigation }) => {
    const [search, setSearch] = useState("");
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popular, setPopular] = useState([]);
    const [topicList, setTopicList] = useState([]);
    
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const res = await axios.get("http://192.168.0.105:3000/api/exercises");
                // Thêm progress giả nếu chưa có từ backend
                const withProgress = res.data.map(item => ({
                    ...item,
                    progress: Math.floor(Math.random() * 100)
                }));
                setExercises(withProgress);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const res = await axios.get("http://192.168.0.105:3000/api/exercises");
                const dataWithProgress = res.data.map(item => ({
                    ...item,
                    progress: Math.floor(Math.random() * 100)
                }));

                // Phổ biến: ví dụ chọn calories >= 100
                const popularItems = dataWithProgress.filter(item => item.calories >= 100).slice(0, 3);
                const topicItems = dataWithProgress;

                setPopular(popularItems);
                setTopicList(topicItems);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);
    

    const filteredExercises = exercises.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    const handlePressExercise = (exercise) => {
        navigation.navigate("ExerciseDetailScreen", { exercise });
    };
    const PopularCard = ({ item, onPress }) => (
        <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(item)}>
            <ImageBackground source={{ uri: item.imageUrl }} style={styles.popularCard} imageStyle={{ borderRadius: 14 }}>
                <View style={styles.popularOverlay} />
                <Text style={styles.popularTitle}>{item.title}</Text>
                <View style={styles.popularInfoRow}>
                    <Ionicons name="flame-outline" size={14} color="#fff" />
                    <Text style={styles.popularInfoText}>{item.calories} Kcal</Text>
                    <Ionicons name="time-outline" size={14} color="#fff" style={{ marginLeft: 8 }} />
                    <Text style={styles.popularInfoText}>{item.durationMin} Min</Text>
                </View>
                <Ionicons name="play-circle" size={38} color="#4ade80" style={styles.playIcon} />
            </ImageBackground>
        </TouchableOpacity>
    );
    const TopicItem = ({ item, onPress }) => (
        <TouchableOpacity style={styles.topicItem} activeOpacity={0.8} onPress={() => onPress(item)}>
            <ImageBackground source={{ uri: item.imageUrl }} style={styles.topicImage} imageStyle={{ borderRadius: 12 }} />
            <View style={styles.topicContent}>
                <View style={styles.topicHeaderRow}>
                    <Text style={styles.topicTitle}>{item.title}</Text>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{item.level}</Text>
                    </View>
                </View>
                <Text style={styles.topicSubtitle}>{item.description}</Text>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${item.progress || 50}%` }]} />
                </View>
            </View>
        </TouchableOpacity>
    );
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Video Bài Tập</Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#9ca3af" style={{ marginLeft: 8 }} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#9ca3af"
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            <Text style={styles.sectionTitle}>Phổ biến</Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={popular}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <PopularCard item={item} onPress={() => navigation.navigate('ExerciseDetailScreen', { exercise: item })} />
                )}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                style={{ marginBottom: 10 }}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#4ade80" style={{ marginTop: 30 }} />
            ) : (
                <>
                    <Text style={styles.sectionTitle}>Danh sách bài tập</Text>
                    {filteredExercises.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#9ca3af' }}>
                            Không tìm thấy kết quả
                        </Text>
                    ) : (
                        <FlatList
                            data={filteredExercises}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TopicItem item={item} onPress={handlePressExercise} />
                            )}
                            contentContainerStyle={{ paddingBottom: 30 }}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </>
            )}
        </SafeAreaView>
    );
};

export default ExerciseVideoScreen;

const styles = StyleSheet.create({
    popularCard: {
        width: 240,
        height: 150,
        marginRight: 16,
        borderRadius: 14,
        overflow: "hidden",
        justifyContent: "flex-end",
        padding: 12,
    },
    popularOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.35)",
        borderRadius: 14,
    },
    popularTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    popularInfoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    popularInfoText: {
        color: "#fff",
        marginLeft: 4,
        marginRight: 8,
        fontSize: 12,
    },
    playIcon: {
        position: "absolute",
        right: 10,
        bottom: 10,
    },
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: 50
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginTop: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        marginHorizontal: 16,
        borderRadius: 12,
        height: 42,
        marginTop: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 6,
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    // Topic item
    topicItem: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginBottom: 18,
    },
    topicImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
    },
    topicContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },
    topicHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    topicTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    levelBadge: {
        backgroundColor: "#e0f2ff",
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    levelText: {
        fontSize: 10,
        color: "#0ea5e9",
        fontWeight: "500",
    },
    topicSubtitle: {
        color: "#6b7280",
        fontSize: 12,
        marginTop: 2,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: "#e5e7eb",
        borderRadius: 4,
        marginTop: 8,
    },
    progressBarFill: {
        height: 6,
        backgroundColor: "#a3e635",
        borderRadius: 4,
    },
});
