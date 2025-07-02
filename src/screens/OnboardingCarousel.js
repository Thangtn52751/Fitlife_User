import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '0',
    image: require('../assets/slide1.png'),
    title: 'Our daily health tracker',
    subtitle: 'Let us do the work for you',
  },
  {
    key: '1',
    image: require('../assets/slide2.png'),
    title: 'Smart Reminders Tailored to You',
    subtitle: 'Quick and easy to set body goals and track your daily progress.',
  },
  {
    key: '2',
    image: require('../assets/slide3.png'),
    title: 'Socialize and make friends',
    subtitle: 'Connect and communicate to conquer challenges together',
  },
];

const PaginationDot = ({ index, translateX }) => {
  const style = useAnimatedStyle(() => {
    const input = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    const w = interpolate(translateX.value, input, [8, 24, 8], 'clamp');
    const o = interpolate(translateX.value, input, [0.3, 1, 0.3], 'clamp');
    return { width: w, opacity: o };
  });

  return <Animated.View style={[styles.dot, style]} />;
};

export default function OnboardingCarousel() {
  const translateX = useSharedValue(0);
  const scrollRef = useRef(null);
  const navigation = useNavigation();

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      translateX.value = e.contentOffset.x;
    },
  });

  const goNext = idx => {
    if (idx < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (idx + 1), animated: true });
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {slides.map((s, i) => (
          <View style={styles.slide} key={s.key}>
            {i < slides.length - 1 && (
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => navigation.replace('Login')}
              >
                <Text style={styles.skipTxt}>Skip</Text>
              </TouchableOpacity>
            )}

            <Image source={s.image} style={styles.image} />

            <Text style={styles.title}>{s.title}</Text>
            <Text style={styles.subtitle}>{s.subtitle}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => goNext(i)}
            >
              <Text style={styles.buttonTxt}>
                {i === slides.length - 1 ? 'GET STARTED' : 'NEXT'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.pagination}>
        {slides.map((_, idx) => (
          <PaginationDot
            key={idx}
            index={idx}
            translateX={translateX}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  slide: {
    width,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 60 : 40,
  },
  skipBtn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 8 : 40,
    right: 16,
  },
  skipTxt: { fontSize: 16, color: '#333' },
  image: {
    width: width * 0.7,
    height: height * 0.4,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 40,
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#4DA6FF',
    width: width * 0.85,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pagination: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4DA6FF',
    marginHorizontal: 6,
  },
});
