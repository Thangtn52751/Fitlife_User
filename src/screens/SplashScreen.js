import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FadeInImageReanimated from '../animation/FadeInImage';
import WaveDots from '../animation/WaveDots';

const SplashScreen = ({ navigation }) => {
  if (Platform.OS !== 'android') return null;

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
        setTimeout(() => {
          if (hasSeen === 'true') {
            navigation.replace('Login'); 
          } else {
            navigation.replace('Onboarding'); 
          }
        }, 3500);
      } catch (err) {
        console.error('Error reading onboarding flag', err);
        navigation.replace('Onboarding');
      }
    };

    checkOnboarding();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FadeInImageReanimated
        source={require('../assets/logo.png')}
        style={styles.logo}
        duration={1500}
      />
      <WaveDots color="#000" size={10} spacing={16} duration={800} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '80%',
    marginBottom: 24,
  },
});

export default SplashScreen;
