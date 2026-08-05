"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/resetPassword";

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["", "#dc2626", "#f59e0b", "#65a30d", "rgb(var(--color-accent))"];

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "invalid">("idle");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password", "");
  const strength = getStrength(password);

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, {
        password: data.password,
      });
      setStatus("success");
      toast.success("Password reset successful!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Something went wrong. Try again.";
      if (err?.response?.status === 400) {
        setStatus("invalid");
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // link expired / invalid token
  if (status === "invalid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
          <XCircle size={22} className="text-red-500" strokeWidth={1.75} />
        </div>
        <h2 className="mt-4 font-display text-lg font-medium text-[rgb(var(--color-text))]">
          Link expired or invalid
        </h2>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))] leading-relaxed">
          This reset link is no longer valid. Request a new one to continue.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-[rgb(var(--color-accent))] font-medium hover:underline underline-offset-4"
        >
          <ArrowLeft size={14} />
          Request a new link
        </Link>
      </motion.div>
    );
  }

  // success state
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-[rgb(var(--color-accent))]/10">
          <CheckCircle2 size={22} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
        </div>
        <h2 className="mt-4 font-display text-lg font-medium text-[rgb(var(--color-text))]">
          Password reset
        </h2>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))] leading-relaxed">
          Your password has been updated. Taking you to login...
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* New password */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 block">
          New password
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

        {password && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-1 flex-1 rounded-full bg-neutral-200 overflow-hidden">
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

        <AnimatePresence>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-red-500 mt-1"
            >
              {errors.password.message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confirm password */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
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
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[rgb(var(--color-accent)/0.2)] bg-[rgb(var(--color-bg))] text-sm text-[rgb(var(--color-text))] outline-none focus:border-[rgb(var(--color-accent)/0.6)] transition-colors"
          />
        </div>
        <AnimatePresence>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-red-500 mt-1"
            >
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

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
            Resetting...
          </>
        ) : (
          "Reset password"
        )}
      </motion.button>
    </form>
  );
}
