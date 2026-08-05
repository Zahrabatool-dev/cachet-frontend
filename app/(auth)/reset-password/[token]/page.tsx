import { AuthLayout } from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

// Next.js 15+ ke liye: params ab ek Promise hai
export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <AuthLayout
      heading="Set a new password"
      subheading="Choose a strong password to secure your vault."
    >
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}