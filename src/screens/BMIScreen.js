import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const BmiScreen = ({ navigation }) => {
  const [bmiList, setBmiList] = useState([]);

  useEffect(() => {
  const userId = '665f1234abcde6789abcde12';
  fetch(`http://10.0.2.2:3000/api/bmi/user/${userId}`)
    .then(res => res.json())
    .then(data => setBmiList(data))
    .catch(err => console.error('Lỗi load BMI:', err));
}, []);


  const weights = Array.isArray(bmiList) ? bmiList.map(item => item.weight) : [];
const bmis = Array.isArray(bmiList)
  ? bmiList.map(item => item.bmiValue)
  : [];


  const average = arr =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;

  const renderItem = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <Text style={styles.weight}>
        {item.weight} <Text style={styles.unit}>kg</Text>
      </Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{item.status || 'Normal'}</Text>
      </View>

      <Text style={styles.bmiText}>BMI: {item.bmiValue}</Text>
    </View>

    <Text style={styles.height}>{item.height} cm</Text>
    <Text style={styles.time}>
      {new Date(item.recordDate).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </Text>
  </View>
);


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BMI</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.label}>Weight</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryValue}>{average(weights)}</Text>
          <Text style={styles.summaryValue}>{Math.max(...weights)}</Text>
          <Text style={styles.summaryValue}>{Math.min(...weights)}</Text>
        </View>
        <View style={styles.summaryLabelRow}>
          <Text style={styles.summaryLabel}>Average</Text>
          <Text style={styles.summaryLabel}>Max</Text>
          <Text style={styles.summaryLabel}>Min</Text>
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>BMI</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryValue}>{average(bmis)}</Text>
          <Text style={styles.summaryValue}>{Math.max(...bmis)}</Text>
          <Text style={styles.summaryValue}>{Math.min(...bmis)}</Text>
        </View>
        <View style={styles.summaryLabelRow}>
          <Text style={styles.summaryLabel}>Average</Text>
          <Text style={styles.summaryLabel}>Max</Text>
          <Text style={styles.summaryLabel}>Min</Text>
        </View>
      </View>

      {/* History List */}
      <Text style={[styles.label, { marginLeft: 16, marginTop: 24 }]}>History</Text>
      <FlatList
        data={bmiList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddBMI')}
      >
        <Icon name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default BmiScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  summaryBox: {
    backgroundColor: '#F2F9FF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  summaryLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4DA6FF',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  card: {
    backgroundColor: '#F5FAFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  weight: {
    fontSize: 18,
    fontWeight: '600',
  },
  unit: {
    fontSize: 14,
    color: '#666',
  },
  statusBox: {
    backgroundColor: '#32CD32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  bmiText: {
    marginLeft: 'auto',
    fontSize: 14,
    color: '#333',
  },
  height: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    backgroundColor: '#4DA6FF',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
