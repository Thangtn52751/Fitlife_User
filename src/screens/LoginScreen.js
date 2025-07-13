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
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePass, setHidePass] = useState(true);

  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);

  useEffect(() => {
    if (user && token) {
      console.log('🔐 Token sau khi login:', token);
      navigation.replace('Home');
    }
  }, [user, token]);

  const onLogin = async () => {
  if (!email.trim() || !password) {
    return Alert.alert('Validation', 'Please enter your email and password.');
  }

  try {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim(),
        password: password,
      }),
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json.message || 'Login failed');

    const { user, token } = json.data;

    if (!token) throw new Error('Không nhận được token từ server.');

    console.log("✅ Token nhận được:", token);

    await AsyncStorage.setItem('userToken', token); 
    await AsyncStorage.setItem('userInfo', JSON.stringify(user));
    dispatch(setAuth(user, token)); 

  } catch (err) {
    console.log("❌ Login error:", err);
    Alert.alert('Error', err.message);
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.headerBg} />
      <View style={styles.content}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Welcome back</Text>

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

        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={hidePass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setHidePass(v => !v)}>
            <Ionicons
              name={hidePass ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>New member?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.switchText, styles.switchLink]}>
              {' '}Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const ARC_HEIGHT = width * 0.6;

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
    paddingTop: Platform.OS === 'android' ? 80 : 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginTop: 100,
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
  forgot: {
    alignSelf: 'flex-end',
    color: '#4DA6FF',
    marginBottom: 32,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4DA6FF',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#666',
  },
  switchLink: {
    color: '#4DA6FF',
  },
});
