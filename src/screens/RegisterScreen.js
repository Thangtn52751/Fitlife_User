// screens/SignUpScreen.js
import React, { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../redux/actions/authActions';
import { AUTH_URL } from '../redux/config';

const { width } = Dimensions.get('window');
const ARC_HEIGHT = width * 0.6;

export default function SignUpScreen({ navigation }) {
  const [email, setEmail]= useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]= useState('');
  const [hide1, setHide1]= useState(true);
  const [hide2, setHide2]= useState(true);

  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    if (user) navigation.replace('Home');
  }, [user]);

  const onSignUp = async () => {
    if (!email.trim() || !password) {
      return Alert.alert('Validation', 'Email and password are required');
    }
    if (password !== confirm) {
      return Alert.alert('Validation', 'Passwords do not match');
    }
    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          fullName: '',
          image: '',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Sign up failed');
      dispatch(setAuth(json.data.user, json.data.token));
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* phần cong nền màu xanh */}
      <View style={styles.headerBg} />

      <View style={styles.content}>
        {/* nút back */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Sign up</Text>
        <Text style={styles.subtitle}>Create an account here</Text>

        {/* Email */}
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

        {/* Password */}
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={hide1}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setHide1(v => !v)}>
            <Ionicons
              name={hide1 ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor="#999"
            secureTextEntry={hide2}
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity onPress={() => setHide2(v => !v)}>
            <Ionicons
              name={hide2 ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Sign up button */}
        <TouchableOpacity style={styles.button} onPress={onSignUp}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    paddingTop: Platform.OS === 'android' ? 60 : 80,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 16 : 44,
    left: 16,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginTop: Platform.OS === 'android' ? 120 : 50,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
