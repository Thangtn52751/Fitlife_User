import React, { useState, useRef, useEffect } from 'react';
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
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AUTH_URL } from '../redux/config';

const { width } = Dimensions.get('window');
const ARC_HEIGHT = width * 0.6;

export default function ConfirmationCodeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputs = useRef([]);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onChange = (text, idx) => {
    const newCode = [...code];
    if (text === '') {
      newCode[idx] = '';
      setCode(newCode);
      return;
    }
    const char = text[text.length - 1];
    if (!/^\d$/.test(char)) {
      return;
    }
    newCode[idx] = char;
    setCode(newCode);
    if (idx < 5) {
      inputs.current[idx + 1].focus();
    }
  };

  const onKeyPress = ({ nativeEvent }, idx) => {
    if (nativeEvent.key === 'Backspace' && code[idx] === '' && idx > 0) {
      inputs.current[idx - 1].focus();
    }
  };

  const confirmCode = async () => {
    const joined = code.join('');
    if (joined.length < 6) {
      Alert.alert('Validation', 'Please enter full 6-digit code');
      return;
    }
    try {
      const res = await fetch(`${AUTH_URL}/confirm-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: joined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Confirm failed');
      navigation.navigate('ResetPassword', { email, code: joined });
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const resendCode = async () => {
    if (timer > 0) return;
    try {
      const res = await fetch(`${AUTH_URL}/send-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'reset-password' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Resend failed');
      Alert.alert('Success', 'Code resent');
      setCode(['', '', '', '', '', '']);
      inputs.current[0].focus();
      setTimer(60);
      let interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBg} />
      <View style={styles.content}>
        <Text style={styles.title}>Confirmation code</Text>
        <Text style={styles.desc}>
          Please enter verification code you’ve received
        </Text>
        <Text style={styles.emailText}>{email}</Text>

        <View style={styles.codeContainer}>
          {code.map((d, i) => (
            <TextInput
              key={i}
              ref={ref => (inputs.current[i] = ref)}
              style={styles.codeInput}
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={t => onChange(t, i)}
              onKeyPress={e => onKeyPress(e, i)}
              value={d}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={confirmCode}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={resendCode} disabled={timer > 0}>
          <Text style={[styles.resendText, timer > 0 && styles.disabled]}>
            {timer > 0 ? `Resend Code (${timer}s)` : 'Resend Code'}
          </Text>
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
    textAlign: 'center',
  },
  emailText: {
    fontSize: 14,
    color: '#4DA6FF',
    marginVertical: 12,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  codeInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginHorizontal: 6,
    fontSize: 20,
  },
  button: {
    backgroundColor: '#4DA6FF',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resendText: {
    textAlign: 'center',
    color: '#4DA6FF',
    textDecorationLine: 'underline',
  },
  disabled: {
    color: '#999',
    textDecorationLine: 'none',
  },
});
