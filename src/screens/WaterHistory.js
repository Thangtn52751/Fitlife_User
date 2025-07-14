import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../redux/config';

export default function WaterHistory({ navigation }) {
  const token = useSelector(state => state.auth.token);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/water/history`, {
        
        headers: { Authorization: `Bearer ${token}` }
      });

    console.log("✅ API response:", res.data);
      setData(res.data || {});
      
    } catch (e) {
        console.error("❌ API error:", e);
      setData([]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3BB3FD" />
      </View>
    );
  }

  if (!data.length) {
    return (
      <View>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>&lt;</Text>
          </TouchableOpacity>
          <Text style = {{marginLeft : 20, marginTop: 3, fontSize: 20}}>Lịch sử uống nước</Text>
        </View>
        <Text style={{ color: '#999', textAlign : 'center', marginTop: 350, fontSize: 18 }}>Chưa có lịch sử uống nước.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const dateStr = new Date(item.date).toLocaleDateString('vi-VN', {
      weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric'
    });
    return (
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
        <View>
          <Text style={styles.achieve}>
            {item.achieveGlasses || 0}/{item.targetGlasses || 0} cốc
          </Text>
          <Text style={{ color: item.achieveGlasses >= item.targetGlasses ? '#27ae60' : '#e74c3c' }}>
            {item.achieveGlasses >= item.targetGlasses ? 'Hoàn thành' : 'Chưa đạt'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử uống nước</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item._id || item.date}
        contentContainerStyle={{ padding: 10 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 24 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 18, color: '#3BB3FD', marginTop: 22 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, backgroundColor: '#f7fbff', borderRadius: 12 },
  date: { fontWeight: '600', fontSize: 16, color: '#222' },
  achieve: { fontSize: 15, color: '#222' },
  separator: { height: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 28, marginHorizontal: 18 },
   backBtn: { fontSize: 28, color: '#5DCCFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
