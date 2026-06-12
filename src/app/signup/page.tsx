import { Suspense } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import AuthFormCard from "@/components/ui/AuthFormCard";

export default function SignUpPage() {
  return (
    <AuthLayout backgroundImage="/imgs/auth/signup_bg.png">
      {/* AuthFormCard reads ?error= via useSearchParams, which requires Suspense. */}
      <Suspense fallback={null}>
        <AuthFormCard variant="signup" />
      </Suspense>
    </AuthLayout>
  );
}
