import { AuthLayout } from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      heading="Reset your password"
      subheading="Enter your email and we'll send you a link to get back in."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
