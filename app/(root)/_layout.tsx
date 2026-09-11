import { Redirect, Slot } from "expo-router";
import { ImageBackground, View } from "react-native";

import BrandLoader from "@/components/BrandLoader";
import images from "@/constants/images";
import { useGlobalContext } from "@/lib/global-provider";

export default function AppLayout() {
  const { loading, isLogged } = useGlobalContext();

  if (loading) {
    return <BrandLoader />;
  }

  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <ImageBackground
      source={images.authNairobi}
      resizeMode="cover"
      className="flex-1"
    >
      <View
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(244, 247, 255, 0.84)" }}
      />
      <View className="absolute -right-24 top-20 size-64 rounded-full bg-primary-200/30" />
      <View className="absolute -left-28 bottom-28 size-72 rounded-full bg-white/35" />
      <Slot />
    </ImageBackground>
  );
}
