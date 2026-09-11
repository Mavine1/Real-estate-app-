import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

import { useGlobalContext } from "@/lib/global-provider";

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: keyof typeof Ionicons.glyphMap; title: string }) => (
  <View className={`h-11 flex-row items-center justify-center rounded-full px-3 ${focused ? "bg-primary-300" : "bg-transparent"}`}>
    <Ionicons name={focused ? (icon.replace("-outline", "") as keyof typeof Ionicons.glyphMap) : icon} size={21} color={focused ? "#FFFFFF" : "#98A2B3"} />
    {focused && <Text className="ml-1.5 text-[11px] font-rubik-semibold text-white">{title}</Text>}
  </View>
);

export default function TabsLayout() {
  const { user } = useGlobalContext();
  const tenant = user?.role === "tenant";

  return (
    <Tabs screenOptions={{ tabBarShowLabel: false, tabBarStyle: { backgroundColor: "#FFFFFF", position: "absolute", left: 14, right: 14, bottom: 14, height: 68, borderRadius: 26, borderTopWidth: 0, paddingHorizontal: 7, elevation: 12, shadowColor: "#16213E", shadowOpacity: 0.14, shadowRadius: 18, shadowOffset: { width: 0, height: 7 } } }}>
      <Tabs.Screen name="index" options={{ title: "Home", headerShown: false, tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="home-outline" title="Home" /> }} />
      <Tabs.Screen name="explore" options={{ href: tenant ? undefined : null, title: "Properties", headerShown: false, tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="search-outline" title="Homes" /> }} />
      <Tabs.Screen name="management" options={{ href: tenant ? null : undefined, title: user?.role === "owner" ? "Properties" : "Tenants", headerShown: false, tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={user?.role === "owner" ? "business-outline" : "people-outline"} title={user?.role === "owner" ? "Portfolio" : "Tenants"} /> }} />
      <Tabs.Screen name="payments" options={{ href: tenant ? undefined : null, title: "Payments", headerShown: false, tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="wallet-outline" title="Pay" /> }} />
      <Tabs.Screen name="maintenance" options={{ title: "Maintenance", headerShown: false, tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="construct-outline" title="Repairs" /> }} />
      <Tabs.Screen name="documents" options={{ href: null, title: "Documents", headerShown: false }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", headerShown: false, tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="person-outline" title="Profile" /> }} />
    </Tabs>
  );
}
