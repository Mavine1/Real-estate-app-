import { Building2, ChevronRight, Plus, Search } from "lucide-react-native";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatPrice } from "@/lib/format";
import { useGlobalContext } from "@/lib/global-provider";

const tenants = [
  { name: "Amina Hassan", unit: "A-204", property: "Sunrise Apartments", rent: 25000, status: "Paid", lease: "31 Aug 2027" },
  { name: "Brian Otieno", unit: "B-12", property: "Sunrise Apartments", rent: 32000, status: "Overdue", lease: "30 Nov 2026" },
  { name: "Wanjiku Njeri", unit: "C-08", property: "Westview Court", rent: 45000, status: "Partial", lease: "15 Oct 2026" },
  { name: "David Mutua", unit: "D-03", property: "Green Park Homes", rent: 28000, status: "Paid", lease: "31 Mar 2027" },
];

const properties = [
  { name: "Sunrise Apartments", location: "Kilimani", units: 48, occupied: 43, income: 1200000, outstanding: 75000 },
  { name: "Westview Court", location: "Westlands", units: 24, occupied: 22, income: 980000, outstanding: 45000 },
  { name: "Green Park Homes", location: "Kileleshwa", units: 16, occupied: 15, income: 640000, outstanding: 0 },
];

const statusStyle: Record<string, { bg: string; fg: string }> = {
  Paid: { bg: "#EAFBF4", fg: "#159B6C" },
  Overdue: { bg: "#FFF0EE", fg: "#D94841" },
  Partial: { bg: "#FFF7E6", fg: "#C77A13" },
};

export default function Management() {
  const { user } = useGlobalContext();
  const owner = user?.role === "owner";

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
        <View className="mt-4 flex-row items-center justify-between"><View><Text className="text-2xl font-rubik-bold text-black-300">{owner ? "My properties" : "Tenants"}</Text><Text className="mt-1 text-sm font-rubik text-black-100">{owner ? "Portfolio performance and income" : "Tenant files, leases and balances"}</Text></View><TouchableOpacity className="size-12 items-center justify-center rounded-2xl bg-primary-300"><Plus size={26} color="#FFFFFF" /></TouchableOpacity></View>
        <View className="mt-6 h-13 flex-row items-center rounded-2xl bg-white px-4"><Search size={20} color="#98A2B3" /><TextInput placeholder={owner ? "Search properties" : "Search tenants, units or property"} placeholderTextColor="#98A2B3" className="ml-2 flex-1 font-rubik text-black-300" /></View>

        {owner ? (
          <>
            <View className="mb-3 mt-7 flex-row justify-between"><Text className="text-lg font-rubik-bold text-black-300">Portfolio</Text><Text className="text-xs font-rubik text-black-100">3 properties • 88 units</Text></View>
            {properties.map((property) => {
              const occupancy = Math.round((property.occupied / property.units) * 100);
              return <TouchableOpacity key={property.name} className="mb-3 rounded-[24px] bg-white p-5"><View className="flex-row items-center"><View className="size-12 items-center justify-center rounded-2xl bg-primary-100"><Building2 size={24} color="#2F6BFF" /></View><View className="ml-3 flex-1"><Text className="font-rubik-bold text-black-300">{property.name}</Text><Text className="mt-1 text-xs font-rubik text-black-100">{property.location} • {property.occupied}/{property.units} occupied</Text></View><ChevronRight size={19} color="#98A2B3" /></View><View className="mt-5 flex-row justify-between"><View><Text className="text-[11px] font-rubik text-black-100">Expected monthly</Text><Text className="mt-1 font-rubik-bold text-black-300">{formatPrice(property.income)}</Text></View><View className="items-end"><Text className="text-[11px] font-rubik text-black-100">Outstanding</Text><Text className={`mt-1 font-rubik-bold ${property.outstanding ? "text-[#E66B2E]" : "text-[#159B6C]"}`}>{formatPrice(property.outstanding)}</Text></View></View><View className="mt-4 h-1.5 overflow-hidden rounded-full bg-primary-100"><View className="h-full rounded-full bg-[#23C483]" style={{ width: `${occupancy}%` }} /></View><Text className="mt-2 text-right text-[11px] font-rubik-semibold text-[#159B6C]">{occupancy}% occupancy</Text></TouchableOpacity>;
            })}
          </>
        ) : (
          <>
            <View className="mb-3 mt-7 flex-row justify-between"><Text className="text-lg font-rubik-bold text-black-300">All tenants</Text><Text className="text-xs font-rubik text-black-100">43 active</Text></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">{["All", "Paid", "Overdue", "Expiring"].map((filter, index) => <TouchableOpacity key={filter} className={`mr-2 rounded-full px-4 py-2.5 ${index === 0 ? "bg-primary-300" : "bg-white"}`}><Text className={`text-xs font-rubik-semibold ${index === 0 ? "text-white" : "text-black-200"}`}>{filter}</Text></TouchableOpacity>)}</ScrollView>
            {tenants.map((tenant) => {
              const palette = statusStyle[tenant.status];
              return <TouchableOpacity key={tenant.unit} className="mb-3 rounded-[24px] bg-white p-4"><View className="flex-row items-center"><View className="size-12 items-center justify-center rounded-full bg-[#102A55]"><Text className="font-rubik-bold text-white">{tenant.name.split(" ").map((part) => part[0]).join("")}</Text></View><View className="ml-3 flex-1"><Text className="font-rubik-bold text-black-300">{tenant.name}</Text><Text className="mt-1 text-xs font-rubik text-black-100">{tenant.unit} • {tenant.property}</Text></View><View className="rounded-full px-3 py-1.5" style={{ backgroundColor: palette.bg }}><Text className="text-[11px] font-rubik-semibold" style={{ color: palette.fg }}>{tenant.status}</Text></View></View><View className="mt-4 flex-row border-t border-primary-100 pt-4"><View className="flex-1"><Text className="text-[11px] font-rubik text-black-100">Monthly rent</Text><Text className="mt-1 text-sm font-rubik-semibold text-black-300">{formatPrice(tenant.rent)}</Text></View><View className="flex-1"><Text className="text-[11px] font-rubik text-black-100">Lease ends</Text><Text className="mt-1 text-sm font-rubik-semibold text-black-300">{tenant.lease}</Text></View><ChevronRight size={19} color="#98A2B3" /></View></TouchableOpacity>;
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
