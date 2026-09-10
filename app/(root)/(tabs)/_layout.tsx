import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";

import icons from "@/constants/icons";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => (
  <View
    className={`h-11 flex-row items-center justify-center rounded-full px-4 ${
      focused ? "bg-primary-300" : "bg-transparent"
    }`}
  >
    <Image
      source={icon}
      tintColor={focused ? "#FFFFFF" : "#98A2B3"}
      resizeMode="contain"
      className="size-6"
    />
    {focused && (
      <Text className="ml-2 text-xs font-rubik-semibold text-white">
        {title}
      </Text>
    )}
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 18,
          height: 68,
          borderRadius: 26,
          borderTopWidth: 0,
          paddingHorizontal: 10,
          elevation: 10,
          shadowColor: "#16213E",
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 7 },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Explore" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
