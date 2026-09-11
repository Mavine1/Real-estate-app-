import {
  Bell,
  CircleCheck,
  Droplets,
  FileText,
  Home,
  KeyRound,
  Layers3,
  MapPin,
  Megaphone,
  MessageCircle,
  Moon,
  Smartphone,
  Sun,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react-native";
import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  type ImageSourcePropType,
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
  image,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  color: string;
  image: ImageSourcePropType;
  onPress: () => void;
}) => {
  const Icon = icon;

  return (
  <TouchableOpacity onPress={onPress} activeOpacity={0.88} className="mr-3 w-[132px] overflow-hidden rounded-[22px] bg-white">
    <ImageBackground source={image} resizeMode="cover" className="h-20 w-full">
      <View className="absolute inset-0 bg-[#102A55]/15" />
      <View className="absolute bottom-2 left-2 size-9 items-center justify-center rounded-xl bg-white/95">
        <Icon size={19} color={color} strokeWidth={2.2} />
      </View>
    </ImageBackground>
    <View className="min-h-[52px] justify-center px-3 py-2.5">
      <Text numberOfLines={2} className="text-sm font-rubik-semibold text-black-300">{label}</Text>
    </View>
  </TouchableOpacity>
  );
};

export default function TenantDashboard() {
  const { user } = useGlobalContext();
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Tenant";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const GreetingIcon = hour >= 17 ? Moon : Sun;

  return (
    <SafeAreaView className="flex-1 bg-accent-100">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32">
        <View className="px-5 pt-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image source={user?.avatar ? { uri: user.avatar } : images.defaultProfileAvatar} className="size-12 rounded-full border-2 border-white" />
              <View className="ml-3">
                <View className="flex-row items-center">
                  <GreetingIcon size={14} color="#E66B2E" />
                  <Text className="ml-1.5 text-xs font-rubik-medium text-black-100">{greeting}</Text>
                </View>
                <Text className="mt-0.5 text-lg font-rubik-bold text-black-300">Hi, {firstName}</Text>
              </View>
            </View>
            <TouchableOpacity className="size-11 items-center justify-center rounded-full bg-white">
              <Bell size={22} color="#17213C" />
              <View className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[#FF6B35]" />
            </TouchableOpacity>
          </View>

          <ImageBackground
            source={images.tenantApartmentHome}
            resizeMode="cover"
            imageStyle={{ borderRadius: 30 }}
            className="mt-6 min-h-[248px] overflow-hidden rounded-[30px]"
          >
            <View className="absolute inset-0 bg-[#071B42]/60" />
            <View className="flex-1 justify-between p-5">
              <View className="flex-row items-start justify-between">
                <View className="self-start rounded-full bg-white/20 px-3 py-1.5">
                  <Text className="text-[10px] font-rubik-semibold tracking-wider text-white">
                    MY RESIDENCE
                  </Text>
                </View>
                <View className="flex-row items-center rounded-full bg-[#19A974]/90 px-3 py-1.5">
                  <CircleCheck size={14} color="#FFFFFF" />
                  <Text className="ml-1.5 text-[10px] font-rubik-semibold text-white">
                    ACTIVE LEASE
                  </Text>
                </View>
              </View>

              <View className="rounded-[22px] bg-[#071B42]/65 p-4">
                <View className="flex-row items-center">
                  <View className="size-10 items-center justify-center rounded-2xl bg-white/15">
                    <Home size={21} color="#FFFFFF" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-[25px] font-rubik-bold text-white">
                  {tenantHome.property}
                    </Text>
                  </View>
                </View>

                <View className="my-3 h-px bg-white/15" />
                <View className="flex-row items-center">
                  <View className="mr-4 flex-row items-center">
                    <Layers3 size={15} color="#FFFFFF" />
                    <Text className="ml-1.5 text-xs font-rubik-semibold text-white">
                      {tenantHome.floor}
                    </Text>
                  </View>
                  <View className="mr-4 flex-row items-center">
                    <KeyRound size={15} color="#FFFFFF" />
                    <Text className="ml-1.5 text-xs font-rubik-semibold text-white">
                      {tenantHome.doorNumber}
                    </Text>
                  </View>
                  <View className="min-w-0 flex-1 flex-row items-center">
                    <MapPin size={15} color="#FFFFFF" />
                    <Text className="ml-1 min-w-0 flex-1 text-xs font-rubik text-white/80" numberOfLines={1}>
                      {tenantHome.address}
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
              <Smartphone size={19} color="#FFFFFF" />
              <Text className="ml-2 text-base font-rubik-bold text-white">Pay with M-Pesa</Text>
            </TouchableOpacity>
          </View>

          <Text className="mb-3 mt-7 text-lg font-rubik-bold text-black-300">Quick actions</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="pl-5 pr-2">
          <QuickAction icon={Wallet} label="Payments" color="#2F6BFF" image={images.quickActionPayment} onPress={() => router.push("/(root)/(tabs)/payments")} />
          <QuickAction icon={Wrench} label="Report issue" color="#E66B2E" image={images.quickActionMaintenance} onPress={() => router.push("/(root)/(tabs)/maintenance")} />
          <QuickAction icon={FileText} label="Documents" color="#7A5AF8" image={images.quickActionDocuments} onPress={() => router.push("/(root)/(tabs)/documents")} />
          <QuickAction icon={MessageCircle} label="Contact agent" color="#159B6C" image={images.quickActionAgent} onPress={() => router.push("/(root)/(tabs)/maintenance")} />
        </ScrollView>

        <View className="px-5">
          <View className="mb-3 mt-7 flex-row items-center justify-between">
            <Text className="text-lg font-rubik-bold text-black-300">Maintenance</Text>
            <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/maintenance")}><Text className="text-sm font-rubik-semibold text-primary-300">View all</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/maintenance")} className="rounded-[24px] bg-white p-4">
            <View className="flex-row items-start">
              <View className="size-11 items-center justify-center rounded-2xl bg-[#FFF2EA]"><Droplets size={22} color="#E66B2E" /></View>
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
              <View className="size-10 items-center justify-center rounded-2xl bg-primary-100"><Megaphone size={20} color="#2F6BFF" /></View>
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
