import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Icon name="edit-3" size={20} />
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
        style={styles.avatar}
      />

      <TextInput style={styles.input} value="Aashifa" editable={false} placeholder="First Name" />
      <TextInput style={styles.input} value="Sheikh" editable={false} placeholder="Last Name" />
      <TextInput style={styles.input} value="aashifasheikh@gmail.com" editable={false} placeholder="Email Address" />
      <TextInput style={styles.input} value="25" editable={false} placeholder="Age" />

      <View style={styles.genderGroup}>
        <Text>Gender</Text>
        <Text>  ⬤  Male   ⬤  Female   ⬤  Other</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 20 },
  input: { backgroundColor: '#eef8ff', padding: 10, borderRadius: 8, marginBottom: 15 },
  genderGroup: { marginTop: 10, alignItems: 'flex-start' },
});
