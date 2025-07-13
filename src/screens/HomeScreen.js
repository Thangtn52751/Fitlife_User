import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL, SONG_URL } from '../redux/config';

const HomeScreen = ({ navigation }) => {
  const [exercises, setExercises] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [loadingSongs, setLoadingSongs] = useState(true);

  const { user, token } = useSelector(state => state.auth);

  // ✅ Fetch exercises
  const fetchExercises = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/exercises`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;

      // ✅ Nếu res.data là mảng thì dùng luôn
      if (Array.isArray(data)) {
        setExercises(data.slice(0, 5));
      } else if (Array.isArray(data.data)) {
        setExercises(data.data.slice);
      } else {
        console.warn('⚠️ Dữ liệu exercises không đúng định dạng:', data);
        setExercises([]);
      }

    } catch (error) {
      console.error('❌ Lỗi lấy dữ liệu exercises:', error);
      setExercises([]);
    } finally {
      setLoadingExercises(false);
    }
  };


  // ✅ Fetch songs
  const fetchSongs = async () => {
    try {
      const res = await axios.get(SONG_URL);
      const songList = res.data?.data;
      if (Array.isArray(songList)) {
         const shuffled = [...songList].sort(() => 0.5 - Math.random());
      setSongs(shuffled.slice(0, 4)); 
      } else {
        console.warn('⚠️ Dữ liệu không phải array:', songList);
        setSongs([]);
      }
    } catch (error) {
      console.error('❌ Lỗi lấy dữ liệu bài hát:', error);
      setSongs([]);
    } finally {
      setLoadingSongs(false);
    }
  };
 

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchExercises();
      fetchSongs();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={user?.image ? { uri: user.image } : require('../assets/logo.png')}
            style={styles.avatar}
          />
          <Text style={styles.username}>{user?.fullName || 'Fitlife Guest'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Icon name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Bài hát</Text>
      {loadingSongs ? (
        <ActivityIndicator size="large" color="#4DB4E5" />
      ) : songs.length > 0 ? (
        <FlatList
          data={songs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.songItem}
              onPress={() => navigation.navigate('PlayerScreen', { song: item })}
            >
              <Image
                source={{ uri: item.image || 'https://via.placeholder.com/100' }}
                style={styles.songImage}
              />
              <Text numberOfLines={1} style={styles.songTitle}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>Không có bài hát.</Text>
      )}

      <Text style={styles.sectionTitle}>Bài tập</Text>
      {loadingExercises ? (
        <ActivityIndicator size="large" color="#4DB4E5" />
      ) : exercises.length > 0 ? (
        exercises.map((item) => (
          <TouchableOpacity
            key={item._id}
            style={styles.exerciseCard}
            onPress={() =>
              navigation.navigate('ExerciseVideoScreen', {
                exerciseId: item._id,
                exerciseData: item,
              })
            }
          >
            <Image
              source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
              style={styles.exerciseImage}
            />
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseTitle}>{item.title}</Text>
              <Text style={styles.exerciseSubtitle}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text>Không có bài tập.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  username: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0077B6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  songItem: {
  width: 100,
  marginRight: 12,
  alignItems: 'center',
},
  songImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  songTitle: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
    color: '#333',
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F5F9FF',
    padding: 10,
    borderRadius: 10,
  },
  exerciseImage: { width: 80, height: 80, borderRadius: 8 },
  exerciseInfo: { marginLeft: 10, flex: 1 },
  exerciseTitle: { fontSize: 16, fontWeight: 'bold' },
  exerciseSubtitle: { color: 'gray', fontSize: 12, marginBottom: 4 },
  levelTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4DB4E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelText: { color: 'white', fontSize: 10 },
});

export default HomeScreen;
