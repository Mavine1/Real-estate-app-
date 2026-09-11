import { Ionicons } from "@expo/vector-icons";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { tenantDocuments, tenantHome } from "@/constants/rental";

export default function Documents() {
  return (
    <SafeAreaView className="flex-1 bg-accent-100">
      <ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
        <View className="mt-4"><Text className="text-2xl font-rubik-bold text-black-300">Documents</Text><Text className="mt-1 text-sm font-rubik text-black-100">Your secure tenancy document vault</Text></View>
        <View className="mt-6 rounded-[26px] bg-[#102A55] p-5"><View className="flex-row items-center"><View className="size-12 items-center justify-center rounded-2xl bg-white/15"><Ionicons name="document-text-outline" size={25} color="#FFFFFF" /></View><View className="ml-3 flex-1"><Text className="font-rubik-bold text-white">Active lease</Text><Text className="mt-1 text-xs font-rubik text-white/65">{tenantHome.unit} • Ends {tenantHome.leaseEnds}</Text></View><View className="rounded-full bg-[#23C483]/20 px-3 py-1.5"><Text className="text-xs font-rubik-semibold text-[#75E0B8]">Active</Text></View></View></View>
        <View className="mb-3 mt-7 flex-row justify-between"><Text className="text-lg font-rubik-bold text-black-300">All documents</Text><Text className="text-xs font-rubik text-black-100">{tenantDocuments.length} files</Text></View>
        {tenantDocuments.map((item) => (
          <View key={item.id} className="mb-3 flex-row items-center rounded-[22px] bg-white p-4"><View className="size-12 items-center justify-center rounded-2xl bg-primary-100"><Ionicons name={item.type === "Receipt" ? "receipt-outline" : item.type === "Inspection" ? "clipboard-outline" : "document-text-outline"} size={23} color="#2F6BFF" /></View><View className="ml-3 flex-1"><Text className="font-rubik-semibold text-black-300">{item.title}</Text><Text className="mt-1 text-xs font-rubik text-black-100">{item.detail} • {item.size}</Text></View><TouchableOpacity onPress={() => Alert.alert(item.title, "Document download and sharing will be enabled when the file is uploaded by management.")} className="size-10 items-center justify-center rounded-full bg-accent-100"><Ionicons name="download-outline" size={20} color="#2F6BFF" /></TouchableOpacity></View>
        ))}
        <View className="mt-4 flex-row rounded-[22px] bg-[#FFF7ED] p-4"><Ionicons name="lock-closed-outline" size={20} color="#E66B2E" /><Text className="ml-3 flex-1 text-xs leading-5 font-rubik text-[#9A4B22]">Documents are private and only visible to you and authorized property management staff.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

