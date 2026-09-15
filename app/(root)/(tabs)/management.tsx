import { useMemo, useState } from "react";
import { Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Building2, ChevronRight, CircleDollarSign, Download, FileText, ImagePlus, Mail, MessageCircle,
  Plus, Send, Users, WalletCards, X,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatPrice } from "@/lib/format";
import { useGlobalContext } from "@/lib/global-provider";
import { managedProperties } from "@/lib/managed-properties";

type AgentSection = "homes" | "tenants" | "messages" | "payouts" | "agents" | "approvals" | "reports";
type HomeStatus = "Occupied" | "Vacant";
type Approval = { id: string; category: string; title: string; amount?: number; detail: string };

const tenants = [
  { name: "Amina Hassan", unit: "A-204", home: "Parkview Apartments", rent: 42000, status: "Paid" },
  { name: "Brian Otieno", unit: "B-12", home: "Garden Villa", rent: 125000, status: "Overdue" },
  { name: "Wanjiku Njeri", unit: "C-08", home: "Riverside Retail Space", rent: 68000, status: "Partial" },
];

const initialHomes = managedProperties.map((home, index) => ({
  ...home,
  unit: ["A-204", "Villa 12", "Shop 08", "Suite 16"][index],
  status: (index === 2 ? "Vacant" : "Occupied") as HomeStatus,
}));

const initialApprovals: Approval[] = [
  { id: "a1", category: "Maintenance expense", title: "Plumbing repair · Unit A-204", amount: 18500, detail: "Quote from Kamau Plumbing" },
  { id: "a2", category: "Property expense", title: "Security invoice · Parkview", amount: 42000, detail: "September service invoice" },
  { id: "a3", category: "Refund", title: "Overpayment refund · Brian Otieno", amount: 6000, detail: "Payment reconciliation request" },
  { id: "a4", category: "Deposit refund", title: "Deposit refund · Suite 16", amount: 35000, detail: "Move-out inspection complete" },
  { id: "a5", category: "Rent change", title: "Rent revision · Garden Villa", amount: 125000, detail: "Proposed new monthly rent" },
  { id: "a6", category: "Tenant application", title: "New application · Unit C-08", detail: "Applicant documents are ready to review" },
  { id: "a7", category: "Lease renewal", title: "Lease renewal · Amina Hassan", detail: "Parkview Apartments · 12-month renewal" },
  { id: "a8", category: "Agent request", title: "Marketing budget · Grace Wanjiku", amount: 15000, detail: "Vacancy campaign for Riverside Retail" },
  { id: "a9", category: "Contractor quotation", title: "Gate motor repair quotation", amount: 62000, detail: "Mashauri Electricals · Main gate" },
];

const ownerAgents = [
  { id: "grace", name: "Grace Wanjiku", activeSince: "2025", properties: 4, units: 43, tenants: 43, collection: 96, occupancy: 94, rentManaged: 850000, rentCollected: 790000, commission: 35000, bonuses: 5000, outstanding: 60000 },
  { id: "john", name: "John Mwangi", activeSince: "2024", properties: 2, units: 28, tenants: 26, collection: 92, occupancy: 93, rentManaged: 620000, rentCollected: 570000, commission: 28000, bonuses: 0, outstanding: 50000 },
  { id: "mary", name: "Mary Achieng", activeSince: "2025", properties: 2, units: 19, tenants: 17, collection: 89, occupancy: 89, rentManaged: 440000, rentCollected: 391000, commission: 22000, bonuses: 2500, outstanding: 49000 },
];

const Chip = ({ selected, label, onPress }: { selected: boolean; label: string; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} className={`mr-2 rounded-full px-4 py-2.5 ${selected ? "bg-primary-300" : "bg-white"}`}>
    <Text className={`text-xs font-rubik-semibold ${selected ? "text-white" : "text-black-200"}`}>{label}</Text>
  </TouchableOpacity>
);

const Status = ({ value }: { value: string }) => {
  const vacant = value === "Vacant";
  const overdue = value === "Overdue";
  return <View className={`rounded-full px-3 py-1.5 ${vacant || overdue ? "bg-[#FFF0EE]" : "bg-[#EAFBF4]"}`}><Text className={`text-[11px] font-rubik-semibold ${vacant || overdue ? "text-[#D94841]" : "text-[#159B6C]"}`}>{value}</Text></View>;
};

