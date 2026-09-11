import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";
import {
  announcements,
  maintenanceRequests,
  tenantHome,
} from "@/constants/rental";
import { formatPrice } from "@/lib/format";
import { useGlobalContext } from "@/lib/global-provider";

const QuickAction = ({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} className="mr-3 w-[104px] rounded-[22px] bg-white p-4">
    <View className="size-10 items-center justify-center rounded-2xl" style={{ backgroundColor: `${color}18` }}>
      <Ionicons name={icon} size={21} color={color} />
    </View>
    <Text className="mt-3 text-sm font-rubik-semibold text-black-300">{label}</Text>
  </TouchableOpacity>
);

export default function TenantDashboard() {
  const { user } = useGlobalContext();
  const firstName = user?.name?.split(" ")[0] || "Tenant";

  return (
    <SafeAreaView className="flex-1 bg-accent-100">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32">
        <View className="px-5 pt-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image source={user?.avatar ? { uri: user.avatar } : images.defaultProfileAvatar} className="size-12 rounded-full border-2 border-white" />
              <View className="ml-3">
                <Text className="text-xs font-rubik text-black-100">Welcome home</Text>
                <Text className="text-lg font-rubik-bold text-black-300">Hi, {firstName}</Text>
              </View>
            </View>
            <TouchableOpacity className="size-11 items-center justify-center rounded-full bg-white">
              <Ionicons name="notifications-outline" size={22} color="#17213C" />
              <View className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[#FF6B35]" />
            </TouchableOpacity>
          </View>

          <ImageBackground
            source={images.tenantApartmentHome}
            resizeMode="cover"
            imageStyle={{ borderRadius: 30 }}
            className="mt-6 min-h-[230px] overflow-hidden rounded-[30px]"
          >
            <View className="absolute inset-0 bg-[#071B42]/75" />
            <View className="flex-1 justify-between p-5">
              <View className="flex-row items-start justify-between">
                <View className="self-start rounded-full bg-white/20 px-3 py-1.5">
                  <Text className="text-[11px] font-rubik-semibold text-white">MY HOME</Text>
                </View>
                <View className="size-12 items-center justify-center rounded-[18px] bg-white/20">
                  <Ionicons name="home" size={25} color="#FFFFFF" />
                </View>
              </View>

              <View>
                <Text className="text-[28px] font-rubik-bold text-white">
                  {tenantHome.property}
                </Text>
                <View className="mt-2 flex-row items-center">
                  <Ionicons name="location-outline" size={15} color="#DCE6FA" />
                  <Text className="ml-1 text-xs font-rubik text-[#DCE6FA]">
                    {tenantHome.address}
                  </Text>
                </View>
                <View className="mt-4 flex-row">
                  <View className="mr-2 flex-row items-center rounded-full bg-white/20 px-3 py-2">
                    <Ionicons name="layers-outline" size={15} color="#FFFFFF" />
                    <Text className="ml-1.5 text-xs font-rubik-semibold text-white">
                      {tenantHome.floor}
                    </Text>
                  </View>
                  <View className="flex-row items-center rounded-full bg-white/20 px-3 py-2">
                    <Ionicons name="key-outline" size={15} color="#FFFFFF" />
                    <Text className="ml-1.5 text-xs font-rubik-semibold text-white">
                      Door {tenantHome.doorNumber}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>

          <View className="-mt-1 rounded-b-[28px] bg-white px-5 pb-5 pt-6">
            <View className="flex-row items-end justify-between">
              <View>
                <Text className="text-xs font-rubik text-black-100">Rent balance</Text>
                <Text className="mt-1 text-[28px] font-rubik-bold text-black-300">{formatPrice(tenantHome.balance)}</Text>
                <Text className="mt-1 text-xs font-rubik-medium text-[#E66B2E]">{tenantHome.dueLabel}</Text>
              </View>
              <View className="rounded-full bg-[#FFF2EA] px-3 py-2">
                <Text className="text-xs font-rubik-semibold text-[#E66B2E]">Due soon</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/payments")} className="mt-5 h-14 flex-row items-center justify-center rounded-full bg-primary-300">
              <Ionicons name="phone-portrait-outline" size={19} color="#FFFFFF" />
              <Text className="ml-2 text-base font-rubik-bold text-white">Pay with M-Pesa</Text>
            </TouchableOpacity>
          </View>

          <Text className="mb-3 mt-7 text-lg font-rubik-bold text-black-300">Quick actions</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="pl-5 pr-2">
          <QuickAction icon="wallet-outline" label="Payments" color="#2F6BFF" onPress={() => router.push("/(root)/(tabs)/payments")} />
          <QuickAction icon="construct-outline" label="Report issue" color="#E66B2E" onPress={() => router.push("/(root)/(tabs)/maintenance")} />
          <QuickAction icon="document-text-outline" label="Documents" color="#7A5AF8" onPress={() => router.push("/(root)/(tabs)/documents")} />
          <QuickAction icon="chatbubble-ellipses-outline" label="Contact agent" color="#159B6C" onPress={() => router.push("/(root)/(tabs)/maintenance")} />
        </ScrollView>

        <View className="px-5">
          <View className="mb-3 mt-7 flex-row items-center justify-between">
            <Text className="text-lg font-rubik-bold text-black-300">Maintenance</Text>
            <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/maintenance")}><Text className="text-sm font-rubik-semibold text-primary-300">View all</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/maintenance")} className="rounded-[24px] bg-white p-4">
            <View className="flex-row items-start">
              <View className="size-11 items-center justify-center rounded-2xl bg-[#FFF2EA]"><Ionicons name="water-outline" size={22} color="#E66B2E" /></View>
              <View className="ml-3 flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-rubik-semibold text-black-300">{maintenanceRequests[0].title}</Text>
                  <Text className="text-[11px] font-rubik-semibold text-[#2F6BFF]">{maintenanceRequests[0].status}</Text>
                </View>
                <Text className="mt-1 text-xs font-rubik text-black-100">{maintenanceRequests[0].update}</Text>
                <View className="mt-4 h-1.5 overflow-hidden rounded-full bg-primary-100"><View className="h-full w-3/4 rounded-full bg-primary-300" /></View>
              </View>
            </View>
          </TouchableOpacity>

          <View className="mb-3 mt-7 flex-row items-center justify-between">
            <Text className="text-lg font-rubik-bold text-black-300">Announcements</Text>
            <Text className="text-xs font-rubik text-black-100">Latest</Text>
          </View>
          {announcements.map((item) => (
            <View key={item.id} className="mb-3 flex-row rounded-[22px] bg-white p-4">
              <View className="size-10 items-center justify-center rounded-2xl bg-primary-100"><Ionicons name="megaphone-outline" size={20} color="#2F6BFF" /></View>
              <View className="ml-3 flex-1">
                <View className="flex-row justify-between"><Text className="font-rubik-semibold text-black-300">{item.title}</Text><Text className="text-[10px] font-rubik text-black-100">{item.time}</Text></View>
                <Text className="mt-1 text-xs leading-5 font-rubik text-black-200">{item.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
