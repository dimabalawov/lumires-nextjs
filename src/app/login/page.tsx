import { Suspense } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import AuthFormCard from "@/components/ui/AuthFormCard";

export default function LoginPage() {
  return (
    <AuthLayout backgroundImage="/imgs/auth/login_bg.png" mirrorBackground>
      {/* AuthFormCard reads ?error= via useSearchParams, which requires Suspense. */}
      <Suspense fallback={null}>
        <AuthFormCard variant="login" />
      </Suspense>
    </AuthLayout>
  );
}
