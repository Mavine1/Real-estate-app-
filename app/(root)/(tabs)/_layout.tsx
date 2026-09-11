import {
  Building2,
  Home,
  Search,
  UserRound,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react-native";
import { Tabs } from "expo-router";
import { View, type ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGlobalContext } from "@/lib/global-provider";

const icon = (Icon: LucideIcon) =>
  function NavigationIcon({ focused, color }: { focused: boolean; color: ColorValue }) {
    return (
      <View
        className={`h-9 w-11 items-center justify-center rounded-2xl ${focused ? "bg-primary-100" : "bg-transparent"}`}
      >
        <Icon
          size={22}
          color={color as string}
          strokeWidth={focused ? 2.6 : 2.1}
        />
      </View>
    );
  };

const HomeIcon = icon(Home);
const SearchIcon = icon(Search);
const WalletIcon = icon(Wallet);
const RepairIcon = icon(Wrench);
const ProfileIcon = icon(UserRound);
const TenantIcon = icon(Users);
const PortfolioIcon = icon(Building2);

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
        sceneStyle: { backgroundColor: "transparent" },
        tabBarLabelStyle: {
          fontFamily: "Rubik-Medium",
          fontSize: 10,
          marginTop: 2,
        },
        tabBarIconStyle: { marginTop: 3 },
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
