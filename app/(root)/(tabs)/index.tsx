import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import icons from "@/constants/icons";
import images from "@/constants/images";
import Search from "@/components/Search";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import { Card } from "@/components/Cards";
import { useAppwrite } from "@/lib/useAppwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { getProperties } from "@/lib/appwrite";

const Home = () => {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const firstName = user?.name?.split(" ")[0] || "there";

  const { data: properties, refetch, loading } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter ?? "",
      query: params.query ?? "",
      limit: 10,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter ?? "",
      query: params.query ?? "",
      limit: 10,
    });
  }, [params.filter, params.query]);

  return (
    <SafeAreaView className="flex-1 bg-accent-100">
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <Card
            item={item}
            onPress={() => router.push(`/properties/${item.$id}`)}
          />
        )}
        keyExtractor={(item) => item.$id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32"
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#2F6BFF" className="mt-8" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className="px-5 pb-4 pt-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={
                    user?.avatar
                      ? { uri: user.avatar }
                      : images.defaultProfileAvatar
                  }
                  className="size-12 rounded-full border-2 border-white"
                />
                <View className="ml-3">
                  <Text className="text-base font-rubik-bold text-black-300">
                    Hello {firstName} 👋
                  </Text>
                  <Text className="mt-0.5 text-xs font-rubik text-black-100">
                    How are you today?
                  </Text>
                </View>
              </View>

              <TouchableOpacity className="size-11 items-center justify-center rounded-full bg-white shadow-sm shadow-slate-200">
                <Image source={icons.bell} className="size-5" tintColor="#2F6BFF" />
              </TouchableOpacity>
            </View>

            <Search />
            <Filters />

            <View className="mt-5 flex-row items-center justify-between">
              <Text className="text-xl font-rubik-bold text-black-300">
                Recommended for you
              </Text>
              <TouchableOpacity onPress={() => router.push("/explore")}>
                <Text className="text-sm font-rubik-semibold text-primary-300">
                  See all
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Home;
