import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Bell, Building2, CheckCircle2, ClipboardList, MapPin, Wrench } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { getCaretakerTasks } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";

const TaskStatus = ({ value }: { value?: string }) => {
  const normalized = (value || "assigned").replace(/_/g, " ");
  const complete = ["completed", "closed"].includes((value || "").toLowerCase());
  return <View className={`rounded-full px-3 py-1.5 ${complete ? "bg-[#EAFBF4]" : "bg-[#EEF4FF]"}`}><Text className={`text-[11px] font-rubik-semibold capitalize ${complete ? "text-[#159B6C]" : "text-primary-300"}`}>{normalized}</Text></View>;
};

export default function CaretakerDashboard() {
  const { user } = useGlobalContext();
  const { data: tasks, loading, refetch } = useAppwrite({
    fn: getCaretakerTasks,
    params: { caretakerId: user?.$id ?? "" },
    skip: !user?.$id,
  });

  const activeTasks = tasks?.filter((task) => !["completed", "closed"].includes(String(task.status).toLowerCase())) ?? [];

  return <SafeAreaView className="flex-1 bg-transparent"><ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
    <View className="mt-4 flex-row items-center justify-between"><View><Text className="text-2xl font-rubik-bold text-black-300">My workspace</Text><Text className="mt-1 text-sm font-rubik text-black-100">Assigned onsite work and inspections</Text></View><TouchableOpacity className="size-11 items-center justify-center rounded-full bg-white" accessibilityLabel="Notifications"><Bell size={21} color="#17213C" /></TouchableOpacity></View>
    <View className="mt-6 rounded-[26px] bg-[#102A55] p-5"><View className="flex-row items-center"><View className="size-12 items-center justify-center rounded-2xl bg-white/15"><ClipboardList size={25} color="#FFFFFF" /></View><View className="ml-3 flex-1"><Text className="font-rubik-bold text-white">Today’s workspace</Text><Text className="mt-1 text-xs font-rubik text-white/65">Tasks are assigned by your property agent.</Text></View></View><View className="mt-5 flex-row"><View className="flex-1"><Text className="text-xs font-rubik text-white/60">Active tasks</Text><Text className="mt-1 text-2xl font-rubik-bold text-white">{activeTasks.length}</Text></View><View className="flex-1"><Text className="text-xs font-rubik text-white/60">All assigned</Text><Text className="mt-1 text-2xl font-rubik-bold text-white">{tasks?.length ?? 0}</Text></View></View></View>
    <View className="mt-7 flex-row items-center justify-between"><Text className="text-lg font-rubik-bold text-black-300">My tasks</Text><TouchableOpacity onPress={() => refetch()}><Text className="font-rubik-semibold text-primary-300">Refresh</Text></TouchableOpacity></View>
    {loading ? <ActivityIndicator className="mt-8" color="#2F6BFF" /> : tasks?.length ? tasks.map((task) => <TouchableOpacity key={task.$id} onPress={() => router.push("/(root)/(tabs)/maintenance")} className="mt-3 rounded-[24px] bg-white p-4"><View className="flex-row items-start"><View className="size-11 items-center justify-center rounded-2xl bg-primary-100"><Wrench size={21} color="#2F6BFF" /></View><View className="ml-3 flex-1"><View className="flex-row items-start justify-between"><Text className="flex-1 pr-2 font-rubik-bold text-black-300">{String(task.title || "Assigned property task")}</Text><TaskStatus value={String(task.status || "assigned")} /></View><Text className="mt-1 text-xs font-rubik text-black-100">{String(task.property_name || "Assigned property")} · {String(task.unit || "Common area")}</Text><Text className="mt-3 text-xs font-rubik text-black-200">Due {String(task.due_date || "date not set")}</Text></View></View></TouchableOpacity>) : <View className="mt-4 items-center rounded-[24px] bg-white p-7"><CheckCircle2 size={32} color="#159B6C" /><Text className="mt-3 font-rubik-bold text-black-300">No tasks assigned</Text><Text className="mt-1 text-center text-sm leading-5 font-rubik text-black-100">Your agent will assign inspections, maintenance visits, and property tasks here.</Text></View>}
    <Text className="mt-7 text-lg font-rubik-bold text-black-300">Quick access</Text><View className="mt-3 flex-row justify-between"><TouchableOpacity onPress={() => router.push("/(root)/(tabs)/maintenance")} className="w-[48%] rounded-[22px] bg-white p-4"><Wrench size={21} color="#2F6BFF" /><Text className="mt-3 font-rubik-bold text-black-300">Maintenance</Text><Text className="mt-1 text-[11px] font-rubik text-black-100">Inspect and update work</Text></TouchableOpacity><TouchableOpacity onPress={() => router.push("/(root)/(tabs)/management")} className="w-[48%] rounded-[22px] bg-white p-4"><Building2 size={21} color="#2F6BFF" /><Text className="mt-3 font-rubik-bold text-black-300">My properties</Text><Text className="mt-1 text-[11px] font-rubik text-black-100">Buildings and units</Text></TouchableOpacity></View><View className="mt-4 flex-row items-start rounded-[20px] bg-primary-100 p-4"><MapPin size={19} color="#2F6BFF" /><Text className="ml-3 flex-1 text-xs leading-5 font-rubik text-black-200">Caretakers only see assigned property operations. Rent, tenant balances, and owner financial data stay protected.</Text></View>
  </ScrollView></SafeAreaView>;
}
