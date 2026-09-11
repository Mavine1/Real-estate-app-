import React, { createContext, useContext, ReactNode, useState } from "react";

import { AppUser, getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";
import { Redirect } from "expo-router";

interface GlobalContextType {
  isLogged: boolean;
  user: AppUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
  setUser: (user: AppUser | null) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const {
    data: restoredUser,
    loading,
    refetch,
  } = useAppwrite({
    fn: getCurrentUser,
  });

  // `undefined` means authentication has not been changed in this session yet.
  // `null` is an explicit logged-out state and must not fall back to a stale
  // user returned by the initial session restore request.
  const [sessionUser, setSessionUser] = useState<AppUser | null | undefined>(
    undefined
  );
  const user = sessionUser === undefined ? restoredUser : sessionUser;

  const isLogged = !!user;

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        user,
        loading,
        refetch,
        setUser: setSessionUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;
