import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const EditProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('Aashifa');
  const [lastName, setLastName] = useState('Sheikh');
  const [email, setEmail] = useState('aashifasheikh@gmail.com');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('Female');

  const handleUpdate = () => {
    // Gửi dữ liệu cập nhật tại đây
    console.log({ firstName, lastName, email, age, gender });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
        style={styles.avatar}
      />

      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First Name" />
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last Name" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email Address" />
      <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="Age" keyboardType="numeric" />

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
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 20 },
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
