import { AuthLayout } from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout heading="Welcome back" subheading="Log in to access your vault.">
      <LoginForm />
    </AuthLayout>
  );
}