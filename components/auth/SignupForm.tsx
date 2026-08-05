"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0–4
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["", "#dc2626", "#f59e0b", "#65a30d", "rgb(var(--color-accent))"];

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password", "");
  const strength = getStrength(password);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      const user = res.data.user ?? {
        id: res.data.id ?? "unknown",
        name: data.name,
        email: data.email,
      };

      setAuth(res.data.token, user);

      toast.success("Vault created — welcome to Cachet!");
      router.push("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name field */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 block">
          Full name
        </label>
        <div className="relative">
          <User
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
          />
          <input
            type="text"
            placeholder="Your name"
            {...register("name")}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[rgb(var(--color-accent)/0.2)] bg-[rgb(var(--color-bg))] text-sm text-[rgb(var(--color-text))] outline-none focus:border-[rgb(var(--color-accent)/0.6)] transition-colors"
          />
        </div>
        {errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 mt-1"
          >
            {errors.name.message}
          </motion.p>
        )}
      </motion.div>

      {/* Email field */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
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
        <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 block">
          Password
        </label>
        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-[rgb(var(--color-accent)/0.2)] bg-[rgb(var(--color-bg))] text-sm text-[rgb(var(--color-text))] outline-none focus:border-[rgb(var(--color-accent)/0.6)] transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Password strength indicator */}
        {password && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full bg-neutral-200 overflow-hidden"
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: strengthColors[strength] }}
                    initial={{ width: "0%" }}
                    animate={{ width: i <= strength ? "100%" : "0%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>
            {strength > 0 && (
              <p className="mt-1.5 text-xs text-[rgb(var(--color-text-muted))]">
                {strengthLabels[strength]}
              </p>
            )}
          </div>
        )}

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

      {/* Confirm password field */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 block">
          Confirm password
        </label>
        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
          />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-[rgb(var(--color-accent)/0.2)] bg-[rgb(var(--color-bg))] text-sm text-[rgb(var(--color-text))] outline-none focus:border-[rgb(var(--color-accent)/0.6)] transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 mt-1"
          >
            {errors.confirmPassword.message}
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
            Creating vault...
          </>
        ) : (
          "Create your vault"
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
        Already have an account?{" "}
        <a href="/login" className="text-[rgb(var(--color-accent))] font-medium hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
}