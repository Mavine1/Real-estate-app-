import {
  Bell,
  Building2,
  ChevronRight,
  FileText,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";
import { agentOverview, ownerOverview } from "@/constants/rental";
import { formatPrice } from "@/lib/format";
import { useGlobalContext } from "@/lib/global-provider";

const Stat = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <View className={`mb-3 w-[48%] rounded-[22px] p-4 ${accent ? "bg-[#102A55]" : "bg-white"}`}>
    <Text className={`text-xs font-rubik ${accent ? "text-white/65" : "text-black-100"}`}>{label}</Text>
    <Text className={`mt-2 text-xl font-rubik-bold ${accent ? "text-white" : "text-black-300"}`}>{value}</Text>
  </View>
);

export default function RoleDashboard() {
  const { user } = useGlobalContext();
  const owner = user?.role === "owner";
  const name = user?.name?.split(" ")[0] || (owner ? "Owner" : "Agent");

  return (
    <SafeAreaView className="flex-1 bg-accent-100">
      <ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Image source={images.logoMark} resizeMode="contain" className="size-10" />
            </View>
            <View className="ml-3">
              <Text className="text-xs font-rubik-semibold uppercase tracking-wider text-primary-300">Barak Home</Text>
              <Text className="text-lg font-rubik-bold text-black-300">Hi, {name}</Text>
              <Text className="text-[11px] font-rubik text-black-100">{owner ? "Owner portal" : "Agent portal"}</Text>
            </View>
          </View>
          <TouchableOpacity className="size-11 items-center justify-center rounded-full bg-white"><Bell size={22} color="#17213C" /></TouchableOpacity>
        </View>

        {owner ? (
          <>
            <View className="mt-6 rounded-[28px] bg-[#102A55] p-5">
              <Text className="text-xs font-rubik-medium text-white/65">SEPTEMBER OWNER PAYOUT</Text>
              <Text className="mt-2 text-3xl font-rubik-bold text-white">{formatPrice(ownerOverview.payout)}</Text>
              <Text className="mt-2 text-xs font-rubik text-white/65">After expenses and management fees</Text>
              <View className="mt-5 h-px bg-white/15" />
              <View className="mt-4 flex-row justify-between"><Text className="text-xs font-rubik text-white/60">Collected</Text><Text className="font-rubik-semibold text-white">{formatPrice(ownerOverview.collected)}</Text></View>
            </View>
            <Text className="mb-3 mt-7 text-lg font-rubik-bold text-black-300">Portfolio performance</Text>
            <View className="flex-row flex-wrap justify-between">
              <Stat label="Expected rent" value={formatPrice(ownerOverview.expected)} />
              <Stat label="Expenses" value={formatPrice(ownerOverview.expenses)} />
              <Stat label="Management fee" value={formatPrice(ownerOverview.managementFee)} />
              <Stat label="Occupancy" value={`${ownerOverview.occupancy}%`} accent />
            </View>
          </>
        ) : (
          <>
            <View className="mt-6 flex-row flex-wrap justify-between">
              <Stat label="Rent collected" value={formatPrice(agentOverview.collected)} accent />
              <Stat label="Expected" value={formatPrice(agentOverview.expected)} />
              <Stat label="Outstanding" value={formatPrice(agentOverview.outstanding)} />
              <Stat label="Occupancy" value={`${agentOverview.occupancy}%`} />
            </View>
            <Text className="mb-3 mt-5 text-lg font-rubik-bold text-black-300">Needs attention</Text>
            {([{ icon: Users, title: "Tenants overdue", value: "3", color: "#E66B2E" }, { icon: Wrench, title: "Open maintenance", value: `${agentOverview.openMaintenance}`, color: "#7A5AF8" }, { icon: FileText, title: "Leases expiring", value: "4", color: "#2F6BFF" }] as { icon: LucideIcon; title: string; value: string; color: string }[]).map((item) => {
              const Icon = item.icon;
              return (
              <TouchableOpacity key={item.title} className="mb-3 flex-row items-center rounded-[22px] bg-white p-4">
                <View className="size-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${item.color}18` }}><Icon size={22} color={item.color} /></View>
                <Text className="ml-3 flex-1 font-rubik-semibold text-black-300">{item.title}</Text><Text className="text-xl font-rubik-bold text-black-300">{item.value}</Text><ChevronRight size={18} color="#98A2B3" />
              </TouchableOpacity>
              );
            })}
          </>
        )}

        <Text className="mb-3 mt-5 text-lg font-rubik-bold text-black-300">{owner ? "Property snapshot" : "Quick actions"}</Text>
        <View className="rounded-[24px] bg-white p-5">
          <View className="flex-row items-center"><View className="size-12 items-center justify-center rounded-2xl bg-primary-100"><Building2 size={24} color="#2F6BFF" /></View><View className="ml-3 flex-1"><Text className="font-rubik-bold text-black-300">Sunrise Apartments</Text><Text className="mt-1 text-xs font-rubik text-black-100">48 units • 43 occupied • Kilimani</Text></View><ChevronRight size={20} color="#98A2B3" /></View>
          <View className="mt-5 h-2 overflow-hidden rounded-full bg-primary-100"><View className="h-full w-[90%] rounded-full bg-[#23C483]" /></View>
          <Text className="mt-2 text-right text-xs font-rubik-semibold text-[#159B6C]">89.6% occupied</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
