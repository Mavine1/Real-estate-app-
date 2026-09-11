import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CarFront,
  Heart,
  MapPin,
  Ruler,
  Star,
  type LucideIcon,
} from "lucide-react-native";

import { useAppwrite } from "@/lib/useAppwrite";
import { getPropertyById } from "@/lib/appwrite";
import { formatPrice, nairobiAddress } from "@/lib/format";

const DetailChip = ({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) => (
  <View className="flex-row items-center rounded-full bg-primary-100 px-3 py-2.5">
    <Icon size={16} color="#667085" strokeWidth={2.1} />
    <Text className="ml-1.5 text-xs font-rubik-medium text-black-200">
      {label}
    </Text>
  </View>
);

const PropertyDetails = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: property, loading } = useAppwrite({
    fn: getPropertyById,
    params: { id: id! },
  });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-transparent">
        <ActivityIndicator size="large" color="#2F6BFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-transparent">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32"
      >
        <View className="relative h-[390px] overflow-hidden rounded-b-[36px] bg-primary-200">
          <Image
            source={{ uri: property?.image }}
            className="size-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-[#102A55]/10" />

          <View
            className="absolute inset-x-5 flex-row items-center justify-between"
            style={{ top: Platform.OS === "ios" ? 58 : 32 }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="size-11 items-center justify-center rounded-full bg-white/95"
            >
              <ArrowLeft size={20} color="#17213C" strokeWidth={2.2} />
            </TouchableOpacity>

            <Text className="text-base font-rubik-semibold text-white">
              Property Details
            </Text>

            <TouchableOpacity className="size-11 items-center justify-center rounded-full bg-white/95">
              <Heart size={20} color="#2F6BFF" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5 pt-6">
          <View className="flex-row items-start justify-between gap-4">
            <Text className="flex-1 text-2xl font-rubik-bold text-black-300">
              {property?.name}
            </Text>
            <Text className="text-xl font-rubik-bold text-primary-300">
              {formatPrice(property?.price)}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center">
            <MapPin size={16} color="#667085" strokeWidth={2.1} />
            <Text className="ml-1.5 text-sm font-rubik text-black-200">
              {nairobiAddress}
            </Text>
          </View>

          <Text className="mt-5 text-[15px] leading-6 font-rubik text-black-200">
            {property?.description ||
              "A modern Nairobi home designed for comfortable city living, with thoughtful spaces and convenient access to everyday essentials."}
          </Text>

          <View className="mt-6 flex-row flex-wrap gap-2">
            <DetailChip icon={BedDouble} label={`${property?.bedrooms ?? 0} Beds`} />
            <DetailChip icon={Bath} label={`${property?.bathrooms ?? 0} Baths`} />
            <DetailChip icon={CarFront} label="Parking" />
            <DetailChip icon={Ruler} label={`${property?.area ?? 0} sqft`} />
          </View>

          <View className="mt-7 rounded-[24px] bg-white p-5 shadow-sm shadow-slate-200">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-rubik text-black-100">Property type</Text>
                <Text className="mt-1 text-base font-rubik-bold text-black-300">
                  {property?.type || "Home"}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xs font-rubik text-black-100">Rating</Text>
                <View className="mt-1 flex-row items-center">
                  <Star size={17} color="#F5A623" fill="#F5A623" strokeWidth={2} />
                  <Text className="ml-1 text-base font-rubik-bold text-black-300">
                    {property?.rating ?? 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute inset-x-0 bottom-0 border-t border-primary-100 bg-white px-5 pb-7 pt-4">
        <TouchableOpacity className="h-14 items-center justify-center rounded-full bg-primary-300 shadow-md shadow-blue-300">
          <Text className="text-base font-rubik-bold text-white">
            Schedule a Visit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PropertyDetails;
