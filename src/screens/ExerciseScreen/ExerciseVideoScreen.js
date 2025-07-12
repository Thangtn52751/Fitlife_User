import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  ImageBackground, TouchableOpacity, TextInput,
  StatusBar, ActivityIndicator
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchYouTubeExercises } from "./service/youtubeService";

const ExerciseVideoScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchYouTubeExercises("cardio tại nhà");
      const withProgress = data.map(item => ({
        ...item,
        progress: Math.floor(Math.random() * 100)
      }));
      setExercises(withProgress);
      setFilteredExercises(withProgress);
      setPopular(withProgress.slice(0, 3));
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = exercises.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [search]);

  const handlePressExercise = (exercise) => {
    navigation.navigate("ExerciseDetailScreen", { exercise });
  };

  const PopularCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePressExercise(item)}
      activeOpacity={0.9}
      style={styles.popularCardWrapper}
    >
      <ImageBackground source={{ uri: item.imageUrl }} style={styles.popularCard}>
        <View style={styles.overlay} />
        <Text style={styles.popularTitle} numberOfLines={2}>{item.title}</Text>
        <Ionicons name="play-circle" size={42} color="#22c55e" style={styles.playIcon} />
      </ImageBackground>
    </TouchableOpacity>
  );

  const TopicItem = ({ item }) => (
    <TouchableOpacity style={styles.topicItem} onPress={() => handlePressExercise(item)}>
      <ImageBackground source={{ uri: item.imageUrl }} style={styles.topicImage} imageStyle={{ borderRadius: 12 }} />
      <View style={styles.topicContent}>
        <Text style={styles.topicTitle} numberOfLines={2}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.topicSubtitle}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📺 Video Bài Tập</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          placeholder="Tìm kiếm bài tập..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.sectionTitle}>🔥 Phổ biến</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={popular}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PopularCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />

      <Text style={styles.sectionTitle}>📂 Danh sách video</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <TopicItem item={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default ExerciseVideoScreen;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827'
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 44
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    color: '#111827',
    fontSize: 14
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    color: '#111827'
  },
  popularCardWrapper: {
    marginRight: 16
  },
  popularCard: {
    width: 280,
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 12,
    marginBottom: 120
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  popularTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15
  },
  playIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12
  },
  topicItem: {
    flexDirection: 'row',
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  topicImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e5e7eb'
  },
  topicContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center'
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937'
  },
  topicSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4
  }
});
