import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';

const glassOptions = [
  { label: '10 glass', value: 10, sub: 'Summer time', icon: '🌴' },
  { label: '7 glass', value: 7, sub: 'Sporty', icon: '🏀' },
  { label: '5 glass', value: 5, sub: 'Snow day', icon: '❄️' },
  { label: '4 glass', value: 4, sub: 'Child', icon: '🌈' },
];

export default function WaterGoalScreen({ navigation }) {
  const token = useSelector(state => state.auth.token);

  const [targetGlasses, setTargetGlasses] = useState(glassOptions[0].value);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSetGoal = async () => {
    setLoading(true);
    setMessage('');
    try {
      await axios.post(
        'http://192.168.1.8:3000/api/water/set',
        { targetGlasses, volumePerGlass: 250 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Đặt mục tiêu thành công!');
      navigation.replace('DrinkWaterGlassScreen');
    } catch (err) {
      setMessage(
        err?.response?.data?.message || 'Đặt mục tiêu thất bại'
      );
    }
    setLoading(false);
  };

  const selectedOption = glassOptions.find(x => x.value === targetGlasses);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Your Goal</Text>
        <TouchableOpacity onPress={() => navigation.navigate('WaterHistory')}>
          <Text style={styles.historyBtn}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centerBigNum}>
        <Text style={styles.bigNum}>
          {targetGlasses}
        </Text>
        <Text style={styles.unitText}>glass</Text>
      </View>


      <View style={styles.bottomCard}>
        <Text style={styles.goalTitle}>Set Number of Glass</Text>
        <Text style={styles.goalSub}>Choose your daily water goal</Text>
        <View style={styles.glassList}>
          {glassOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.glassOption,
                targetGlasses === option.value && styles.glassOptionActive
              ]}
              onPress={() => setTargetGlasses(option.value)}
              activeOpacity={0.85}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.icon}>{option.icon}</Text>
                <Text style={styles.glassLabel}>{option.label}</Text>
              </View>
              <Text style={[
                styles.subText, 
                targetGlasses === option.value && styles.subTextActive
              ]}>
                {option.sub}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.selectedGlass}>
          Your Goal: <Text style={{fontWeight:'bold', color:'#3BB3FD'}}>{targetGlasses} glass</Text>
        </Text>
        <TouchableOpacity
          style={styles.setBtn}
          onPress={handleSetGoal}
          disabled={loading}
        >
          <Text style={styles.setBtnText}>{loading ? 'Setting...' : 'Set Goal'}</Text>
        </TouchableOpacity>
        {!!message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FAFF' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginHorizontal: 18 },
  backBtn: { fontSize: 28, color: '#5DCCFC' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  historyBtn: { color: '#3BB3FD', fontWeight: 'bold', fontSize: 16 },
  centerBigNum: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
    flex: 0.35, 
    justifyContent: 'center'
  },
  bigNum: {
    fontSize: 68,
    fontWeight: 'bold',
    color: '#3BB3FD',
    letterSpacing: 2,
    textShadowColor: '#D4EAFB',
    textShadowOffset: {width: 0, height: 3},
    textShadowRadius: 12,
  },
  unitText: { fontSize: 22, color: '#88B4D7', marginTop: -10 },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 18,
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    elevation: 15,
    shadowColor: '#000', shadowOpacity: 0.09, shadowRadius: 16, shadowOffset: {width: 0, height: -4},
  },
  goalTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 7, textAlign: 'center' },
  goalSub: { color: '#999', fontSize: 14, marginBottom: 13, textAlign: 'center' },
  glassList: { marginBottom: 16 },
  glassOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F7FB',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 48,
  },
  glassOptionActive: {
    borderColor: '#3BB3FD',
    backgroundColor: '#EAF6FF',
  },
  icon: { fontSize: 22, marginRight: 10 },
  glassLabel: { fontWeight: 'bold', fontSize: 16, color: '#222', marginLeft: 3 },
  subText: { color: '#A9A9A9', fontSize: 13, fontStyle: 'italic' },
  subTextActive: { color: '#3BB3FD', fontWeight: '600' },
  selectedGlass: { textAlign: 'center', fontSize: 15, marginBottom: 15, marginTop: 6 },
  setBtn: {
    backgroundColor: '#3BB3FD',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  setBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  message: { textAlign: 'center', marginTop: 10, color: '#D4002A', fontSize: 15 }
});
