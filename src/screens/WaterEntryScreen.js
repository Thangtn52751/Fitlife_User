import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function WaterEntryScreen({ navigation }) {
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const checkGoal = async () => {
      try {
        const res = await axios.get(
          'http://192.168.1.8:3000/api/water/today',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.data) {
          // Đã có mục tiêu, sang màn uống nước
          navigation.replace('DrinkWaterGlassScreen');
        } else {
          // Chưa có, sang màn đặt mục tiêu
          navigation.replace('WaterGoalScreen');
        }
      } catch (e) {
        // Lỗi hoặc chưa có -> sang màn đặt mục tiêu
        navigation.replace('WaterGoalScreen');
      }
    };
    checkGoal();
  }, [token, navigation]);

  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <ActivityIndicator size="large" color="#3BB3FD" />
    </View>
  );
}
