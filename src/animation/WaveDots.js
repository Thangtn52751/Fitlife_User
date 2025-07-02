import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const WaveDots = ({
  count = 3,
  size = 8,
  spacing = 12,
  duration = 800,
  color = '#fff',
}) => {
 
  const dots = Array.from({ length: count }).map(() => useSharedValue(0));

  useEffect(() => {
    dots.forEach((dot, i) => {
      
      dot.value = withDelay(
        (duration / count) * i,
        withRepeat(
          withSequence(
            withTiming(1, { duration: duration / 2 }),
            withTiming(0, { duration: duration / 2 })
          ),
          -1,
          false
        )
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      {dots.map((dot, i) => {
        const style = useAnimatedStyle(() => ({
          transform: [{ scale: 1 + dot.value * 0.6 }],
          opacity: 0.5 + dot.value * 0.5,
        }));
        return (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { width: size, height: size, marginHorizontal: spacing / 2, backgroundColor: color },
              style,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 24,
  },
  dot: {
    borderRadius: 99,
  },
});

export default WaveDots;
