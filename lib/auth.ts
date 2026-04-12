import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri();

export async function signInWithGoogle() {
  if (Platform.OS === "web") {
    // Web: full page redirect
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  } else {
    // Native: in-app browser
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;

    const res = await WebBrowser.openAuthSessionAsync(
      data?.url ?? "",
      redirectTo,
    );

    if (res.type === "success") {
      const { params, errorCode } = QueryParams.getQueryParams(res.url);
      if (errorCode) throw new Error(errorCode);

      const { access_token, refresh_token } = params;
      if (access_token) {
        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
      }
    }
  }
}
