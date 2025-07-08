import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function CongratulationScreen({ navigation, route }) {
  const { date } = route.params || {};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today - {date}</Text>
      <Text style={styles.subtitle}>Hi, User,</Text>
      <Text style={{fontSize: 64, textAlign:'center'}}>😁</Text>
      <View style={styles.card}>
        <Text style={styles.congrats}>🎉 Congratulations!</Text>
        <Text style={styles.goalText}>
          <Text style={{fontWeight:'bold'}}>You have achieved your goal today</Text>
        </Text>
        <Text style={styles.quote}>
          You can get everything in life you want if you will just help enough other people get what they want.
        </Text>
      </View>
      
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.btnText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor:'#F6FAFF', alignItems:'center'},
  title: {fontSize: 22, fontWeight:'bold', marginTop:55, marginBottom: 4},
  subtitle: {color:'#80A0B2', fontSize:16, marginBottom: 8},
  card: {
    backgroundColor:'#EAF8FE',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 22,
    marginTop: 20,
    width: 340,
    height : 220,
    alignItems:'center',
    elevation: 3,
    shadowColor:'#000', shadowOpacity: 0.05, shadowRadius: 12
  },
  congrats: {fontSize: 22, fontWeight:'bold', color:'#222', marginBottom: 10, marginTop: 20},
  goalText: {fontSize: 18, color:'#222', marginBottom: 8, textAlign:'center'},
  quote: {fontSize:16, color:'#444', textAlign:'center', marginTop: 7},
  btn: {
    marginTop: 32,
    backgroundColor: '#39B4FD',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 54,
    elevation: 4,
    shadowColor: '#36B5F2', shadowOpacity: 0.12
  },
  btnText: {color:'#fff', fontWeight:'bold', fontSize:18}
});
