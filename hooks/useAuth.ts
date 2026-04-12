import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  isLoading: true,
  isLoggedIn: false,
  signOut: async () => {},
});

/**
 * On web, check if the URL hash contains OAuth tokens and establish a session.
 */
async function handleWebOAuthRedirect(): Promise<void> {
  if (Platform.OS !== "web" || typeof window === "undefined") return;

  const hash = window.location.hash;
  if (!hash || !hash.includes("access_token")) return;

  const params = new URLSearchParams(hash.substring(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken) return;

  await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken ?? "",
  });

  window.history.replaceState(null, "", window.location.pathname);
}

export function useAuthProvider(): AuthContextValue {
  const [state, setState] = useState<{
    session: Session | null;
    user: User | null;
    isLoading: boolean;
  }>({
    session: null,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const initialize = async () => {
      await handleWebOAuthRedirect();

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setState({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    ...state,
    isLoggedIn: !!state.session,
    signOut,
  };
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
