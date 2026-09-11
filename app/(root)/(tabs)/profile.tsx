import {
  ActivityIndicator,
  Alert,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { logout, updateUserAvatar } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

import icons from "@/constants/icons";
import images from "@/constants/images";
import { settings } from "@/constants/data";

interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
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
      <Image source={icon} className="size-6" />
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>
        {title}
      </Text>
    </View>

    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
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
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Profile</Text>
          <Image source={icons.bell} className="size-5" />
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
                <Image source={icons.edit} className="size-9" />
              )}
            </TouchableOpacity>

            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text>
            <Text className="mt-1 font-rubik-medium capitalize text-primary-300">
              {user?.role}
            </Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem icon={icons.calendar} title="My Bookings" />
          <SettingsItem icon={icons.wallet} title="Payments" />
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>

        <View className="flex flex-col border-t mt-5 pt-5 border-primary-200">
          <SettingsItem
            icon={icons.logout}
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
