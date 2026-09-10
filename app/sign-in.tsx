import React from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import icons from "@/constants/icons";
import images from "@/constants/images";
import { login } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

const Auth = () => {
  const { refetch, loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/" />;

  const handleLogin = async () => {
    const result = await login();
    if (result) {
      await refetch();
    } else {
      Alert.alert("Unable to sign in", "Google sign-in was not completed.");
    }
  };

  return (
    <ImageBackground
      source={images.onboardingBaraka}
      resizeMode="cover"
      className="flex-1"
    >
      <StatusBar style="light" />
      <View className="absolute inset-0 bg-[#071F4A]/20" />

      <SafeAreaView className="flex-1 px-7 pb-8">
        <View className="pt-8">
          <Text className="text-xs font-rubik-bold tracking-[3px] text-white/80 uppercase">
            Baraka Homes
          </Text>
          <Text className="mt-3 text-[42px] leading-[43px] font-rubik-extrabold text-white">
            Explore New{"\n"}Perspectives.
          </Text>
        </View>

        <View className="mt-auto">
          <Text className="mb-7 max-w-[285px] text-sm leading-5 font-rubik text-white/90">
            Find homes that fit your lifestyle. Start your modern living journey
            today.
          </Text>

          <Text className="mb-3 text-center text-xs font-rubik text-white/70">
            Continue with
          </Text>

          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.85}
            className="h-14 w-full flex-row items-center justify-center rounded-full bg-white"
          >
            <Image
              source={icons.google}
              className="size-6"
              resizeMode="contain"
            />
            <Text className="ml-3 text-base font-rubik-bold text-[#102A55]">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <Text className="mt-5 text-center text-[11px] leading-4 font-rubik text-white/60">
            By continuing, you agree to Baraka Homes' Terms and Privacy Policy.
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Auth;
