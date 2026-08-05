"use client";

import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";


export function GoogleSignInButton() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      toast.error("Google sign-in failed");
      return;
    }

    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      setAuth(res.data.token, res.data.user);
      toast.success("Welcome!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="w-full flex justify-center [&>div]:w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in failed")}
        theme="outline"
        size="large"
        text="continue_with"
      />
    </div>
  );
}