import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const BmiScreen = ({ navigation }) => {
  const [bmiList, setBmiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchBmiData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserName(userData.name || 'Người dùng');
        }

        if (!token) {
          setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để xem BMI.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://192.168.1.4:3000/api/bmi/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn hoặc không hợp lệ.');
          }
          throw new Error(`Lỗi tải BMI: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setBmiList(data);
      } catch (err) {
        console.error('Lỗi load BMI:', err);
        setError(err.message || 'Không thể tải dữ liệu BMI. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchBmiData();

    // Optional: Refresh when screen is focused
    const unsubscribe = navigation.addListener('focus', fetchBmiData);
    return unsubscribe;
  }, [navigation]);

  // NEW: Extract weight and bmi arrays
  const weights = bmiList.map(item => item.weight);
  const bmis = bmiList.map(item => item.bmiValue);

  const average = arr => {
    if (!arr || arr.length === 0) return 0;
    const sum = arr.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    return (sum / arr.length).toFixed(1);
  };

  const getMax = arr => {
    const numericArr = arr.map(item => parseFloat(item)).filter(item => !isNaN(item));
    return numericArr.length ? Math.max(...numericArr).toFixed(1) : 0;
  };

  const getMin = arr => {
    const numericArr = arr.map(item => parseFloat(item)).filter(item => !isNaN(item));
    return numericArr.length ? Math.min(...numericArr).toFixed(1) : 0;
  };

  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) return 'Thiếu cân';
    if (bmi >= 18.5 && bmi <= 24.9) return 'Bình thường';
    if (bmi >= 25 && bmi <= 29.9) return 'Thừa cân';
    if (bmi >= 30) return 'Béo phì';
    return 'Không xác định';
  };

  const getStatusColor = (bmi) => {
    if (bmi < 18.5) return '#FFD700';
    if (bmi >= 18.5 && bmi <= 24.9) return '#32CD32';
    if (bmi >= 25 && bmi <= 29.9) return '#FFA500';
    if (bmi >= 30) return '#FF4500';
    return '#808080';
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.weight}>
          {item.weight} <Text style={styles.unit}>kg</Text>
        </Text>
        <View style={[styles.statusBox, { backgroundColor: getStatusColor(item.bmiValue) }]}>
          <Text style={styles.statusText}>{getBmiStatus(item.bmiValue)}</Text>
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DA6FF" />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu BMI...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BMI {userName ? `của ${userName}` : ''}</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.label}>Weight</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryValue}>{average(weights)}</Text>
          <Text style={styles.summaryValue}>{getMax(weights)}</Text>
          <Text style={styles.summaryValue}>{getMin(weights)}</Text>
        </View>
        <View style={styles.summaryLabelRow}>
          <Text style={styles.summaryLabel}>Average</Text>
          <Text style={styles.summaryLabel}>Max</Text>
          <Text style={styles.summaryLabel}>Min</Text>
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>BMI</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryValue}>{average(bmis)}</Text>
          <Text style={styles.summaryValue}>{getMax(bmis)}</Text>
          <Text style={styles.summaryValue}>{getMin(bmis)}</Text>
        </View>
        <View style={styles.summaryLabelRow}>
          <Text style={styles.summaryLabel}>Average</Text>
          <Text style={styles.summaryLabel}>Max</Text>
          <Text style={styles.summaryLabel}>Min</Text>
        </View>
      </View>

      {/* History List */}
      <Text style={[styles.label, { marginLeft: 16, marginTop: 24 }]}>History</Text>
      {bmiList.length > 0 ? (
        <FlatList
          data={bmiList}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Chưa có dữ liệu BMI cho bạn.</Text>
        </View>
      )}

      {/* Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={async () => {
          const userDataString = await AsyncStorage.getItem('userData');
          const userData = userDataString ? JSON.parse(userDataString) : {};
          navigation.navigate('AddBMI', { user: userData });
        }}
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      color: 'red',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 10,
    },
    noDataContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
    },
    noDataText: {
      fontSize: 16,
      color: '#666',
    },
    goBackText: {
      color: '#4DA6FF',
      fontSize: 16,
      marginTop: 10,
    },
  });