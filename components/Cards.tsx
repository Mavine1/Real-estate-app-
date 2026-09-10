import { Image, Text, TouchableOpacity, View } from "react-native";
import { Models } from "react-native-appwrite";

import icons from "@/constants/icons";
import { formatPrice, nairobiAddress } from "@/lib/format";

interface Props {
  item: Models.DefaultDocument;
  onPress?: () => void;
}

const Feature = ({ icon, label }: { icon: number; label: string }) => (
  <View className="flex-row items-center rounded-full bg-primary-100 px-3 py-2">
    <Image source={icon} className="size-4" tintColor="#667085" />
    <Text className="ml-1.5 text-xs font-rubik-medium text-black-200">
      {label}
    </Text>
  </View>
);

export const Card = ({ item, onPress }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.9}
    className="mx-5 mb-5 rounded-[24px] bg-white p-3 shadow-lg shadow-slate-200"
  >
    <View className="relative overflow-hidden rounded-[20px]">
      <Image source={{ uri: item.image }} className="h-52 w-full" resizeMode="cover" />

      <View className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5">
        <Text className="text-[11px] font-rubik-bold text-black-300">
          {item.type ?? "Home"}
        </Text>
      </View>

      <View className="absolute right-3 top-3 size-9 items-center justify-center rounded-full bg-white/95">
        <Image source={icons.heart} className="size-4" tintColor="#2F6BFF" />
      </View>
    </View>

    <View className="px-1 pb-1 pt-4">
      <View className="flex-row items-start justify-between gap-3">
        <Text
          numberOfLines={1}
          className="flex-1 text-lg font-rubik-bold text-black-300"
        >
          {item.name}
        </Text>
        <Text className="text-base font-rubik-bold text-primary-300">
          {formatPrice(item.price)}
        </Text>
      </View>

      <View className="mt-1.5 flex-row items-center">
        <Image source={icons.location} className="size-4" tintColor="#667085" />
        <Text className="ml-1.5 text-xs font-rubik text-black-200">
          {nairobiAddress}
        </Text>
      </View>

      <View className="my-3 h-px bg-primary-100" />

      <View className="flex-row gap-2">
        <Feature icon={icons.bed} label={`${item.bedrooms ?? 0} Beds`} />
        <Feature icon={icons.bath} label={`${item.bathrooms ?? 0} Baths`} />
        <Feature icon={icons.carPark} label="Parking" />
      </View>
    </View>
  </TouchableOpacity>
);

export const FeaturedCard = Card;
