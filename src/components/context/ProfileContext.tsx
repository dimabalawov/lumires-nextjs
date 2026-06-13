// components/context/ProfileContext.tsx
"use client";

import { createContext, useContext } from "react";
import type { UserProfile, UserProfileSummary } from "@/types/profile";

interface ProfileContextValue {
  profile: UserProfile;
  summary: UserProfileSummary;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileContextProvider({
  value,
  children,
}: {
  value: ProfileContextValue;
  children: React.ReactNode;
}) {
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfileContext must be used inside ProfileContextProvider");
  return ctx;
}
