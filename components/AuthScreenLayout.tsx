import { ReactNode } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";

export default function AuthScreenLayout({ children }: { children: ReactNode }) {
  return (
    <ImageBackground
      source={images.authNairobi}
      resizeMode="cover"
      className="flex-1"
    >
      <View className="absolute inset-0 bg-[#071F4A]/45" />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="flex-grow justify-center px-6 py-8"
          >
            <View className="rounded-[30px] border border-white/60 bg-white/95 px-6 py-7 shadow-lg">
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}
