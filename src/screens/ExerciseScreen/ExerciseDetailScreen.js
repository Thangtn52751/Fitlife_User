import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const MOCK_DETAIL = {
    title: "Lower Body Training",
    description:
        "The lower abdomen and hips are the most difficult areas of the body to reduce when we are on a diet. Even so, in this area, especially the legs as a whole, you can reduce weight even if you don’t use tools.",
    image:
        "https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    rounds: [
        { id: 1, title: "Jumping Jacks", duration: "00:30", image: "https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg" },
        { id: 2, title: "Squats", duration: "01:00", image: "https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg" },
        { id: 3, title: "Backward Lunge", duration: "00:30", image: "https://images.pexels.com/photos/9491291/pexels-photo-9491291.jpeg" },
        // ... thêm nếu muốn
    ],
};

const RoundItem = ({ item }) => (
    <View style={styles.roundItem}>
        <Image source={{ uri: item.image }} style={styles.roundImage} />
        <View style={{ flex: 1 }}>
            <Text style={styles.roundTitle}>{item.title}</Text>
            <Text style={styles.roundTime}>{item.duration}</Text>
        </View>
        <TouchableOpacity>
            <Ionicons name="play" size={24} color="#000" />
        </TouchableOpacity>
    </View>
);

const ExerciseDetailScreen = ({ route, navigation }) => {
    const { title, description, image, rounds } = MOCK_DETAIL; // sau này lấy từ route.params hoặc API

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>

                <Text style={styles.heading}>Tên Bộ Bài Tập</Text>

                <ImageBackground source={{ uri: image }} style={styles.thumbnail} imageStyle={{ borderRadius: 16 }}>
                    <Ionicons
                        name="play-circle"
                        size={48}
                        color="#ec4899"
                        style={styles.playIcon}
                    />
                </ImageBackground>

                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>

                    <View style={styles.roundsRow}>
                        <Text style={styles.roundsLabel}>Rounds</Text>
                        <Text style={styles.roundsCount}>1/{rounds.length}</Text>
                    </View>

                    {rounds.map((round) => (
                        <RoundItem key={round.id} item={round} />
                    ))}
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
        marginTop: 50
    },
    backButton: {
        position: "absolute",
        top: 14,
        left: 12,
        zIndex: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 18,
    },
    thumbnail: {
        width: "90%",
        height: 180,
        alignSelf: "center",
        marginTop: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    playIcon: {
        opacity: 0.9,
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
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
    roundsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
        marginBottom: 8,
    },
    roundsLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
    roundsCount: {
        fontSize: 14,
        fontWeight: "500",
    },
    roundItem: {
        flexDirection: "row",
        backgroundColor: "#bae6fd",
        padding: 10,
        marginBottom: 10,
        borderRadius: 14,
        alignItems: "center",
    },
    roundImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 12,
    },
    roundTitle: {
        fontSize: 14,
        fontWeight: "600",
    },
    roundTime: {
        fontSize: 12,
        color: "#0891b2",
        marginTop: 2,
    },
});
