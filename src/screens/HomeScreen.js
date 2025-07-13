import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const HomeScreen = ({ navigation }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bmi, setBmi] = useState(null);

  const { user,token } = useSelector(state => state.auth);

  const fetchExercises = async () => {
  try {
    const response = await fetch('http://10.0.2.2:3000/api/exercises', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Thêm token vào đây
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Exercises:', data);

    if (Array.isArray(data)) {
      setExercises(data);
    } else {
      console.warn('Dữ liệu exercises không đúng định dạng:', data);
      setExercises([]);
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu exercises:', error);
    setExercises([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    const hasUserId = user?.id || user?._id;
    if (hasUserId) {
      fetchExercises();
      fetchBmi();  // ✅ mỗi lần quay về Home là gọi lại
    }
  });

  return unsubscribe; // ✅ hủy listener khi unmount
}, [navigation, user]);



const fetchBmi = async () => {
  console.log('📌 Gọi hàm fetchBmi');
  try {
    const response = await fetch('http://10.0.2.2:3000/api/bmi/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 BMI response status:', response.status);

    const data = await response.json();
    console.log('📊 BMI data:', data);

    if (Array.isArray(data) && data.length > 0) {
      const sorted = data.sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));
      console.log('✅ BMI sau sắp xếp:', sorted[0]);
      setBmi(sorted[0].bmiValue);
    } else {
      console.warn('⚠️ Không có dữ liệu BMI hợp lệ:', data);
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy dữ liệu BMI:', error);
  }
};


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {user?.image ? (
            <Image source={{ uri: user.image }} style={styles.avatar} />
          ) : null}
          <Text style={styles.username}>{user?.fullName || 'Chưa có tên'}</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Icon name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>BMI</Text>
          <Text style={styles.statValue}>
            {bmi !== null ? bmi.toFixed(2) : '...'}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Calories</Text>
          <Text style={styles.statValue}>510.43</Text>
          <Text style={styles.kcal}>Kcal</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Exercise</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4DB4E5" />
      ) : exercises.length > 0 ? (
        exercises.map((item) => (
          <View key={item._id} style={styles.exerciseCard}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.exerciseImage}
            />
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseTitle}>{item.title}</Text>
              <Text style={styles.exerciseSubtitle}>{item.description}</Text>
              <Text style={styles.exerciseSubtitle}>
                ⏱ {item.durationMin} min • 🔥 {item.calories} Kcal
              </Text>
              {item.videoUrl ? (
                <Text style={styles.exerciseSubtitle}>🎬 {item.videoUrl}</Text>
              ) : null}
            </View>
            <View style={styles.levelTag}>
              <Text style={styles.levelText}>{item.level}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text>Không có bài tập nào.</Text>
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
  username: { marginLeft: 10, fontWeight: 'bold', fontSize: 16 },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: '#F9FBFD',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  statTitle: { fontWeight: 'bold', marginBottom: 5 },
  statValue: { fontSize: 18, color: '#4DB4E5' },
  kcal: { fontSize: 12, color: 'gray' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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