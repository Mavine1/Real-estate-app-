import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { loginWithEmail, loginWithGoogle } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

export default function Login() {
  const { setUser, refetch } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const completeLogin = async (type: "email" | "google") => {
    if (type === "email" && (!email.trim() || !password)) {
      Alert.alert("Missing details", "Enter your email address and password.");
      return;
    }

    setSubmitting(true);
    const user =
      type === "google"
        ? await loginWithGoogle()
        : await loginWithEmail(email.trim().toLowerCase(), password);
    setSubmitting(false);

    if (!user) {
      Alert.alert("Unable to sign in", "Check your details or try Google sign-in again.");
      return;
    }

    setUser(user);
    await refetch();
    console.log("[Auth] Email login complete; navigating to home");
    router.replace("/(root)/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-accent-100">
      <KeyboardAvoidingView
        className="flex-1 justify-center px-6"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity onPress={() => router.back()} className="mb-8 self-start">
          <Text className="text-base font-rubik-semibold text-primary-300">‹ Back</Text>
        </TouchableOpacity>

        <Text className="text-3xl font-rubik-extrabold text-black-300">Welcome back</Text>
        <Text className="mt-2 text-base font-rubik text-black-100">
          Sign in to continue finding your Nairobi home.
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor="#98A2B3"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          className="mt-8 h-14 rounded-2xl border border-primary-200 bg-white px-4 font-rubik text-black-300"
        />
        <View className="relative mt-4">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#98A2B3"
            secureTextEntry={!showPassword}
            autoComplete="password"
            className="h-14 rounded-2xl border border-primary-200 bg-white pl-4 pr-14 font-rubik text-black-300"
          />
          <TouchableOpacity
            onPress={() => setShowPassword((visible) => !visible)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            hitSlop={10}
            className="absolute right-4 top-0 h-14 items-center justify-center"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#667085"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          disabled={submitting}
          onPress={() => completeLogin("email")}
          className="mt-6 h-14 items-center justify-center rounded-full bg-primary-300"
        >
          <Text className="font-rubik-bold text-white">
            {submitting ? "Signing in..." : "Log in"}
          </Text>
        </TouchableOpacity>

        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-primary-200" />
          <Text className="mx-3 font-rubik text-xs text-black-100">or continue with</Text>
          <View className="h-px flex-1 bg-primary-200" />
        </View>

        <TouchableOpacity
          disabled={submitting}
          onPress={() => completeLogin("google")}
          className="h-14 items-center justify-center rounded-full border border-primary-200 bg-white"
        >
          <Text className="font-rubik-bold text-[#102A55]">Continue with Google</Text>
        </TouchableOpacity>

        <View className="mt-8 flex-row justify-center">
          <Text className="font-rubik text-black-100">New to Baraka Homes? </Text>
          <TouchableOpacity onPress={() => router.replace("/sign-up")}>
            <Text className="font-rubik-bold text-primary-300">Sign up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
