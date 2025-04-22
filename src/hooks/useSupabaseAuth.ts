
import { useContext } from "react";
import { AuthContext } from "../components/auth/AuthProvider";

export const useSupabaseAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useSupabaseAuth must be used inside AuthProvider");
  return ctx;
};
