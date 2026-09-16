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
  Building2,
  CalendarDays,
  ChevronRight,
  FileText,
  KeyRound,
  LockKeyhole,
  LogOut,
  MessageCircle,
  Pencil,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  WalletCards,
  Gift,
  type LucideIcon,
} from "lucide-react-native";

import {
  logout,
  updateSecurityPreferences,
  updateUserAvatar,
  updateUserPreferences,
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
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [payoutAccount, setPayoutAccount] = useState("+254 712 000 456");
  const [commissionRate, setCommissionRate] = useState("5");
  const [approvalLimit, setApprovalLimit] = useState("25,000");
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true, rent: true, maintenance: true, financial: true });

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

  const handleSettingsSave = async () => {
    setSavingSettings(true);
    try {
      await updateUserPreferences({ ownerSettings: { payoutAccount, commissionRate, approvalLimit, notifications } });
      setSettingsVisible(false);
      Alert.alert("Settings saved", "Your payout, expense, commission, and alert preferences have been updated.");
    } catch (error) {
      Alert.alert("Could not save settings", error instanceof Error ? error.message : "Try again shortly.");
    } finally {
      setSavingSettings(false);
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
          <SettingsItem
            icon={UserRound}
            title="Profile"
            onPress={() => setProfileSettingsOpen((open) => !open)}
          />
          {profileSettingsOpen && (
            <View className="ml-5 border-l border-primary-200 pl-5">
              <SettingsItem icon={Pencil} title="Change profile photo" onPress={handleChangeAvatar} />
              <SettingsItem icon={KeyRound} title="Change password" onPress={() => setPasswordModalVisible(true)} />
              <SettingsItem icon={ShieldCheck} title="Security settings" onPress={() => setSecurityModalVisible(true)} />
              {user?.role === "agent" && <>
                <SettingsItem icon={Building2} title="Manage houses" onPress={() => router.push({ pathname: "/(root)/(tabs)/management", params: { section: "homes" } })} />
                <SettingsItem icon={MessageCircle} title="Tenant communication" onPress={() => router.push({ pathname: "/(root)/(tabs)/management", params: { section: "messages" } })} />
                <SettingsItem icon={WalletCards} title="Withdrawal account" onPress={() => router.push({ pathname: "/(root)/(tabs)/management", params: { section: "payouts" } })} />
              </>}
            </View>
          )}
        </View>

        {user?.role === "tenant" && (
          <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
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
          </View>
        )}

        <View className={`flex flex-col ${user?.role === "owner" ? "mt-1" : "border-t mt-5 pt-5 border-primary-200"}`}>
          {user?.role === "owner" && <SettingsItem
            icon={FileText}
            title="Documents"
            onPress={() => router.push("/(root)/(tabs)/documents")}
          />}
          {user?.role === "owner" && <SettingsItem
            icon={MessageCircle}
            title="Communication"
            onPress={() => router.push({ pathname: "/(root)/(tabs)/management", params: { section: "messages" } })}
          />}
          {user?.role !== "owner" && <SettingsItem
            icon={Gift}
            title="Referral code & link"
            onPress={() => Alert.alert("Referral code", `Share BARAKA-${(user?.$id ?? "WELCOME").slice(-6).toUpperCase()} with friends.\n\nhttps://barakahomes.app/join`)}
          />}
          {user?.role === "owner" && <SettingsItem
            icon={SlidersHorizontal}
            title="Settings"
            onPress={() => setSettingsVisible(true)}
          />}
        </View>

        <View className={`flex flex-col ${user?.role === "owner" ? "mt-1" : "border-t mt-5 pt-5 border-primary-200"}`}>
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

      <Modal transparent visible={settingsVisible} animationType="slide" onRequestClose={() => setSettingsVisible(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <ScrollView className="max-h-[88%] rounded-t-[30px] bg-white" contentContainerClassName="p-6 pb-10">
            <View className="flex-row items-center justify-between"><View><Text className="text-xl font-rubik-bold text-black-300">Settings</Text><Text className="mt-1 text-sm font-rubik text-black-100">Financial controls and notifications.</Text></View><TouchableOpacity onPress={() => setSettingsVisible(false)} className="size-10 items-center justify-center rounded-full bg-primary-100"><Text className="text-xl font-rubik-semibold text-black-200">×</Text></TouchableOpacity></View>
            <Text className="mt-6 text-sm font-rubik-bold text-black-300">FINANCIAL SETTINGS</Text>
            <Text className="mt-3 text-xs font-rubik text-black-100">Payout account</Text><TextInput value={payoutAccount} onChangeText={setPayoutAccount} keyboardType="phone-pad" className="mt-2 h-13 rounded-2xl border border-primary-200 px-4 font-rubik text-black-300" />
            <Text className="mt-4 text-xs font-rubik text-black-100">Agent commission (%)</Text><TextInput value={commissionRate} onChangeText={setCommissionRate} keyboardType="numeric" className="mt-2 h-13 rounded-2xl border border-primary-200 px-4 font-rubik text-black-300" />
            <Text className="mt-4 text-xs font-rubik text-black-100">Expense approval limit (KSh)</Text><TextInput value={approvalLimit} onChangeText={setApprovalLimit} keyboardType="numeric" className="mt-2 h-13 rounded-2xl border border-primary-200 px-4 font-rubik text-black-300" />
            <Text className="mt-6 text-sm font-rubik-bold text-black-300">NOTIFICATIONS</Text>
            {([ ["Email", "email"], ["SMS", "sms"], ["Push notifications", "push"], ["Rent alerts", "rent"], ["Maintenance alerts", "maintenance"], ["Financial alerts", "financial"] ] as const).map(([label, key]) => <View key={key} className="mt-2 flex-row items-center justify-between rounded-2xl bg-primary-100 px-4 py-3"><Text className="font-rubik-medium text-black-300">{label}</Text><Switch value={notifications[key]} onValueChange={(value) => setNotifications((current) => ({ ...current, [key]: value }))} trackColor={{ false: "#CBD5E1", true: "#92B2FF" }} thumbColor={notifications[key] ? "#2F6BFF" : "#FFFFFF"} /></View>)}
            <TouchableOpacity onPress={handleSettingsSave} disabled={savingSettings} className="mt-6 h-14 items-center justify-center rounded-full bg-primary-300">{savingSettings ? <ActivityIndicator color="#FFFFFF" /> : <Text className="font-rubik-bold text-white">Save settings</Text>}</TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Referral and owner-settings panels removed from the Profile menu.
      <Modal transparent visible={referralModalVisible} animationType="slide" onRequestClose={() => setReferralModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-[30px] bg-white px-6 pb-9 pt-6">
            <View className="size-12 items-center justify-center rounded-2xl bg-[#FFF2D8]"><Gift size={23} color="#D88700" strokeWidth={2.2} /></View>
            <Text className="mt-4 text-xl font-rubik-bold text-black-300">Invite a friend</Text>
            <Text className="mt-1 text-sm leading-5 font-rubik text-black-200">Share your code and link with someone looking for their next home.</Text>
            <Text className="mt-6 text-xs font-rubik-semibold text-black-100">YOUR REFERRAL CODE</Text>
            <View className="mt-2 rounded-2xl border border-dashed border-primary-300 bg-primary-100 px-4 py-4"><Text className="text-center text-lg font-rubik-bold tracking-widest text-primary-300">{referralCode}</Text></View>
            <Text className="mt-5 text-xs font-rubik-semibold text-black-100">YOUR REFERRAL LINK</Text>
            <Text selectable className="mt-2 rounded-2xl bg-primary-100 px-4 py-4 text-xs leading-5 font-rubik text-primary-300">{referralLink}</Text>
            <TouchableOpacity onPress={handleShareReferral} className="mt-5 h-14 items-center justify-center rounded-full bg-primary-300"><Text className="font-rubik-bold text-white">Share invitation</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setReferralModalVisible(false)} className="mt-4 items-center"><Text className="font-rubik-medium text-black-200">Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={ownerSettingsVisible} animationType="slide" onRequestClose={() => setOwnerSettingsVisible(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <ScrollView className="max-h-[88%] rounded-t-[30px] bg-white" contentContainerClassName="p-6 pb-10">
            <View className="flex-row items-center justify-between"><View><Text className="text-xl font-rubik-bold text-black-300">Owner settings</Text><Text className="mt-1 text-sm font-rubik text-black-100">Control your portfolio and alerts.</Text></View><View className="size-11 items-center justify-center rounded-full bg-primary-100"><SlidersHorizontal size={21} color="#2F6BFF" /></View></View>
            <Text className="mt-6 text-sm font-rubik-bold text-black-300">ACCOUNT & SECURITY</Text>
            <View className="mt-3 rounded-[20px] bg-primary-100 p-4"><View className="flex-row items-center justify-between"><View className="flex-1"><Text className="font-rubik-semibold text-black-300">Two-factor authentication</Text><Text className="mt-1 text-xs leading-4 font-rubik text-black-100">Require an extra verification step for sign-ins.</Text></View><Switch value={ownerSettings.twoFactor} onValueChange={(value) => setOwnerSettings((settings) => ({ ...settings, twoFactor: value }))} trackColor={{ false: "#CBD5E1", true: "#92B2FF" }} thumbColor={ownerSettings.twoFactor ? "#2F6BFF" : "#FFFFFF"} /></View></View>
            <Text className="mt-6 text-sm font-rubik-bold text-black-300">PROPERTY SETTINGS</Text>
            <View className="mt-3 rounded-[20px] bg-primary-100 p-4"><Text className="font-rubik-semibold text-black-300">Property information · Rent settings</Text><Text className="mt-1 text-xs leading-5 font-rubik text-black-100">Update property details, unit rents, payment terms, utility charges, and tenant-facing settings from your Portfolio.</Text></View>
            <Text className="mt-6 text-sm font-rubik-bold text-black-300">FINANCIAL SETTINGS</Text>
            <View className="mt-3 rounded-[20px] bg-primary-100 p-4"><Text className="font-rubik-semibold text-black-300">Payout account · Payment methods</Text><Text className="mt-1 text-xs leading-5 font-rubik text-black-100">Manage payout accounts, agent commissions, expense rules, and payment methods in Payouts & Reports.</Text></View>
            <Text className="mt-6 text-sm font-rubik-bold text-black-300">NOTIFICATION SETTINGS</Text>
            {([ ["Email notifications", "email"], ["SMS notifications", "sms"], ["Push notifications", "push"], ["Rent alerts", "rentAlerts"], ["Maintenance alerts", "maintenanceAlerts"], ["Financial alerts", "financialAlerts"] ] as const).map(([label, key]) => <View key={key} className="mt-2 flex-row items-center justify-between rounded-2xl bg-primary-100 px-4 py-3"><Text className="font-rubik-medium text-black-300">{label}</Text><Switch value={ownerSettings[key]} onValueChange={(value) => setOwnerSettings((settings) => ({ ...settings, [key]: value }))} trackColor={{ false: "#CBD5E1", true: "#92B2FF" }} thumbColor={ownerSettings[key] ? "#2F6BFF" : "#FFFFFF"} /></View>)}
            <TouchableOpacity onPress={saveOwnerSettings} disabled={savingOwnerSettings} className="mt-6 h-14 items-center justify-center rounded-full bg-primary-300">{savingOwnerSettings ? <ActivityIndicator color="#FFFFFF" /> : <Text className="font-rubik-bold text-white">Save owner settings</Text>}</TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
      */}
    </SafeAreaView>
  );
};

export default Profile;
