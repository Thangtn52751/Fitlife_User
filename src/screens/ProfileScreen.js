import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Alert, ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await AsyncStorage.getItem('userInfo');
        if (data) setUser(JSON.parse(data));
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy' },
      {
        text: 'Đồng ý',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userInfo');
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00A3FF" />
      </View>
    );
  }

  const avatarSource = user?.image
    ? { uri: user.image }
    : require('../assets/logo.png');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={avatarSource} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user?.fullName || 'Fitlife Guest'}</Text>
          <Text style={styles.email}>{user?.email || 'Chưa có email'}</Text>
        </View>
      </View>

      <Text style={styles.profileTitle}>Profile</Text>

      <View style={styles.options}>
        <Option icon="open-outline" text="Cập nhật Profile" onPress={() => navigation.navigate('EditProfile')} />
        <Option icon="lock-closed-outline" text="Đổi mật khẩu" onPress={() => navigation.navigate('ChangePassword')} />
        <Option icon="document-text-outline" text="Giới thiệu" onPress={() => navigation.navigate('DetailProfile')} />
        <Option icon="log-out-outline" text="Đăng xuất" color="#00A3FF" onPress={handleLogout} />
      </View>
    </View>
  );
};

const Option = ({ icon, text, onPress, color = '#333' }) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <View style={styles.optionLeft}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.optionText, { color }]}>{text}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  userInfo: { marginLeft: 15 },
  name: { fontSize: 18, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#888', marginTop: 4 },
  profileTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 10,
  },
  options: { gap: 12 },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionText: { marginLeft: 10, fontSize: 16 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
