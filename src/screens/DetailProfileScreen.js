import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const DetailScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  return (
    <ScrollView style={styles.container}>
      {/* Avatar + Thông tin cơ bản */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: user?.image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.fullName || 'Chưa có tên'}</Text>
        <Text style={styles.info}>📧 {user?.email || 'Chưa có email'}</Text>
        <Text style={styles.info}>📞 {user?.phone || 'Chưa có số điện thoại'}</Text>
      </View>

      {/* Thông tin chi tiết */}
      <View style={styles.detailBox}>
        <DetailRow label="Tuổi" value={user?.age?.toString() || 'Không rõ'} />
        <DetailRow label="Giới tính" value={user?.gender || 'Không xác định'} />
        <DetailRow label="ID người dùng" value={user?._id || 'Không có'} />
        {/* Thêm nếu có thêm trường nào khác bạn cần */}
      </View>

      {/* Các chức năng */}
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const OptionItem = ({ icon, text, onPress, color = '#333' }) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <Icon name={icon} size={20} color={color} />
    <Text style={[styles.optionText, { color }]}>{text}</Text>
    <Icon name="chevron-forward" size={18} color="#999" style={{ marginLeft: 'auto' }} />
  </TouchableOpacity>
);

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  detailBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: 100,
    fontWeight: 'bold',
    color: '#444',
  },
  detailValue: {
    flex: 1,
    color: '#555',
  },
  optionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
    marginBottom: 40,
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
