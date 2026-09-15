import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Bell } from "lucide-react-native";

import { Card } from "@/components/Cards";
import { managedProperties, type PropertyCategory } from "@/lib/managed-properties";

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState<"All" | PropertyCategory>("All");
  const categories: ("All" | PropertyCategory)[] = ["All", "Apartments", "Houses", "Shops", "BNB"];
  const properties = selectedCategory === "All"
    ? managedProperties
    : managedProperties.filter((property) => property.type === selectedCategory);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="h-full bg-transparent">
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<ActivityIndicator size="large" className="text-primary-300 mt-5" />}
        ListHeaderComponent={() => (
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <ArrowLeft size={20} color="#17213C" strokeWidth={2.2} />
              </TouchableOpacity>

              <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                Managed homes
              </Text>
              <TouchableOpacity className="size-11 items-center justify-center rounded-full bg-white" accessibilityLabel="Notifications">
                <Bell size={21} color="#17213C" strokeWidth={2.1} />
              </TouchableOpacity>
            </View>

            <View className="mt-6">
              <Text className="text-xl font-rubik-bold text-black-300">Find your space</Text>
              <Text className="mt-1 text-sm font-rubik text-black-200">
                Homes personally managed by Grace Wanjiku
              </Text>
              <View className="mt-4 flex-row flex-wrap gap-2">
                {categories.map((category) => {
                  const selected = selectedCategory === category;
                  return (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      className={`rounded-full px-4 py-2.5 ${selected ? "bg-primary-300" : "bg-white"}`}
                    >
                      <Text className={`text-sm font-rubik-medium ${selected ? "text-white" : "text-black-200"}`}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text className="mt-6 text-lg font-rubik-bold text-black-300">
                {properties.length} {selectedCategory === "All" ? "managed properties" : selectedCategory}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Explore;
