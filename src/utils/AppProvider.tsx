"use client";

import darkModeAtom from "@/atoms/darkModeAtom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React from "react";

interface AppProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const AppProvider = ({ children }: AppProviderProps) => {
  const [colorMode] = useAtom(darkModeAtom);
  return (
    <div className={colorMode === "light" ? "dark" : "light"}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </div>
  );
};

export default AppProvider;
