import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../redux/actions/authActions';
import { launchImageLibrary } from 'react-native-image-picker';

const EditProfileScreen = ({ navigation }) => {
  const { user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [gender, setGender] = useState(user?.gender || 'Other');
  const [avatar, setAvatar] = useState(user?.image || '');

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (res) => {
      if (res.didCancel || res.errorCode) return;
      const base64 = res.assets[0].base64;
      setAvatar(`data:image/jpeg;base64,${base64}`);
    });
  };

  const handleUpdate = () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert('Thiếu thông tin', 'Họ tên và email là bắt buộc');
      return;
    }

    const payload = {
      ...user,
      fullName: fullName.trim(),
      email: email.trim(),
      gender,
      age: Number(age),
      image: avatar,
    };

    dispatch(setAuth(payload, token)); // cập nhật Redux
    Alert.alert('Đã cập nhật!', 'Thông tin của bạn đã được cập nhật.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      {/* Avatar */}
      <TouchableOpacity onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
            style={styles.avatar}
          />
        )}
      </TouchableOpacity>

      {/* Full Name */}
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
        autoCapitalize="none"
      />

      {/* Age */}
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Age"
        keyboardType="numeric"
      />

      {/* Gender */}
      <Text style={{ marginTop: 10 }}>Gender</Text>
      <View style={styles.genderRow}>
        {['Male', 'Female', 'Other'].map(option => (
          <TouchableOpacity
            key={option}
            style={styles.radio}
            onPress={() => setGender(option)}
          >
            <View style={[styles.circle, gender === option && styles.selected]} />
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: { backgroundColor: '#eef8ff', padding: 10, borderRadius: 8, marginBottom: 15 },
  genderRow: { flexDirection: 'row', marginTop: 10, gap: 20 },
  radio: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  circle: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: '#000' },
  selected: { backgroundColor: '#007aff' },
  button: {
    marginTop: 30,
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
