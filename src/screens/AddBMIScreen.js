import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- cần thêm dòng này

const AddBmiScreen = ({ navigation }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const calculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h || w <= 0 || h <= 0) return 0;
    return (w / (h * h)).toFixed(1);
  };

  const getStatus = (bmi) => {
    if (bmi < 18.5) return 'Gầy';
    if (bmi < 24.9) return 'Bình thường';
    if (bmi < 29.9) return 'Thừa cân';
    return 'Béo phì';
  };

  const formatDate = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:00.000Z`;
  };

  const handleSave = async () => {
    const bmi = parseFloat(calculateBmi());
    const status = getStatus(bmi);
    const time = formatDate();

    if (!weight || !height || parseFloat(weight) <= 0 || parseFloat(height) <= 0) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập cân nặng và chiều cao hợp lệ');
      return;
    }

    try {
      // 🔐 Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Lỗi xác thực', 'Không tìm thấy token người dùng. Hãy đăng nhập lại.');
        return;
      }

      const res = await fetch('http://10.0.2.2:3000/api/bmi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // <-- Gửi token như trong Postman
        },
        body: JSON.stringify({
          weight: parseFloat(weight),
          height: parseFloat(height),
          bmiValue: bmi,
          status,
          recordDate: time,
        }),
      });

      if (res.ok) {
        Alert.alert('Thành công', 'Đã thêm chỉ số BMI');
        navigation.goBack();
      } else {
        const data = await res.json();
        console.log('Lỗi server:', data);
        Alert.alert('Lỗi', data.message || 'Không thể gửi dữ liệu BMI');
      }
    } catch (error) {
      console.error('Lỗi gửi BMI:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm chỉ số BMI</Text>

      <TextInput
        style={styles.input}
        placeholder="Cân nặng (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TextInput
        style={styles.input}
        placeholder="Chiều cao (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>BMI: {calculateBmi()}</Text>
        <Text style={styles.resultText}>Trạng thái: {getStatus(calculateBmi())}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddBmiScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  resultBox: {
    backgroundColor: '#F2F9FF',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4DA6FF',
  },
  button: {
    backgroundColor: '#4DA6FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
