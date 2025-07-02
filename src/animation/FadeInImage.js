import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const FadeInImageReanimated = ({
  source,
  style,
  duration = 2000,
  onFadeInComplete,
  resizeMode = 'contain',
}) => {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration }, (finished) => {
      if (finished && onFadeInComplete) {
        runOnJS(onFadeInComplete)();
      }
    });
  }, [duration, onFadeInComplete, opacity]);

  return (
    <Animated.Image
      source={source}
      style={[style, animatedStyle]}
      resizeMode={resizeMode}
    />
  );
};

export default FadeInImageReanimated;