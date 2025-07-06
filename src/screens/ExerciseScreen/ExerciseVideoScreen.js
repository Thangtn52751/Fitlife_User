// ExerciseVideoScreen.js
// React Native UI for the "Video Bài Tập" screen based on the provided Figma.
import React, { useState } from "react";
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
    ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const POPULAR = [
    {
        id: "1",
        title: "Lower Body Training",
        image:
            "https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        calories: 500,
        duration: 50,
    },
    {
        id: "2",
        title: "Hand Strength",
        image:
            "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        calories: 600,
        duration: 40,
    },
];

const TOPIC = [
    {
        id: "a",
        title: "Push Up",
        subtitle: "100 Push up a day",
        image:
            "https://images.pexels.com/photos/4162458/pexels-photo-4162458.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        level: "Intermediate",
        progress: 45,
    },
    {
        id: "b",
        title: "Sit Up",
        subtitle: "20 Sit up a day",
        image:
            "https://images.pexels.com/photos/9491291/pexels-photo-9491291.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        level: "Beginner",
        progress: 75,
    },
    {
        id: "c",
        title: "Knee Push Up",
        subtitle: "20 Sit up a day",
        image:
            "https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        level: "Beginner",
        progress: 20,
    },
];

const PopularCard = ({ item, onPress }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(item)}>
        <ImageBackground source={{ uri: item.image }} style={styles.popularCard} imageStyle={{ borderRadius: 14 }}>
            <View style={styles.popularOverlay} />
            <Text style={styles.popularTitle}>{item.title}</Text>
            <View style={styles.popularInfoRow}>
                <Ionicons name="flame-outline" size={14} color="#fff" />
                <Text style={styles.popularInfoText}>{item.calories} Kcal</Text>
                <Ionicons name="time-outline" size={14} color="#fff" style={{ marginLeft: 8 }} />
                <Text style={styles.popularInfoText}>{item.duration} Min</Text>
            </View>
            <Ionicons name="play-circle" size={38} color="#4ade80" style={styles.playIcon} />
        </ImageBackground>
    </TouchableOpacity>
);

const TopicItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.topicItem} activeOpacity={0.8} onPress={() => onPress(item)}>
        <ImageBackground source={{ uri: item.image }} style={styles.topicImage} imageStyle={{ borderRadius: 12 }} />
        <View style={styles.topicContent}>
            <View style={styles.topicHeaderRow}>
                <Text style={styles.topicTitle}>{item.title}</Text>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{item.level}</Text>
                </View>
            </View>
            <Text style={styles.topicSubtitle}>{item.subtitle}</Text>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
            </View>
        </View>
    </TouchableOpacity>
);

const ExerciseVideoScreen = ({ navigation }) => {
    const [search, setSearch] = useState("");

    const handlePressExercise = (exercise) => {
        // TODO: navigate to detail screen
        console.log("Selected exercise", exercise.title);
    };

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

            {/* Search */}
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

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Popular Section */}
                <Text style={styles.sectionTitle}>Phổ biến</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={POPULAR}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <PopularCard item={item} onPress={() => navigation.navigate('ExerciseDetailScreen')} />}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                />

                {/* Topic Section */}
                <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Tập theo chủ đề</Text>
                {TOPIC.map((item) => (
                    <TopicItem key={item.id} item={item} onPress={handlePressExercise} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ExerciseVideoScreen;

const styles = StyleSheet.create({
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
    // Popular card
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
