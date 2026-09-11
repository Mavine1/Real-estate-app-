import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  LogOut,
  Pencil,
  WalletCards,
  type LucideIcon,
} from "lucide-react-native";

import { logout, updateUserAvatar } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

import images from "@/constants/images";
import { settings } from "@/constants/data";

interface SettingsItemProp {
  icon: LucideIcon;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon: Icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProp) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
  >
    <View className="flex flex-row items-center gap-3">
      <View className="size-10 items-center justify-center rounded-2xl bg-primary-100">
        <Icon size={21} color={textStyle?.includes("danger") ? "#D94841" : "#2F6BFF"} strokeWidth={2.1} />
      </View>
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>
        {title}
      </Text>
    </View>

    {showArrow && <ChevronRight size={20} color="#98A2B3" strokeWidth={2.1} />}
  </TouchableOpacity>
);

const Profile = () => {
  const { user, refetch, setUser } = useGlobalContext();
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  const handleChangeAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Photo access required",
        "Allow photo-library access to choose a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? "image/jpeg";
    const extensionByMime: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };
    const extension = extensionByMime[mimeType];

    if (!extension) {
      Alert.alert("Unsupported image", "Choose a JPG, PNG, or WebP image.");
      return;
    }

    let fileSize = asset.fileSize ?? asset.file?.size;
    if (!fileSize) {
      const response = await fetch(asset.uri);
      fileSize = (await response.blob()).size;
    }

    if (fileSize > 5 * 1024 * 1024) {
      Alert.alert("Image too large", "Choose an image smaller than 5 MB.");
      return;
    }

    setUpdatingAvatar(true);
    try {
      const updatedUser = await updateUserAvatar({
        uri: asset.uri,
        name: `avatar-${Date.now()}.${extension}`,
        type: mimeType,
        size: fileSize,
      });
      setUser(updatedUser);
      await refetch();
      Alert.alert("Profile updated", "Your new profile photo has been saved.");
    } catch (error) {
      console.error("[Profile] Avatar update failed:", error);
      Alert.alert("Upload failed", "We could not save that photo. Try again.");
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      Alert.alert("Success", "Logged out successfully");
      setUser(null);
      refetch();
    } else {
      Alert.alert("Error", "Failed to logout");
    }
  };

  return (
    <SafeAreaView className="h-full bg-transparent">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Profile</Text>
          <TouchableOpacity className="size-11 items-center justify-center rounded-full bg-primary-100" accessibilityLabel="Notifications">
            <Bell size={21} color="#17213C" strokeWidth={2.1} />
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={
                user?.avatar
                  ? { uri: user.avatar }
                  : images.defaultProfileAvatar
              }
              className="size-44 relative rounded-full"
            />
            <TouchableOpacity
              className="absolute bottom-11 right-2"
              onPress={handleChangeAvatar}
              disabled={updatingAvatar}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              {updatingAvatar ? (
                <View className="size-9 items-center justify-center rounded-full bg-primary-300">
                  <ActivityIndicator color="#FFFFFF" size="small" />
                </View>
              ) : (
                <View className="size-10 items-center justify-center rounded-full border-2 border-white bg-primary-300">
                  <Pencil size={18} color="#FFFFFF" strokeWidth={2.2} />
                </View>
              )}
            </TouchableOpacity>

            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text>
            <Text className="mt-1 font-rubik-medium capitalize text-primary-300">
              {user?.role}
            </Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          {user?.role === "tenant" && (
            <>
              <SettingsItem
                icon={CalendarDays}
                title="Lease & documents"
                onPress={() => router.push("/(root)/(tabs)/documents")}
              />
              <SettingsItem
                icon={WalletCards}
                title="Payments & receipts"
                onPress={() => router.push("/(root)/(tabs)/payments")}
              />
            </>
          )}
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>

        <View className="flex flex-col border-t mt-5 pt-5 border-primary-200">
          <SettingsItem
            icon={LogOut}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
