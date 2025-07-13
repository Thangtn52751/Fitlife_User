import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';

const ProfileScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy' },
      {
        text: 'Đồng ý',
        onPress: () => {
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editIcon} onPress={() => navigation.navigate('EditProfile')}>
        <Icon name="create-outline" size={22} color="#00A3FF" />
      </TouchableOpacity>

      {/* User info */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: user?.image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user?.fullName || 'Nguyễn Thanh Bình'}</Text>
          <Text style={styles.info}>📞 {user?.phone || '0123 456 789'}</Text>
          <Text style={styles.info}>✉️ {user?.email || 'nguyenbinh@gmail.com'}</Text>
        </View>
      </View>

      {/* Options */}
      <View style={styles.optionContainer}>
        <OptionItem
          icon="lock-closed-outline"
          text="Đổi mật khẩu"
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <OptionItem
          icon="document-text-outline"
          text="Giới thiệu"
          onPress={() => navigation.navigate('DetailProfile')}
        />
        <OptionItem
          icon="log-out-outline"
          text="Đăng xuất"
          color="#00A3FF"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

const OptionItem = ({ icon, text, onPress, color = '#333' }) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <Icon name={icon} size={20} color={color} />
    <Text style={[styles.optionText, { color }]}>{text}</Text>
    <Icon name="chevron-forward" size={18} color="#999" style={{ marginLeft: 'auto' }} />
  </TouchableOpacity>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  editIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  info: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  optionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },
});
