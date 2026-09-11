import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

import images from "@/constants/images";

export default function BrandLoader() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1.04],
  });

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.72, 1],
  });

  return (
    <View className="flex-1 items-center justify-center bg-accent-100">
      <Animated.Image
        source={images.logoMark}
        resizeMode="contain"
        className="size-28"
        style={{ opacity, transform: [{ scale }] }}
      />
      <Text className="mt-3 text-lg font-rubik-bold text-black-300">
        Baraka Homes
      </Text>
      <Text className="mt-1 text-xs font-rubik text-black-100">
        Finding your place...
      </Text>
    </View>
  );
}
