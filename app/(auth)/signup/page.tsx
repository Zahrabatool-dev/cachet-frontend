import { AuthLayout } from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      heading="Create your vault"
      subheading="Set up in under two minutes. No card required."
    >
      <SignupForm />
    </AuthLayout>
  );
}