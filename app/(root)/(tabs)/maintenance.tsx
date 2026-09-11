import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { maintenanceRequests } from "@/constants/rental";
import { formatPrice } from "@/lib/format";
import { useGlobalContext } from "@/lib/global-provider";

const colors: Record<string, { bg: string; fg: string }> = {
  Submitted: { bg: "#FFF2EA", fg: "#E66B2E" },
  "In Progress": { bg: "#EEF4FF", fg: "#2F6BFF" },
  Completed: { bg: "#EAFBF4", fg: "#159B6C" },
};

export default function Maintenance() {
  const { user } = useGlobalContext();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const tenant = user?.role === "tenant";
  const owner = user?.role === "owner";

  const submit = () => {
    if (!title.trim() || !details.trim()) {
      Alert.alert("Add request details", "Enter a title and describe the problem.");
      return;
    }
    setShowForm(false);
    setTitle("");
    setDetails("");
    Alert.alert("Request submitted", "Management has been notified. You can track updates here.");
  };

  return (
    <SafeAreaView className="flex-1 bg-accent-100">
      <ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
        <View className="mt-4 flex-row items-center justify-between">
          <View><Text className="text-2xl font-rubik-bold text-black-300">Maintenance</Text><Text className="mt-1 text-sm font-rubik text-black-100">{tenant ? "Report and track issues" : owner ? "Review costs and approvals" : "Assign and manage work orders"}</Text></View>
          {tenant && <TouchableOpacity onPress={() => setShowForm(true)} className="size-12 items-center justify-center rounded-2xl bg-primary-300"><Ionicons name="add" size={26} color="#FFFFFF" /></TouchableOpacity>}
        </View>

        {!tenant && (
          <View className="mt-6 flex-row justify-between">
            <View className="w-[31%] rounded-[20px] bg-white p-3"><Text className="text-xs font-rubik text-black-100">New</Text><Text className="mt-2 text-xl font-rubik-bold text-black-300">3</Text></View>
            <View className="w-[31%] rounded-[20px] bg-white p-3"><Text className="text-xs font-rubik text-black-100">Active</Text><Text className="mt-2 text-xl font-rubik-bold text-primary-300">6</Text></View>
            <View className="w-[31%] rounded-[20px] bg-white p-3"><Text className="text-xs font-rubik text-black-100">Urgent</Text><Text className="mt-2 text-xl font-rubik-bold text-[#E66B2E]">1</Text></View>
          </View>
        )}

        <Text className="mb-3 mt-7 text-lg font-rubik-bold text-black-300">{tenant ? "My requests" : owner ? "Awaiting approval" : "Work queue"}</Text>
        {(tenant ? maintenanceRequests : [
          { id: "m-101", title: "Broken water heater • B-12", category: "Plumbing", date: "Today", status: "Submitted", priority: "High", update: owner ? "Quote requires your approval" : "Unassigned • Sunrise Apartments" },
          { id: "m-102", title: "Gate motor fault • Main gate", category: "Electrical", date: "Yesterday", status: "In Progress", priority: "Medium", update: "Assigned to Kamau Electricals" },
        ]).map((item) => {
          const palette = colors[item.status] || colors.Submitted;
          return (
            <View key={item.id} className="mb-3 rounded-[24px] bg-white p-4">
              <View className="flex-row items-start"><View className="size-11 items-center justify-center rounded-2xl bg-primary-100"><Ionicons name={item.category === "Plumbing" ? "water-outline" : "flash-outline"} size={22} color="#2F6BFF" /></View><View className="ml-3 flex-1"><View className="flex-row items-start justify-between"><Text className="flex-1 pr-2 font-rubik-semibold text-black-300">{item.title}</Text><View className="rounded-full px-2.5 py-1" style={{ backgroundColor: palette.bg }}><Text className="text-[10px] font-rubik-semibold" style={{ color: palette.fg }}>{item.status}</Text></View></View><Text className="mt-1 text-xs font-rubik text-black-100">{item.date} • {item.category} • {item.priority}</Text><Text className="mt-3 text-xs leading-5 font-rubik-medium text-black-200">{item.update}</Text></View></View>
              {owner && item.id === "m-101" && <View className="mt-4 border-t border-primary-100 pt-4"><View className="mb-3 flex-row justify-between"><Text className="text-sm font-rubik text-black-100">Estimated cost</Text><Text className="font-rubik-bold text-black-300">{formatPrice(18500)}</Text></View><View className="flex-row gap-3"><TouchableOpacity className="flex-1 items-center rounded-full border border-primary-200 py-3"><Text className="font-rubik-semibold text-black-200">Request quote</Text></TouchableOpacity><TouchableOpacity onPress={() => Alert.alert("Approved", "The agent can now proceed with this repair.")} className="flex-1 items-center rounded-full bg-[#23C483] py-3"><Text className="font-rubik-bold text-white">Approve</Text></TouchableOpacity></View></View>}
              {!tenant && !owner && item.id === "m-101" && <TouchableOpacity onPress={() => Alert.alert("Assign technician", "Technician assignment is ready for connection to your team directory.")} className="mt-4 items-center rounded-full bg-primary-300 py-3"><Text className="font-rubik-bold text-white">Review and assign</Text></TouchableOpacity>}
            </View>
          );
        })}
        {tenant && <TouchableOpacity onPress={() => setShowForm(true)} className="mt-3 h-14 flex-row items-center justify-center rounded-full border border-primary-300 bg-white"><Ionicons name="add-circle-outline" size={20} color="#2F6BFF" /><Text className="ml-2 font-rubik-bold text-primary-300">New maintenance request</Text></TouchableOpacity>}
      </ScrollView>

      <Modal visible={showForm} transparent animationType="slide" onRequestClose={() => setShowForm(false)}><View className="flex-1 justify-end bg-[#071F4A]/45"><View className="rounded-t-[34px] bg-white px-6 pb-9 pt-5">
        <View className="mb-5 h-1.5 w-12 self-center rounded-full bg-primary-200" /><View className="flex-row items-center justify-between"><Text className="text-2xl font-rubik-bold text-black-300">Report an issue</Text><TouchableOpacity onPress={() => setShowForm(false)} className="size-10 items-center justify-center rounded-full bg-primary-100"><Ionicons name="close" size={22} color="#17213C" /></TouchableOpacity></View>
        <Text className="mb-2 mt-6 text-sm font-rubik-semibold text-black-300">What needs attention?</Text><TextInput value={title} onChangeText={setTitle} placeholder="e.g. Kitchen tap leaking" placeholderTextColor="#98A2B3" className="h-14 rounded-2xl border border-primary-200 bg-accent-100 px-4 font-rubik text-black-300" />
        <Text className="mb-2 mt-4 text-sm font-rubik-semibold text-black-300">Describe the problem</Text><TextInput value={details} onChangeText={setDetails} multiline textAlignVertical="top" placeholder="Include where it is and when it started" placeholderTextColor="#98A2B3" className="h-28 rounded-2xl border border-primary-200 bg-accent-100 p-4 font-rubik text-black-300" />
        <TouchableOpacity className="mt-4 h-12 flex-row items-center justify-center rounded-2xl border border-dashed border-primary-300 bg-primary-100"><Ionicons name="camera-outline" size={20} color="#2F6BFF" /><Text className="ml-2 font-rubik-semibold text-primary-300">Add photos or video</Text></TouchableOpacity>
        <TouchableOpacity onPress={submit} className="mt-5 h-14 items-center justify-center rounded-full bg-primary-300"><Text className="font-rubik-bold text-white">Submit request</Text></TouchableOpacity>
      </View></View></Modal>
    </SafeAreaView>
  );
}

