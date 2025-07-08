
import { View, Text } from 'react-native'
import React from 'react'


import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const AnalysisScreen = ({ navigation }) => {
  return (
    <View>
      <Text>AnalysisScreen</Text>
      <TouchableOpacity
        style={{ marginTop: 220, width: 40, height: 40, backgroundColor: '#3BB3FD', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
        onPress={() => navigation.navigate('WaterEntryScreen')}
      >
        <Text style={{ color: '#fff' }}>Go</Text>
      </TouchableOpacity>
    </View>
  )
}
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

export default function BMIScreen() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [result, setResult] = useState('');

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) {
      setResult('Vui lòng nhập đầy đủ chiều cao và cân nặng');
      return;
    }
    const bmiValue = +(w / ((h / 100) ** 2)).toFixed(1);
    setBmi(bmiValue);

    if (bmiValue < 18.5) setResult('Gầy');
    else if (bmiValue < 24.9) setResult('Bình thường');
    else if (bmiValue < 29.9) setResult('Thừa cân');
    else setResult('Béo phì');
  };


const AnalysisScreen = () => {
  return (

    <View>
      <Text>AnalysisScreen</Text>
    </View>
  )

    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Text style={styles.title}>Tính Chỉ Số BMI</Text>


      <TextInput
        placeholder="Chiều cao (cm)"
        keyboardType="numeric"
        style={styles.input}
        value={height}
        onChangeText={setHeight}
      />
      <TextInput
        placeholder="Cân nặng (kg)"
        keyboardType="numeric"
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
      />

      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Tính BMI</Text>
      </TouchableOpacity>

      {bmi && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Chỉ số BMI: {bmi}</Text>
          <Text style={styles.resultCategory}>{result}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

export default AnalysisScreen