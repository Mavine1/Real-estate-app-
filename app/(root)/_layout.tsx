import { Redirect, Slot } from "expo-router";

import BrandLoader from "@/components/BrandLoader";
import { useGlobalContext } from "@/lib/global-provider";

export default function AppLayout() {
  const { loading, isLogged } = useGlobalContext();

  if (loading) {
    return <BrandLoader />;
  }

  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
}
