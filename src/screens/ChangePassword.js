import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,git 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AUTH_URL } from '../redux/config';

const { width } = Dimensions.get('window');
const ARC_HEIGHT = width * 0.6;

export default function ResetPasswordScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { email, code } = route.params;

  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [hide1, setHide1] = useState(true);
  const [hide2, setHide2] = useState(true);

  const resetPassword = async () => {
    if (!newPw || !confirmPw) {
      return Alert.alert('Validation', 'Please enter both password fields.');
    }
    if (newPw !== confirmPw) {
      return Alert.alert('Validation', 'Passwords do not match.');
    }
    try {
      const res = await fetch(`${AUTH_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: newPw }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Reset failed');
      Alert.alert('Success', 'Password reset successful');
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBg} />
      <View style={styles.content}>
        <Text style={styles.title}>Confirm New Password</Text>
        <Text style={styles.desc}>
          Please enter your new password, confirm it to enjoy much security.
        </Text>

        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Enter New Password"
            placeholderTextColor="#999"
            secureTextEntry={hide1}
            value={newPw}
            onChangeText={setNewPw}
          />
          <TouchableOpacity onPress={() => setHide1(v => !v)}>
            <Ionicons
              name={hide1 ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry={hide2}
            value={confirmPw}
            onChangeText={setConfirmPw}
          />
          <TouchableOpacity onPress={() => setHide2(v => !v)}>
            <Ionicons
              name={hide2 ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={resetPassword}>
          <Text style={styles.buttonText}>Confirm Your Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBg: {
    position: 'absolute',
    top: 0,
    right: -ARC_HEIGHT / 2,
    width: ARC_HEIGHT * 2,
    height: ARC_HEIGHT,
    backgroundColor: '#4DA6FF',
    borderBottomLeftRadius: ARC_HEIGHT,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 80 : 100,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#333', marginTop: 200 },
  desc: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 32,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 8,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4DA6FF',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
