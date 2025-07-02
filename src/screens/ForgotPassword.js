import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AUTH_URL } from '../redux/config';

const { width } = Dimensions.get('window');
const ARC_HEIGHT = width * 0.6;

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const sendCode = async () => {
    if (!email.trim()) {
      return Alert.alert('Validation', 'Please enter your email address.');
    }
    try {
      const res = await fetch(`${AUTH_URL}/send-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), type: 'reset-password' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Send code failed');
      Alert.alert('Success', 'Code Sented');
      navigation.navigate('ConfirmationCode', { email: email.trim() });
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBg} />
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.desc}>
          To recover your password, you need to enter your registered email
          address we will send the recovery code to your email
        </Text>

        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={sendCode}>
          <Text style={styles.buttonText}>Send Activation Code</Text>
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
    marginTop: 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
