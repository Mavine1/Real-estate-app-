import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
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
  KeyRound,
  LockKeyhole,
  LogOut,
  Pencil,
  ShieldCheck,
  WalletCards,
  type LucideIcon,
} from "lucide-react-native";

import {
  logout,
  updateSecurityPreferences,
  updateUserAvatar,
  updateUserPassword,
} from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

import images from "@/constants/images";

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
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [savingSecurity, setSavingSecurity] = useState(false);

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

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Complete all fields", "Enter your current password and your new password twice.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords do not match", "Type the same new password in both fields.");
      return;
    }

    setSavingPassword(true);
    try {
      await updateUserPassword(currentPassword, newPassword);
      setPasswordModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Password updated", "Your Baraka Homes password has been changed.");
    } catch (error) {
      Alert.alert("Could not update password", error instanceof Error ? error.message : "Try again shortly.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSecuritySave = async () => {
    setSavingSecurity(true);
    try {
      await updateSecurityPreferences(loginAlerts);
      setSecurityModalVisible(false);
      Alert.alert("Security settings saved", loginAlerts ? "We will alert you about new sign-ins." : "Login alerts are turned off.");
    } catch (error) {
      Alert.alert("Could not save settings", error instanceof Error ? error.message : "Try again shortly.");
    } finally {
      setSavingSecurity(false);
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
          <Text className="mb-2 text-sm font-rubik-semibold text-black-100">ACCOUNT</Text>
          <SettingsItem icon={Pencil} title="Change profile photo" onPress={handleChangeAvatar} />
          <SettingsItem icon={KeyRound} title="Change password" onPress={() => setPasswordModalVisible(true)} />
          <SettingsItem icon={ShieldCheck} title="Security settings" onPress={() => setSecurityModalVisible(true)} />
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
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

      <Modal transparent visible={passwordModalVisible} animationType="slide" onRequestClose={() => setPasswordModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-[30px] bg-white px-6 pb-9 pt-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xl font-rubik-bold text-black-300">Change password</Text>
                <Text className="mt-1 text-sm font-rubik text-black-200">Use at least 8 characters.</Text>
              </View>
              <View className="size-11 items-center justify-center rounded-full bg-primary-100"><LockKeyhole size={21} color="#2F6BFF" /></View>
            </View>
            {[
              ["Current password", currentPassword, setCurrentPassword],
              ["New password", newPassword, setNewPassword],
              ["Confirm new password", confirmPassword, setConfirmPassword],
            ].map(([placeholder, value, onChange]) => (
              <TextInput
                key={placeholder as string}
                value={value as string}
                onChangeText={onChange as (text: string) => void}
                placeholder={placeholder as string}
                secureTextEntry
                className="mt-4 h-14 rounded-2xl border border-primary-200 px-4 font-rubik text-black-300"
              />
            ))}
            <TouchableOpacity onPress={handlePasswordChange} disabled={savingPassword} className="mt-5 h-14 items-center justify-center rounded-full bg-primary-300">
              {savingPassword ? <ActivityIndicator color="#FFFFFF" /> : <Text className="font-rubik-bold text-white">Update password</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPasswordModalVisible(false)} className="mt-4 items-center"><Text className="font-rubik-medium text-black-200">Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={securityModalVisible} animationType="slide" onRequestClose={() => setSecurityModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-[30px] bg-white px-6 pb-9 pt-6">
            <Text className="text-xl font-rubik-bold text-black-300">Security settings</Text>
            <Text className="mt-1 text-sm leading-5 font-rubik text-black-200">Keep your account protected and stay informed about access.</Text>
            <View className="mt-6 flex-row items-center justify-between rounded-[20px] bg-primary-100 p-4">
              <View className="mr-4 flex-1"><Text className="font-rubik-bold text-black-300">New sign-in alerts</Text><Text className="mt-1 text-xs leading-4 font-rubik text-black-200">Get notified when your account is accessed on a new device.</Text></View>
              <Switch value={loginAlerts} onValueChange={setLoginAlerts} trackColor={{ false: "#CBD5E1", true: "#92B2FF" }} thumbColor={loginAlerts ? "#2F6BFF" : "#FFFFFF"} />
            </View>
            <View className="mt-4 flex-row items-start rounded-[20px] border border-primary-200 p-4"><ShieldCheck size={20} color="#16806B" /><Text className="ml-3 flex-1 text-xs leading-5 font-rubik text-black-200">Your password and sign-in settings are stored securely with Baraka Homes.</Text></View>
            <TouchableOpacity onPress={handleSecuritySave} disabled={savingSecurity} className="mt-5 h-14 items-center justify-center rounded-full bg-primary-300">
              {savingSecurity ? <ActivityIndicator color="#FFFFFF" /> : <Text className="font-rubik-bold text-white">Save security settings</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSecurityModalVisible(false)} className="mt-4 items-center"><Text className="font-rubik-medium text-black-200">Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
