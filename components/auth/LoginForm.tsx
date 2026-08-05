"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", data);

      const user = res.data.user ?? {
        id: res.data.id ?? "unknown",
        name: res.data.name ?? data.email.split("@")[0],
        email: data.email,
      };

      setAuth(res.data.token, user);

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Invalid email or password";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email field */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 block">
          Email
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
          />
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[rgb(var(--color-accent)/0.2)] bg-[rgb(var(--color-bg))] text-sm text-[rgb(var(--color-text))] outline-none focus:border-[rgb(var(--color-accent)/0.6)] transition-colors"
          />
        </div>
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 mt-1"
          >
            {errors.email.message}
          </motion.p>
        )}
      </motion.div>

      {/* Password field */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-[rgb(var(--color-text))]">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-[rgb(var(--color-accent))] hover:underline underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-[rgb(var(--color-accent)/0.2)] bg-[rgb(var(--color-bg))] text-sm text-[rgb(var(--color-text))] outline-none focus:border-[rgb(var(--color-accent)/0.6)] transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-accent))] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 mt-1"
          >
            {errors.password.message}
          </motion.p>
        )}
      </motion.div>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="btn-shimmer w-full py-2.5 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Signing in...
          </>
        ) : (
          "Login"
        )}
      </motion.button>

      {/* divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-[rgb(var(--color-accent))]/15" />
        <span className="text-xs text-[rgb(var(--color-text-muted))] font-mono">or</span>
        <div className="flex-1 h-px bg-[rgb(var(--color-accent))]/15" />
      </div>

      <GoogleSignInButton />

      <p className="text-center text-sm text-[rgb(var(--color-text-muted))]">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-[rgb(var(--color-accent))] font-medium hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
}