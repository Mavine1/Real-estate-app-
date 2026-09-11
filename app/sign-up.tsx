import { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AuthScreenLayout from "@/components/AuthScreenLayout";
import {
  getAuthenticationErrorMessage,
  loginWithGoogle,
  signUpWithEmail,
} from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

export default function SignUp() {
  const { setUser, refetch } = useGlobalContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const finish = async (type: "email" | "google") => {
    if (type === "email") {
      if (!name.trim() || !email.trim() || !password) {
        Alert.alert("Missing details", "Enter your name, email address, and password.");
        return;
      }
      if (password.length < 8) {
        Alert.alert("Choose a stronger password", "Your password must have at least 8 characters.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const user =
        type === "google"
          ? await loginWithGoogle()
          : await signUpWithEmail(name, email.trim().toLowerCase(), password);

      if (!user) throw new Error("Authentication returned no user.");

      setUser(user);
      await refetch();
      console.log(`[Auth] ${type} account creation complete; navigating to home`);
      router.replace("/(root)/(tabs)");
    } catch (error) {
      Alert.alert(
        type === "google" ? "Google sign-in failed" : "Unable to create account",
        getAuthenticationErrorMessage(error)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenLayout>
        <TouchableOpacity onPress={() => router.back()} className="mb-8 flex-row items-center self-start">
          <Ionicons name="chevron-back" size={19} color="#2F6BFF" />
          <Text className="font-rubik-semibold text-primary-300">Back</Text>
        </TouchableOpacity>

        <Text className="text-3xl font-rubik-extrabold text-black-300">Create your account</Text>
        <Text className="mt-2 text-base font-rubik text-black-100">
          Start your home search with Baraka Homes.
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          placeholderTextColor="#98A2B3"
          autoComplete="name"
          className="mt-8 h-14 rounded-2xl border border-primary-200 bg-white px-4 font-rubik text-black-300"
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor="#98A2B3"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          className="mt-4 h-14 rounded-2xl border border-primary-200 bg-white px-4 font-rubik text-black-300"
        />
        <View className="relative mt-4">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password (at least 8 characters)"
            placeholderTextColor="#98A2B3"
            secureTextEntry={!showPassword}
            autoComplete="new-password"
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
          onPress={() => finish("email")}
          className="mt-6 h-14 items-center justify-center rounded-full bg-primary-300"
        >
          <Text className="font-rubik-bold text-white">
            {submitting ? "Creating account..." : "Sign up"}
          </Text>
        </TouchableOpacity>

        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-primary-200" />
          <Text className="mx-3 font-rubik text-xs text-black-100">or continue with</Text>
          <View className="h-px flex-1 bg-primary-200" />
        </View>

        <TouchableOpacity
          disabled={submitting}
          onPress={() => finish("google")}
          className="h-14 items-center justify-center rounded-full border border-primary-200 bg-white"
        >
          <Text className="font-rubik-bold text-[#102A55]">Continue with Google</Text>
        </TouchableOpacity>

        <View className="mt-8 flex-row justify-center">
          <Text className="font-rubik text-black-100">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text className="font-rubik-bold text-primary-300">Log in</Text>
          </TouchableOpacity>
        </View>
    </AuthScreenLayout>
  );
}
