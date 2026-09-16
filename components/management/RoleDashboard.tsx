import {
  Bell,
  Building2,
  ChevronRight,
  FileText,
  Moon,
  Sun,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react-native";
import { Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const owner = user?.role === "owner";
  const firstName = user?.name?.trim().split(/\s+/)[0] || (owner ? "Owner" : "Agent");
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const GreetingIcon = hour >= 17 ? Moon : Sun;

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
        <View className="mt-4 flex-row items-center justify-between">
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
          <TouchableOpacity onPress={() => owner ? setNotificationsOpen(true) : Alert.alert("Agent notifications", "3 tenants have rent reminders due.\n2 maintenance requests are open.\n1 home is currently vacant.")} className="size-11 items-center justify-center rounded-full bg-white"><Bell size={22} color="#17213C" /></TouchableOpacity>
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
            <View className="mt-4 rounded-[24px] bg-white p-5">
              <View className="flex-row items-center justify-between"><View><Text className="font-rubik-bold text-black-300">Revenue trend</Text><Text className="mt-1 text-xs font-rubik text-black-100">Expected vs collected rent</Text></View><Text className="font-rubik-semibold text-[#159B6C]">+6.4%</Text></View>
              <View className="mt-5 h-32 flex-row items-end justify-between">{[52, 70, 63, 88, 76, 98].map((height, index) => <View key={index} className="items-center"><View className="w-6 rounded-t-lg bg-primary-200" style={{ height }}><View className="absolute bottom-0 w-6 rounded-t-lg bg-primary-300" style={{ height: Math.max(24, height - 15) }} /></View><Text className="mt-2 text-[10px] font-rubik text-black-100">{["Apr", "May", "Jun", "Jul", "Aug", "Sep"][index]}</Text></View>)}</View>
            </View>
            <Text className="mb-3 mt-7 text-lg font-rubik-bold text-black-300">Owner actions</Text>
            {[
              { title: "Property portfolio", subtitle: "8 properties · 126 units", section: "homes" },
              { title: "Agent performance", subtitle: "4 active agents · 94% collection", section: "agents" },
              { title: "Reports centre", subtitle: "PDF, Excel and CSV exports", section: "reports" },
              { title: "Approval centre", subtitle: "7 requests require review", section: "approvals" },
            ].map((item) => <TouchableOpacity key={item.title} onPress={() => router.push({ pathname: "/(root)/(tabs)/management", params: { section: item.section } })} className="mb-3 flex-row items-center rounded-[22px] bg-white p-4"><View className="size-11 items-center justify-center rounded-2xl bg-primary-100"><Building2 size={21} color="#2F6BFF" /></View><View className="ml-3 flex-1"><Text className="font-rubik-semibold text-black-300">{item.title}</Text><Text className="mt-1 text-xs font-rubik text-black-100">{item.subtitle}</Text></View><ChevronRight size={19} color="#98A2B3" /></TouchableOpacity>)}
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

        {!owner && <View className="mb-2 flex-row flex-wrap justify-between">
          <TouchableOpacity onPress={() => router.push({ pathname: "/(root)/(tabs)/management", params: { section: "homes" } })} className="mb-3 w-[48%] rounded-[22px] bg-white p-4"><Building2 size={21} color="#2F6BFF" /><Text className="mt-3 font-rubik-bold text-black-300">Manage homes</Text><Text className="mt-1 text-[11px] font-rubik text-black-100">Vacant & occupied</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push({ pathname: "/(root)/(tabs)/management", params: { section: "messages" } })} className="mb-3 w-[48%] rounded-[22px] bg-white p-4"><Users size={21} color="#2F6BFF" /><Text className="mt-3 font-rubik-bold text-black-300">Messages</Text><Text className="mt-1 text-[11px] font-rubik text-black-100">Tenant communication</Text></TouchableOpacity>
        </View>}
        <Text className="mb-3 mt-5 text-lg font-rubik-bold text-black-300">{owner ? "Property snapshot" : "Quick actions"}</Text>
        <View className="rounded-[24px] bg-white p-5">
          <View className="flex-row items-center"><View className="size-12 items-center justify-center rounded-2xl bg-primary-100"><Building2 size={24} color="#2F6BFF" /></View><View className="ml-3 flex-1"><Text className="font-rubik-bold text-black-300">Sunrise Apartments</Text><Text className="mt-1 text-xs font-rubik text-black-100">48 units • 43 occupied • Kilimani</Text></View><ChevronRight size={20} color="#98A2B3" /></View>
          <View className="mt-5 h-2 overflow-hidden rounded-full bg-primary-100"><View className="h-full w-[90%] rounded-full bg-[#23C483]" /></View>
          <Text className="mt-2 text-right text-xs font-rubik-semibold text-[#159B6C]">89.6% occupied</Text>
        </View>
      </ScrollView>
      <Modal transparent visible={notificationsOpen} animationType="slide" onRequestClose={() => setNotificationsOpen(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <ScrollView className="max-h-[84%] rounded-t-[30px] bg-white" contentContainerClassName="p-6 pb-10">
            <View className="flex-row items-center justify-between"><View><Text className="text-xl font-rubik-bold text-black-300">Notifications</Text><Text className="mt-1 text-sm font-rubik text-black-100">Owner portfolio activity</Text></View><TouchableOpacity onPress={() => setNotificationsOpen(false)} className="size-10 items-center justify-center rounded-full bg-primary-100"><Text className="text-xl font-rubik-semibold text-black-200">×</Text></TouchableOpacity></View>
            {[
              ["Rent collected", "Parkview Apartments · KSh 42,000 received", "#159B6C"],
              ["Rent overdue", "Brian Otieno has an overdue rent balance", "#E66B2E"],
              ["Major outstanding balance", "KSh 60,000 needs review across your portfolio", "#D94841"],
              ["New tenant", "Amina Hassan has completed move-in", "#2F6BFF"],
              ["Tenant leaving", "Move-out notice received for Suite 16", "#7A5AF8"],
              ["Lease expiring", "2 leases end in the next 30 days", "#E66B2E"],
              ["Maintenance request", "Water heater issue reported in Unit B-12", "#2F6BFF"],
              ["Maintenance approval", "A plumbing quote requires approval", "#7A5AF8"],
              ["Expense approval", "Security invoice of KSh 42,000 is pending", "#E66B2E"],
              ["Property issue", "Gate motor fault reported at Sunrise Apartments", "#D94841"],
              ["Agent activity", "Grace Wanjiku recorded a tenant payment", "#2F6BFF"],
              ["Owner payout", "September payout is ready for processing", "#159B6C"],
              ["Failed payment", "One M-Pesa rent payment was not completed", "#D94841"],
            ].map(([title, detail, color], index) => <View key={title} className="mt-3 flex-row rounded-[20px] bg-primary-100 p-4"><View className="mt-1 size-2 rounded-full" style={{ backgroundColor: color }} /><View className="ml-3 flex-1"><Text className="font-rubik-semibold text-black-300">{title}</Text><Text className="mt-1 text-xs leading-5 font-rubik text-black-100">{detail}</Text><Text className="mt-1 text-[10px] font-rubik text-black-100">{index < 2 ? "Today" : "This week"}</Text></View></View>)}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
