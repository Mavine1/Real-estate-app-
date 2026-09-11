import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGlobalContext } from "@/lib/global-provider";

const icon = (
  outline: keyof typeof Ionicons.glyphMap,
  filled: keyof typeof Ionicons.glyphMap
) =>
  function NavigationIcon({ focused, color }: { focused: boolean; color: ColorValue }) {
    return <Ionicons name={focused ? filled : outline} size={23} color={color} />;
  };

const HomeIcon = icon("home-outline", "home");
const SearchIcon = icon("search-outline", "search");
const WalletIcon = icon("wallet-outline", "wallet");
const RepairIcon = icon("construct-outline", "construct");
const ProfileIcon = icon("person-outline", "person");
const TenantIcon = icon("people-outline", "people");
const PortfolioIcon = icon("business-outline", "business");

export default function TabsLayout() {
  const { user } = useGlobalContext();
  const insets = useSafeAreaInsets();
  const tenant = user?.role === "tenant";
  const owner = user?.role === "owner";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#2F6BFF",
        tabBarInactiveTintColor: "#7A8499",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontFamily: "Rubik-Medium",
          fontSize: 10,
          marginTop: 2,
        },
        tabBarIconStyle: { marginTop: 5 },
        tabBarItemStyle: { paddingHorizontal: 0 },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          position: "absolute",
          left: 12,
          right: 12,
          bottom: Math.max(insets.bottom, 10),
          height: 68,
          borderRadius: 24,
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 4,
          elevation: 12,
          shadowColor: "#16213E",
          shadowOpacity: 0.14,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 7 },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: HomeIcon }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: tenant ? undefined : null,
          title: "Homes",
          tabBarIcon: SearchIcon,
        }}
      />
      <Tabs.Screen
        name="management"
        options={{
          href: tenant ? null : undefined,
          title: owner ? "Portfolio" : "Tenants",
          tabBarIcon: owner ? PortfolioIcon : TenantIcon,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          href: tenant ? undefined : null,
          title: "Pay",
          tabBarIcon: WalletIcon,
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: owner ? "Approvals" : "Repairs",
          tabBarIcon: RepairIcon,
        }}
      />
      <Tabs.Screen name="documents" options={{ href: null, title: "Documents" }} />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ProfileIcon }}
      />
    </Tabs>
  );
}
