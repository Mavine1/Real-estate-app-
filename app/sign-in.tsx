import React from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import icons from "@/constants/icons";
import images from "@/constants/images";
import { getAuthenticationErrorMessage, loginWithGoogle } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

const Auth = () => {
  const { loading, isLogged, setUser, refetch } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/" />;

  const handleLogin = async () => {
    console.log("[Auth] Login button pressed");
    try {
      const user = await loginWithGoogle();
      if (!user) throw new Error("Authentication returned no user.");

      setUser(user);
      await refetch();
      console.log("[Auth] User saved; navigating to home");
      router.replace("/(root)/(tabs)");
    } catch (error) {
      Alert.alert("Google sign-in failed", getAuthenticationErrorMessage(error));
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
          <View className="self-start flex-row items-center rounded-2xl bg-white/95 px-3 py-2">
            <Image source={images.logoMark} resizeMode="contain" className="size-10" />
            <Text className="ml-2 text-xl font-rubik-extrabold text-black-300">Barak Home</Text>
          </View>
          <Text className="mt-3 text-[42px] leading-[43px] font-rubik-extrabold text-white">
            Explore New{"\n"}Perspectives.
          </Text>
        </View>

        <View className="mt-auto">
          <Text className="mb-7 max-w-[285px] text-sm leading-5 font-rubik text-white/90">
            Find homes that fit your lifestyle. Start your modern living journey
            today.
          </Text>

          <View className="mb-6 flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push("/login")}
              activeOpacity={0.85}
              className="h-13 flex-1 items-center justify-center rounded-full bg-primary-300 py-4"
            >
              <Text className="text-sm font-rubik-bold text-white">Log in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/sign-up")}
              activeOpacity={0.85}
              className="h-13 flex-1 items-center justify-center rounded-full border border-white/30 bg-white py-4"
            >
              <Text className="text-sm font-rubik-bold text-[#102A55]">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4 flex-row items-center">
            <View className="h-px flex-1 bg-white/25" />
            <Text className="mx-3 text-center text-xs font-rubik text-white/70">
              or continue with
            </Text>
            <View className="h-px flex-1 bg-white/25" />
          </View>

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
            {"By continuing, you agree to Barak Home's Terms and Privacy Policy."}
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Auth;
