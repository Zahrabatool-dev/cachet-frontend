"use client";

import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export function GoogleSignInButton() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // access_token se user info le kar backend ko bhejte hain
        const userInfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const userInfo = await userInfoRes.json();

        const res = await api.post("/auth/google-token", {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          googleId: userInfo.sub,
        });

        setAuth(res.data.token, res.data.user);
        toast.success("Welcome!");
        router.push("/dashboard");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Google sign-in failed");
      }
    },
    onError: () => toast.error("Google sign-in failed"),
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg border border-[rgb(var(--color-accent))]/20 bg-white text-sm font-medium text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-accent))]/5 hover:border-[rgb(var(--color-accent))]/40 transition-all duration-200"
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.61z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.19l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"/>
        <path fill="#FBBC05" d="M3.97 10.7A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l3.01-2.33z"/>
        <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
      </svg>
      Continue with Google
    </button>
  );
}