"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/forgotPassword";

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", data);
      setSubmittedEmail(data.email);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // success state — shown after the request goes through
  if (submittedEmail) {
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
          Check your email
        </h2>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))] leading-relaxed">
          If an account exists for <span className="font-medium text-[rgb(var(--color-text))]">{submittedEmail}</span>,
          we've sent a link to reset your password.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-[rgb(var(--color-accent))] font-medium hover:underline underline-offset-4"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </motion.div>
    );
  }

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
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-red-500 mt-1"
            >
              {errors.email.message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="btn-shimmer w-full py-2.5 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending link...
          </>
        ) : (
          "Send reset link"
        )}
      </motion.button>

      <p className="text-center text-sm text-[rgb(var(--color-text-muted))]">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[rgb(var(--color-accent))] font-medium hover:underline underline-offset-4"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </p>
    </form>
  );
}