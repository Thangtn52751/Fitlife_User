import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { API_BASE_URL } from '../redux/config';
const waterGlassImg = require('../assets/Glass.png');

export default function DrinkWaterGlassScreen({ navigation }) {
  const token = useSelector(state => state.auth.token);
  const [todayGoal, setTodayGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayGoal();
  }, []);

  const fetchTodayGoal = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/water/today`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodayGoal(res.data.data);
    } catch (e) {
      setTodayGoal(null);
    }
    setLoading(false);
  };

  let percent = 0, achieve = 0, target = 0;
  if (todayGoal) {
    achieve = todayGoal.achieveGlasses || 0;
    target = todayGoal.targetGlasses || 1;
    percent = Math.round((achieve / target) * 100);
    if (percent > 100) percent = 100;
  }


  const todayStr = todayGoal?.date
    ? new Date(todayGoal.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color="#3BB3FD" />
      </View>
    );
  }

  if (!todayGoal) {
    return (
      <View style={styles.container}>
        <Text style={{textAlign: 'center', marginTop: 50, color: '#888'}}>Chưa có mục tiêu hôm nay.</Text>
        <TouchableOpacity style={styles.backBtn2} onPress={() => navigation.goBack()}>
          <Text style={{color: '#3BB3FD'}}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

return (
  <View style={styles.container}>
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconBtn}>
        <Text style={styles.headerIcon}>&lt;</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Drink Water Glass</Text>
      <TouchableOpacity onPress={() => navigation.navigate('ReportWaterScreen')}>
                <Text style={styles.historyBtn}>History</Text>
              </TouchableOpacity>
      <View style={{ width: 40 }} />
    </View>

    <View style={styles.imageBox}>
      <Image source={waterGlassImg} style={styles.waterImg} resizeMode="contain" />
    </View>

    <View style={styles.bottomCardWrap}>
      <View style={styles.blueCard}>
        <View style={styles.cardHandle} />
        <Text style={styles.dateTitle}>Date & Time</Text>
        <Text style={styles.dateText}>{todayStr}</Text>
      </View>

      <View style={styles.whiteCard}>
        <Text style={styles.goalPreviewTitle}>Goal Preview</Text>
        <Text style={styles.goalPreviewSub}>
          You have Drink <Text style={{ color: '#3BB3FD', fontWeight: 'bold'}}>{achieve} Glass Water</Text>
        </Text>
        <View style={{ alignItems: 'center', marginTop: 18, marginBottom: 20 }}>
          <AnimatedCircularProgress
            size={120}
            width={12}
            fill={percent}
            tintColor={percent >= 100 ? "#36BB58" : "#3BB3FD"}
            backgroundColor="#e6f1fb"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <Text style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: percent >= 100 ? "#36BB58" : "#3BB3FD"
              }}>{percent}%</Text>
            )}
          </AnimatedCircularProgress>
        </View>
        {percent >= 100 ? (
          <TouchableOpacity
            style={styles.goalBtn}
            onPress={() => navigation.navigate('CongratulationScreen', { date: todayStr })}
          >
            <Text style={styles.goalBtnText}>Goal Archive</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.fabBtn}
            onPress={async () => {
              try {
                await axios.put(
                  `${API_BASE_URL}/water/drink`,
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                fetchTodayGoal(); // Refresh lại tiến độ
              } catch (err) {
                alert(err?.response?.data?.message || 'Có lỗi xảy ra');
              }
            }}
            activeOpacity={0.8}
          >
            <Image style = {{width: 24, height: 24}} source={require('../assets/Drink.png')}/>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FAFF' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 36,
    marginHorizontal: 18,
    zIndex: 10,
  },
  headerIconBtn: { width: 40, alignItems: 'flex-start' },
  headerIcon: { fontSize: 26, color: '#58B6F6' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222', textAlign: 'center' },
  bgWave: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 10, backgroundColor: '#E6F5FC', borderBottomLeftRadius: 60, borderBottomRightRadius: 60,
    zIndex: 0,
  },


  imageBox: { alignItems: 'center', marginTop: 24 },
  waterImg: { width: 99, height: 157 },
bottomCardWrap: {
  position: 'absolute',
  left: 0, right: 0, bottom: 0,
  height: '62%', 
  justifyContent: 'flex-start',
  zIndex: 2,
},
  blueCard: {
    backgroundColor: '#62c8f9',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    alignItems: 'center',
    paddingTop: 18, paddingBottom: 18,
  },
  cardHandle: {
    width: 54, height: 4, borderRadius: 2, backgroundColor: '#fff', marginBottom: 10
  },
  dateTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 2 },
  dateText: { color: '#fff', fontSize: 16, marginTop: 6 },
  whiteCard: {
    backgroundColor: '#fff',
    flex: 1, 
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 22,
    paddingBottom: 30,
    elevation: 7,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 16, shadowOffset: {width: 0, height: -3},
  },
  goalPreviewTitle: { fontSize: 24, fontWeight: 'bold', color: '#222', marginTop: 12, alignSelf:'flex-start' },
  goalPreviewSub: { color: '#3BB3FD', fontSize: 19, marginTop: 14, marginBottom:6, alignSelf:'flex-start' },
 fabBtn: {
  position: 'absolute',
  right: 24,
  bottom: 36,  
  backgroundColor: '#5DCCFC',
  width: 56, height: 56, borderRadius: 28,
  alignItems: 'center', justifyContent: 'center',
  elevation: 7,
  zIndex: 99,
  shadowColor: '#3BB3FD', shadowOpacity: 0.17, shadowRadius: 15, shadowOffset: {width: 0, height: 3}
},  
  backBtn2: {marginTop: 24, alignSelf: 'center', padding: 10},
  goalBtn: {
  marginTop: 22,
  backgroundColor: '#39B4FD',
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 50,
  alignItems: 'center',
  elevation: 4,
  shadowColor: '#36B5F2', shadowOpacity: 0.12,
  alignSelf: 'center'
},
goalBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
historyBtn: { color: '#3BB3FD', fontWeight: 'bold', fontSize: 16, marginLeft: 100 },
});
