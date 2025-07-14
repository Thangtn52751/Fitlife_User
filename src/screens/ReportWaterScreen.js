import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekDates() {
  // Lấy ngày Chủ Nhật của tuần hiện tại
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  // Tạo mảng ngày trong tuần
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    days.push(new Date(d)); // clone
  }
  return days;
}

export default function WaterHistoryScreen({navigation}) {
  const token = useSelector(state => state.auth.token);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await axios.get('http://192.168.33.112:3000/api/water/report', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReport(res.data);
    } catch (e) {
      setReport(null);
    }
    setLoading(false);
  };

  if (loading) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }
  if (!report) {
    return <View style={styles.center}><Text>Không có dữ liệu!</Text></View>;
  }

  
  const weekDates = getWeekDates();
  const { weeklyCompletion, weeklyAverage, monthlyAverage, averageCompletion, drinkFrequency } = report;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => {navigation.goBack()}}>
          <Text style={styles.backBtn}>&lt;</Text>
        </TouchableOpacity>
        <Text style={[styles.tab]}>History</Text>
        
      </View>
      <View style={styles.weekWrap}>
        <Text style={styles.sectionTitle}>Weekly Completion</Text>
        <View style={styles.weekRow}>
          {weeklyCompletion.map((done, idx) => (
            <View key={weekDates[idx]} style={styles.dayBox}>
              <View style={[
                styles.circle,
                done ? styles.doneCircle : styles.notDoneCircle
              ]}>
                {done ? <Text style={styles.check}>✔</Text> : null}
              </View>
              <Text style={styles.dayName}>{dayNames[weekDates[idx].getDay()]}</Text>
              {/* Nếu muốn show cả ngày/tháng: */}
              <Text style={{fontSize:10, color:'#bbb'}}>{weekDates[idx].getDate()}/{weekDates[idx].getMonth()+1}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.reportBox}>
        <Text style={styles.reportTitle}>Drink Water Report</Text>
        <View style={styles.rowItem}>
          <Text>• Weekly Average</Text>
          <Text style={styles.valueText}>{weeklyAverage} ml / Day</Text>
        </View>
        <View style={styles.rowItem}>
          <Text>• Monthly Average</Text>
          <Text style={styles.valueText}>{monthlyAverage} ml / Day</Text>
        </View>
        <View style={styles.rowItem}>
          <Text>• Average Completion</Text>
          <Text style={styles.valueText}>{averageCompletion}%</Text>
        </View>
        <View style={styles.rowItem}>
          <Text>• Drink Frequency</Text>
          <Text style={styles.valueText}>{drinkFrequency} times / Day</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backBtn: { fontSize: 28, color: '#5DCCFC' },
  tab: { fontSize: 18, color: '#62CDFA', fontWeight: '600', marginBottom: 10, textAlign: "center", marginTop: 8, marginLeft: 150  },
  headerRow: { flexDirection: 'row', marginTop: 28, marginHorizontal: 18 },
  weekWrap: { backgroundColor: '#eaf7ff', margin: 16, borderRadius: 12, padding: 12 },
  sectionTitle: { fontWeight: 'bold', color: '#2583c2', marginBottom: 8 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  dayBox: { alignItems: 'center', flex: 1 },
  circle: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  doneCircle: { backgroundColor: '#85e0a3' },
  notDoneCircle: { backgroundColor: '#d7e7ee' },
  check: { color: '#299c2f', fontWeight: 'bold', fontSize: 20 },
  dayName: { color: '#444', fontSize: 13 },
  reportBox: { margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 1 },
  reportTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 12, color: '#333' },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  valueText: { color: '#3BB3FD', fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
