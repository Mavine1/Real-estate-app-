import React, { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { useDebouncedCallback } from "use-debounce";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react-native";

import { useLocalSearchParams, router } from "expo-router";

const Search = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(params.query);

  const debouncedSearch = useDebouncedCallback((text: string) => {
    router.setParams({ query: text });
  }, 500);

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  return (
    <View className="mt-6 h-14 w-full flex-row items-center rounded-[18px] bg-white px-4 shadow-sm shadow-slate-200">
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <SearchIcon size={20} color="#667085" strokeWidth={2.2} />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search for a home"
          placeholderTextColor="#98A2B3"
          className="ml-3 flex-1 text-sm font-rubik text-black-300"
        />
      </View>

      <TouchableOpacity className="size-10 items-center justify-center rounded-full bg-primary-300">
        <SlidersHorizontal size={20} color="#FFFFFF" strokeWidth={2.2} />
      </TouchableOpacity>
    </View>
  );
};

export default Search;
