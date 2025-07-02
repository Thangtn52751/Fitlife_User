import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import FadeInImageReanimated from '../animation/FadeInImage';
import WaveDots from '../animation/WaveDots';

const SplashScreen = ({ navigation }) => {
  if (Platform.OS !== 'android') return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3500);

    return () => clearTimeout(timer);
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