export default function Management() {
  const { user } = useGlobalContext();
  const { section } = useLocalSearchParams<{ section?: AgentSection }>();
  const owner = user?.role === "owner";
  const [active, setActive] = useState<AgentSection>(section || "homes");
  const [filter, setFilter] = useState<"All" | HomeStatus>("All");
  const [homes, setHomes] = useState(initialHomes);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [selectedOwnerAgent, setSelectedOwnerAgent] = useState<(typeof ownerAgents)[number] | null>(null);
  const [listingOpen, setListingOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [listingName, setListingName] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [listingDescription, setListingDescription] = useState("");
  const [listingImage, setListingImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [payoutPhone, setPayoutPhone] = useState("+254 712 000 456");

  const visibleHomes = useMemo(() => filter === "All" ? homes : homes.filter((home) => home.status === filter), [filter, homes]);
  const vacancyCount = homes.filter((home) => home.status === "Vacant").length;
  const occupiedCount = homes.length - vacancyCount;

  const chooseListingImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [4, 3], quality: 0.75 });
    if (!result.canceled) setListingImage(result.assets[0].uri);
  };

  const saveListing = () => {
    if (!listingName.trim() || !listingPrice.trim()) return;
    const template = managedProperties[0];
    setHomes((current) => [{
      ...template,
      $id: `agent-${Date.now()}`,
      name: listingName.trim(),
      price: Number(listingPrice.replace(/[^0-9]/g, "")) || 0,
      description: listingDescription.trim() || template.description,
      image: listingImage || template.image,
      unit: "New unit",
      status: "Vacant",
    }, ...current]);
    setListingName(""); setListingPrice(""); setListingDescription(""); setListingImage(null); setListingOpen(false);
  };

  if (owner) {
    const ownerView = active;
    return <SafeAreaView className="flex-1 bg-transparent"><ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
      <Text className="mt-5 text-2xl font-rubik-bold text-black-300">Owner portfolio</Text><Text className="mt-1 font-rubik text-black-100">Investment performance and approvals</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6">{([{ key: "homes", label: "Properties" }, { key: "agents", label: "Agents" }, { key: "approvals", label: "Approvals" }, { key: "payouts", label: "Payouts" }, { key: "reports", label: "Reports" }] as const).map((item) => <Chip key={item.key} label={item.label} selected={ownerView === item.key} onPress={() => setActive(item.key)} />)}</ScrollView>
      {ownerView === "homes" && <>{homes.map((home, index) => <View key={home.$id} className="mt-4 overflow-hidden rounded-[24px] bg-white"><Image source={{ uri: home.image }} className="h-28 w-full" /><View className="p-4"><View className="flex-row items-center justify-between"><Text className="font-rubik-bold text-black-300">{home.name}</Text><Text className="font-rubik-semibold text-[#159B6C]">{index === 2 ? "72%" : "92%"} occupied</Text></View><Text className="mt-1 text-xs font-rubik text-black-100">{home.address} · {index === 2 ? "1 vacant" : "All units active"}</Text><View className="mt-4 flex-row justify-between border-t border-primary-100 pt-3"><Text className="text-xs font-rubik text-black-100">Expected monthly</Text><Text className="font-rubik-bold text-primary-300">{formatPrice(home.price * (index + 12))}</Text></View></View></View>)}</>}
      {ownerView === "agents" && <><Text className="mt-6 text-lg font-rubik-bold text-black-300">Assigned agents</Text>{ownerAgents.map((agent) => <TouchableOpacity key={agent.id} onPress={() => setSelectedOwnerAgent(agent)} className="mt-3 rounded-[22px] bg-white p-4"><View className="flex-row items-center"><View className="size-11 items-center justify-center rounded-full bg-[#102A55]"><Text className="font-rubik-bold text-white">{agent.name[0]}</Text></View><View className="ml-3 flex-1"><Text className="font-rubik-bold text-black-300">{agent.name}</Text><Text className="mt-1 text-xs font-rubik text-black-100">{agent.properties} properties · {agent.units} units</Text></View><Status value="Active" /></View><View className="mt-4 flex-row justify-between border-t border-primary-100 pt-3"><Text className="text-xs font-rubik text-black-100">Collection rate</Text><View className="flex-row items-center"><Text className="mr-2 font-rubik-bold text-[#159B6C]">{agent.collection}%</Text><ChevronRight size={17} color="#98A2B3" /></View></View></TouchableOpacity>)}</>}
      {ownerView === "approvals" && <><View className="mt-6 rounded-[26px] bg-[#102A55] p-5"><Text className="text-xs font-rubik text-white/65">PENDING APPROVALS</Text><Text className="mt-2 text-3xl font-rubik-bold text-white">{approvals.length}</Text><Text className="mt-1 text-xs font-rubik text-white/65">Expenses, leases, tenant and agent decisions</Text></View><Text className="mt-6 text-lg font-rubik-bold text-black-300">Approval centre</Text>{approvals.map((approval) => <View key={approval.id} className="mt-3 rounded-[22px] bg-white p-4"><View className="flex-row items-start justify-between"><View className="flex-1 pr-3"><Text className="text-[11px] font-rubik-semibold text-primary-300">{approval.category.toUpperCase()}</Text><Text className="mt-1 font-rubik-bold text-black-300">{approval.title}</Text><Text className="mt-1 text-xs leading-5 font-rubik text-black-100">{approval.detail}</Text></View><Status value="Pending" /></View>{approval.amount !== undefined && <Text className="mt-3 text-lg font-rubik-bold text-black-300">{formatPrice(approval.amount)}</Text>}<View className="mt-4 flex-row gap-2"><TouchableOpacity onPress={() => { setApprovals((items) => items.filter((item) => item.id !== approval.id)); Alert.alert("Approval rejected", `${approval.title} has been rejected.`); }} className="flex-1 items-center rounded-full border border-[#F5C9C5] py-3"><Text className="text-xs font-rubik-semibold text-[#D94841]">Reject</Text></TouchableOpacity><TouchableOpacity onPress={() => Alert.alert("Quote requested", "The assigned agent and contractor have been asked for a revised quotation.")} className="flex-1 items-center rounded-full border border-primary-200 py-3"><Text className="text-xs font-rubik-semibold text-black-200">Request quote</Text></TouchableOpacity><TouchableOpacity onPress={() => { setApprovals((items) => items.filter((item) => item.id !== approval.id)); Alert.alert("Approved", `${approval.title} has been approved.`); }} className="flex-1 items-center rounded-full bg-[#23C483] py-3"><Text className="text-xs font-rubik-bold text-white">Approve</Text></TouchableOpacity></View></View>)}{approvals.length === 0 && <View className="mt-5 items-center rounded-[24px] bg-white p-7"><Text className="font-rubik-bold text-black-300">All caught up</Text><Text className="mt-1 text-center text-sm font-rubik text-black-100">There are no owner approvals waiting for review.</Text></View>}</>}
      {ownerView === "payouts" && <><View className="mt-6 rounded-[26px] bg-[#102A55] p-5"><Text className="text-xs font-rubik text-white/65">NEXT OWNER PAYOUT</Text><Text className="mt-2 text-3xl font-rubik-bold text-white">{formatPrice(670000)}</Text><Text className="mt-2 text-xs font-rubik text-white/65">After expenses and agent commissions</Text></View><Text className="mt-6 text-lg font-rubik-bold text-black-300">Payout history</Text>{["05 Sep 2026", "05 Aug 2026", "05 Jul 2026"].map((date, index) => <View key={date} className="mt-3 flex-row items-center rounded-[22px] bg-white p-4"><CircleDollarSign size={22} color="#2F6BFF" /><View className="ml-3 flex-1"><Text className="font-rubik-bold text-black-300">Owner payout</Text><Text className="mt-1 text-xs font-rubik text-black-100">{date} · M-Pesa · Paid</Text></View><Text className="font-rubik-bold text-[#159B6C]">{formatPrice(620000 - index * 18000)}</Text></View>)}</>}
      {ownerView === "reports" && <><View className="mt-6 rounded-[26px] bg-[#102A55] p-5"><Text className="text-xs font-rubik text-white/65">OWNER REPORTING CENTRE</Text><Text className="mt-2 text-2xl font-rubik-bold text-white">Portfolio reports</Text><Text className="mt-2 text-xs leading-5 font-rubik text-white/65">Choose a report, then export it for your accountant, agent, or records.</Text></View>{[
        { title: "Financial reports", reports: ["Monthly income", "Annual income", "Expense report", "Net income", "Profit / loss", "Rent collection", "Outstanding rent", "Owner statement", "Payout report"] },
        { title: "Property reports", reports: ["Occupancy", "Vacancy", "Property performance", "Unit performance", "Tenant turnover"] },
        { title: "Agent reports", reports: ["Agent performance", "Collection performance", "Agent commissions", "Maintenance performance"] },
        { title: "Tenant reports", reports: ["Tenant payment history", "Outstanding balances", "Lease expiry", "Tenant turnover"] },
      ].map((group) => <View key={group.title} className="mt-5 rounded-[24px] bg-white p-4"><View className="flex-row items-center"><View className="size-10 items-center justify-center rounded-2xl bg-primary-100"><FileText size={20} color="#2F6BFF" /></View><Text className="ml-3 font-rubik-bold text-black-300">{group.title}</Text></View><View className="mt-4 flex-row flex-wrap gap-2">{group.reports.map((report) => <TouchableOpacity key={report} onPress={() => Alert.alert(report, "Choose PDF, Excel, or CSV to export this report.", [{ text: "PDF", onPress: () => Alert.alert("Export ready", `${report} will be prepared as a PDF.`) }, { text: "Excel", onPress: () => Alert.alert("Export ready", `${report} will be prepared as an Excel file.`) }, { text: "CSV", onPress: () => Alert.alert("Export ready", `${report} will be prepared as a CSV file.`) }, { text: "Cancel", style: "cancel" }])} className="flex-row items-center rounded-full bg-primary-100 px-3 py-2"><Download size={13} color="#2F6BFF" /><Text className="ml-1 text-xs font-rubik-medium text-primary-300">{report}</Text></TouchableOpacity>)}</View></View>)}</>}
    </ScrollView><Modal transparent visible={Boolean(selectedOwnerAgent)} animationType="slide" onRequestClose={() => setSelectedOwnerAgent(null)}><View className="flex-1 justify-end bg-black/40"><ScrollView className="max-h-[88%] rounded-t-[30px] bg-white" contentContainerClassName="p-6 pb-10">{selectedOwnerAgent && <><View className="flex-row items-start justify-between"><View><Text className="text-2xl font-rubik-bold text-black-300">{selectedOwnerAgent.name}</Text><Text className="mt-1 text-sm font-rubik text-[#159B6C]">Active since {selectedOwnerAgent.activeSince}</Text></View><TouchableOpacity onPress={() => setSelectedOwnerAgent(null)} className="size-10 items-center justify-center rounded-full bg-primary-100"><X size={20} color="#17213C" /></TouchableOpacity></View><Text className="mt-6 text-lg font-rubik-bold text-black-300">Agent overview</Text><View className="mt-3 flex-row flex-wrap justify-between">{[["Properties", selectedOwnerAgent.properties], ["Units", selectedOwnerAgent.units], ["Tenants", selectedOwnerAgent.tenants], ["Occupancy", `${selectedOwnerAgent.occupancy}%`], ["Collection", `${selectedOwnerAgent.collection}%`]].map(([label, value]) => <View key={label as string} className="mb-2 w-[48%] rounded-2xl bg-primary-100 p-3"><Text className="text-[11px] font-rubik text-black-100">{label}</Text><Text className="mt-1 font-rubik-bold text-black-300">{value}</Text></View>)}</View><Text className="mt-5 text-lg font-rubik-bold text-black-300">Assigned properties</Text>{homes.slice(0, selectedOwnerAgent.properties > 2 ? 3 : 2).map((home) => <View key={home.$id} className="mt-2 rounded-2xl bg-primary-100 p-3"><Text className="font-rubik-semibold text-black-300">{home.name}</Text><Text className="mt-1 text-xs font-rubik text-black-100">{home.unit} · {home.address}</Text></View>)}<Text className="mt-5 text-lg font-rubik-bold text-black-300">Assigned tenants</Text>{tenants.slice(0, 2).map((tenant) => <View key={tenant.unit} className="mt-2 flex-row justify-between rounded-2xl bg-primary-100 p-3"><View><Text className="font-rubik-semibold text-black-300">{tenant.name}</Text><Text className="mt-1 text-xs font-rubik text-black-100">{tenant.home} · {tenant.unit}</Text></View><Status value={tenant.status} /></View>)}<Text className="mt-5 text-lg font-rubik-bold text-black-300">Agent financials</Text><View className="mt-3 rounded-[22px] bg-[#102A55] p-4">{[["Rent managed", selectedOwnerAgent.rentManaged], ["Rent collected", selectedOwnerAgent.rentCollected], ["Commission", selectedOwnerAgent.commission], ["Bonuses", selectedOwnerAgent.bonuses], ["Outstanding rent", selectedOwnerAgent.outstanding]].map(([label, value]) => <View key={label as string} className="mb-2 flex-row justify-between"><Text className="text-xs font-rubik text-white/65">{label}</Text><Text className="font-rubik-semibold text-white">{formatPrice(value as number)}</Text></View>)}</View><Text className="mt-5 text-lg font-rubik-bold text-black-300">Activity audit trail</Text>{["Tenant added · Parkview Apartments", "Payment recorded · KSh 42,000", "Maintenance approved · Unit A-204", "Notice sent · Rent reminder", "Inspection completed · Garden Villa", "Lease updated · 12-month renewal"].map((activity, index) => <View key={activity} className="mt-2 flex-row items-center"><View className="size-7 items-center justify-center rounded-full bg-[#EAFBF4]"><Text className="text-[10px] font-rubik-bold text-[#159B6C]">{index + 1}</Text></View><Text className="ml-3 flex-1 text-sm font-rubik text-black-200">{activity}</Text></View>)}</>}</ScrollView></View></Modal></SafeAreaView>;
  }

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
        <View className="mt-4 flex-row items-center justify-between"><View><Text className="text-2xl font-rubik-bold text-black-300">Agent workspace</Text><Text className="mt-1 text-sm font-rubik text-black-100">Manage homes, tenants and collections</Text></View><TouchableOpacity onPress={() => router.push("/(root)/(tabs)/profile")} className="size-11 items-center justify-center rounded-full bg-white"><Users size={21} color="#2F6BFF" /></TouchableOpacity></View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6">
          {([{ key: "homes", label: "Homes", icon: Building2 }, { key: "tenants", label: "Tenants", icon: Users }, { key: "messages", label: "Messages", icon: MessageCircle }, { key: "payouts", label: "Payouts", icon: WalletCards }] as const).map(({ key, label, icon: Icon }) => <TouchableOpacity key={key} onPress={() => setActive(key)} className={`mr-2 flex-row items-center rounded-2xl px-4 py-3 ${active === key ? "bg-primary-300" : "bg-white"}`}><Icon size={17} color={active === key ? "#FFFFFF" : "#667085"} /><Text className={`ml-2 text-sm font-rubik-semibold ${active === key ? "text-white" : "text-black-200"}`}>{label}</Text></TouchableOpacity>)}
        </ScrollView>

        {active === "homes" && <>
          <View className="mt-6 rounded-[26px] bg-[#102A55] p-5"><View className="flex-row items-center justify-between"><View><Text className="text-xs font-rubik text-white/65">PORTFOLIO OCCUPANCY</Text><Text className="mt-2 text-3xl font-rubik-bold text-white">{occupiedCount}/{homes.length}</Text><Text className="mt-1 text-xs font-rubik text-white/65">homes currently occupied</Text></View><TouchableOpacity onPress={() => setListingOpen(true)} className="size-12 items-center justify-center rounded-2xl bg-white"><Plus size={25} color="#2F6BFF" /></TouchableOpacity></View><View className="mt-5 h-2 overflow-hidden rounded-full bg-white/20"><View className="h-full rounded-full bg-[#25D991]" style={{ width: `${(occupiedCount / homes.length) * 100}%` }} /></View></View>
          <View className="mt-6 flex-row items-center justify-between"><Text className="text-lg font-rubik-bold text-black-300">Managed homes</Text><TouchableOpacity onPress={() => setListingOpen(true)}><Text className="font-rubik-semibold text-primary-300">Add listing</Text></TouchableOpacity></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4"><Chip label="All" selected={filter === "All"} onPress={() => setFilter("All")} /><Chip label={`Occupied (${occupiedCount})`} selected={filter === "Occupied"} onPress={() => setFilter("Occupied")} /><Chip label={`Vacant (${vacancyCount})`} selected={filter === "Vacant"} onPress={() => setFilter("Vacant")} /></ScrollView>
          {visibleHomes.map((home) => <TouchableOpacity key={home.$id} onPress={() => setHomes((current) => current.map((item) => item.$id === home.$id ? { ...item, status: item.status === "Vacant" ? "Occupied" : "Vacant" } : item))} className="mt-4 overflow-hidden rounded-[24px] bg-white"><Image source={{ uri: home.image }} className="h-36 w-full" /><View className="p-4"><View className="flex-row items-start"><View className="flex-1"><Text className="font-rubik-bold text-black-300">{home.name}</Text><Text className="mt-1 text-xs font-rubik text-black-100">{home.unit} · {home.address}</Text></View><Status value={home.status} /></View><View className="mt-4 flex-row items-center justify-between border-t border-primary-100 pt-3"><Text className="font-rubik-bold text-primary-300">{formatPrice(home.price)}/mo</Text><Text className="text-xs font-rubik-medium text-black-100">Tap to mark {home.status === "Vacant" ? "occupied" : "vacant"}</Text></View></View></TouchableOpacity>)}
        </>}

        {active === "tenants" && <><Text className="mt-7 text-lg font-rubik-bold text-black-300">Tenant accounts</Text>{tenants.map((tenant) => <TouchableOpacity key={tenant.unit} className="mt-3 rounded-[24px] bg-white p-4"><View className="flex-row items-center"><View className="size-11 items-center justify-center rounded-full bg-primary-100"><Text className="font-rubik-bold text-primary-300">{tenant.name.charAt(0)}</Text></View><View className="ml-3 flex-1"><Text className="font-rubik-bold text-black-300">{tenant.name}</Text><Text className="mt-1 text-xs font-rubik text-black-100">{tenant.unit} · {tenant.home}</Text></View><Status value={tenant.status} /></View><View className="mt-4 flex-row items-center justify-between border-t border-primary-100 pt-3"><Text className="font-rubik-semibold text-black-300">{formatPrice(tenant.rent)}/mo</Text><TouchableOpacity onPress={() => setMessageOpen(true)} className="flex-row items-center"><Mail size={16} color="#2F6BFF" /><Text className="ml-1 text-xs font-rubik-semibold text-primary-300">Message</Text></TouchableOpacity></View></TouchableOpacity>)}</>}

        {active === "messages" && <><View className="mt-7 flex-row items-center justify-between"><Text className="text-lg font-rubik-bold text-black-300">Tenant communication</Text><TouchableOpacity onPress={() => setMessageOpen(true)} className="size-10 items-center justify-center rounded-xl bg-primary-300"><Plus size={21} color="#FFFFFF" /></TouchableOpacity></View>{[{ name: "Amina Hassan", text: "Thank you, I received the payment reminder.", time: "10:24 AM" }, { name: "Brian Otieno", text: "Could we arrange a maintenance visit?", time: "Yesterday" }].map((thread) => <TouchableOpacity key={thread.name} onPress={() => setMessageOpen(true)} className="mt-3 flex-row items-center rounded-[22px] bg-white p-4"><View className="size-11 items-center justify-center rounded-full bg-[#102A55]"><Text className="font-rubik-bold text-white">{thread.name[0]}</Text></View><View className="ml-3 flex-1"><Text className="font-rubik-bold text-black-300">{thread.name}</Text><Text numberOfLines={1} className="mt-1 text-xs font-rubik text-black-100">{thread.text}</Text></View><Text className="text-[10px] font-rubik text-black-100">{thread.time}</Text></TouchableOpacity>)}</>}

        {active === "payouts" && <><View className="mt-7 rounded-[28px] bg-[#102A55] p-5"><Text className="text-xs font-rubik text-white/65">AVAILABLE TO WITHDRAW</Text><Text className="mt-2 text-3xl font-rubik-bold text-white">{formatPrice(186400)}</Text><TouchableOpacity className="mt-5 h-12 items-center justify-center rounded-full bg-[#25D991]"><Text className="font-rubik-bold text-[#102A55]">Withdraw to M-Pesa</Text></TouchableOpacity></View><Text className="mt-7 text-lg font-rubik-bold text-black-300">Collection trend</Text><View className="mt-4 h-36 flex-row items-end justify-between rounded-[24px] bg-white px-5 pb-5 pt-4">{[48, 76, 62, 92, 70, 84].map((height, index) => <View key={index} className="items-center"><View className="w-7 rounded-t-lg bg-primary-300" style={{ height }} /><Text className="mt-2 text-[10px] font-rubik text-black-100">W{index + 1}</Text></View>)}</View><TouchableOpacity onPress={() => setPayoutOpen(true)} className="mt-5 rounded-[24px] bg-white p-5"><View className="flex-row items-center"><CircleDollarSign size={22} color="#2F6BFF" /><View className="ml-3 flex-1"><Text className="font-rubik-bold text-black-300">Withdrawal account</Text><Text className="mt-1 text-xs font-rubik text-black-100">M-Pesa · {payoutPhone}</Text></View><ChevronRight size={20} color="#98A2B3" /></View></TouchableOpacity></>}
      </ScrollView>

      <Modal transparent visible={listingOpen} animationType="slide" onRequestClose={() => setListingOpen(false)}><View className="flex-1 justify-end bg-black/40"><View className="rounded-t-[30px] bg-white p-6"><View className="flex-row items-center justify-between"><Text className="text-xl font-rubik-bold text-black-300">Add managed home</Text><TouchableOpacity onPress={() => setListingOpen(false)}><X size={23} color="#667085" /></TouchableOpacity></View><TouchableOpacity onPress={chooseListingImage} className="mt-5 h-28 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-primary-300 bg-primary-100">{listingImage ? <Image source={{ uri: listingImage }} className="size-full" /> : <><ImagePlus size={25} color="#2F6BFF" /><Text className="mt-2 font-rubik-medium text-primary-300">Upload house image</Text></>}</TouchableOpacity><TextInput value={listingName} onChangeText={setListingName} placeholder="Property name" className="mt-4 h-14 rounded-2xl border border-primary-200 px-4 font-rubik" /><TextInput value={listingPrice} onChangeText={setListingPrice} keyboardType="numeric" placeholder="Monthly rent (KSh)" className="mt-3 h-14 rounded-2xl border border-primary-200 px-4 font-rubik" /><TextInput value={listingDescription} onChangeText={setListingDescription} multiline placeholder="Property description and amenities" className="mt-3 h-20 rounded-2xl border border-primary-200 p-4 font-rubik" /><TouchableOpacity onPress={saveListing} className="mt-5 h-14 items-center justify-center rounded-full bg-primary-300"><Text className="font-rubik-bold text-white">Save listing</Text></TouchableOpacity></View></View></Modal>
      <Modal transparent visible={messageOpen} animationType="slide" onRequestClose={() => setMessageOpen(false)}><View className="flex-1 justify-end bg-black/40"><View className="rounded-t-[30px] bg-white p-6"><Text className="text-xl font-rubik-bold text-black-300">New tenant message</Text><Text className="mt-1 text-sm font-rubik text-black-100">Send an update, reminder, or response.</Text><TextInput value={message} onChangeText={setMessage} multiline placeholder="Write your message" className="mt-5 h-28 rounded-2xl border border-primary-200 p-4 font-rubik" /><TouchableOpacity onPress={() => { setMessage(""); setMessageOpen(false); }} className="mt-5 h-14 flex-row items-center justify-center rounded-full bg-primary-300"><Send size={18} color="#FFFFFF" /><Text className="ml-2 font-rubik-bold text-white">Send message</Text></TouchableOpacity></View></View></Modal>
      <Modal transparent visible={payoutOpen} animationType="slide" onRequestClose={() => setPayoutOpen(false)}><View className="flex-1 justify-end bg-black/40"><View className="rounded-t-[30px] bg-white p-6"><Text className="text-xl font-rubik-bold text-black-300">Withdrawal account</Text><Text className="mt-1 text-sm font-rubik text-black-100">Use the M-Pesa number that receives agent payouts.</Text><TextInput value={payoutPhone} onChangeText={setPayoutPhone} keyboardType="phone-pad" placeholder="M-Pesa phone number" className="mt-5 h-14 rounded-2xl border border-primary-200 px-4 font-rubik" /><TouchableOpacity onPress={() => setPayoutOpen(false)} className="mt-5 h-14 items-center justify-center rounded-full bg-primary-300"><Text className="font-rubik-bold text-white">Save withdrawal account</Text></TouchableOpacity></View></View></Modal>
    </SafeAreaView>
  );
}
