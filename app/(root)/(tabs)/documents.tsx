import {
  ClipboardList,
  Download,
  FileText,
  LockKeyhole,
  ReceiptText,
} from "lucide-react-native";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { tenantDocuments, tenantHome } from "@/constants/rental";
import { useGlobalContext } from "@/lib/global-provider";

const ownerDocuments = [
  { id: "o1", title: "Property title & documentation", detail: "Portfolio ownership records", type: "Title", size: "4.2 MB" },
  { id: "o2", title: "Lease agreements", detail: "Active and archived lease files", type: "Lease", size: "8.6 MB" },
  { id: "o3", title: "Tenant documents", detail: "Applications and tenant records", type: "Tenant", size: "12.1 MB" },
  { id: "o4", title: "Inspection reports", detail: "Move-in, routine and move-out", type: "Inspection", size: "6.4 MB" },
  { id: "o5", title: "Maintenance invoices", detail: "Approved repairs and contractor bills", type: "Invoice", size: "3.8 MB" },
  { id: "o6", title: "Expense receipts", detail: "Property operating expenses", type: "Receipt", size: "2.9 MB" },
  { id: "o7", title: "Agent & contractor agreements", detail: "Service and management contracts", type: "Agreement", size: "5.1 MB" },
  { id: "o8", title: "Financial statements", detail: "Income, payouts and performance", type: "Statement", size: "7.5 MB" },
  { id: "o9", title: "Tax documents", detail: "Annual compliance records", type: "Tax", size: "2.3 MB" },
];

export default function Documents() {
  const { user } = useGlobalContext();
  const owner = user?.role === "owner";
  const documents = owner ? ownerDocuments : tenantDocuments;
  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
        <View className="mt-4"><Text className="text-2xl font-rubik-bold text-black-300">Documents</Text><Text className="mt-1 text-sm font-rubik text-black-100">{owner ? "Secure owner document vault" : "Your secure tenancy document vault"}</Text></View>
        <View className="mt-6 rounded-[26px] bg-[#102A55] p-5"><View className="flex-row items-center"><View className="size-12 items-center justify-center rounded-2xl bg-white/15"><FileText size={25} color="#FFFFFF" /></View><View className="ml-3 flex-1"><Text className="font-rubik-bold text-white">{owner ? "Owner document vault" : "Active lease"}</Text><Text className="mt-1 text-xs font-rubik text-white/65">{owner ? "Titles, agreements, statements and tax records" : `${tenantHome.unit} • Ends ${tenantHome.leaseEnds}`}</Text></View><View className="rounded-full bg-[#23C483]/20 px-3 py-1.5"><Text className="text-xs font-rubik-semibold text-[#75E0B8]">Secure</Text></View></View></View>
        <View className="mb-3 mt-7 flex-row justify-between"><Text className="text-lg font-rubik-bold text-black-300">All documents</Text><Text className="text-xs font-rubik text-black-100">{documents.length} files</Text></View>
        {documents.map((item) => (
          <View key={item.id} className="mb-3 flex-row items-center rounded-[22px] bg-white p-4"><View className="size-12 items-center justify-center rounded-2xl bg-primary-100">{item.type === "Receipt" ? <ReceiptText size={23} color="#2F6BFF" /> : item.type === "Inspection" ? <ClipboardList size={23} color="#2F6BFF" /> : <FileText size={23} color="#2F6BFF" />}</View><View className="ml-3 flex-1"><Text className="font-rubik-semibold text-black-300">{item.title}</Text><Text className="mt-1 text-xs font-rubik text-black-100">{item.detail} • {item.size}</Text></View><TouchableOpacity onPress={() => Alert.alert(item.title, "Document download and sharing will be enabled when the file is uploaded by management.")} className="size-10 items-center justify-center rounded-full bg-accent-100"><Download size={20} color="#2F6BFF" /></TouchableOpacity></View>
        ))}
        <View className="mt-4 flex-row rounded-[22px] bg-[#FFF7ED] p-4"><LockKeyhole size={20} color="#E66B2E" /><Text className="ml-3 flex-1 text-xs leading-5 font-rubik text-[#9A4B22]">Documents are private and only visible to you and authorized property management staff.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}
