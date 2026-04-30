import AuthLayout from "@/components/layout/AuthLayout";
import AuthFormCard from "@/components/ui/AuthFormCard";

export default function SignUpPage() {
  return (
    <AuthLayout backgroundImage="/imgs/auth/signup_bg.png">
      <AuthFormCard variant="signup" />
    </AuthLayout>
  );
}
