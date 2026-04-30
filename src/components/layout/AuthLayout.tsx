import Image from "next/image";
import Header from "./Header";

interface AuthLayoutProps {
  backgroundImage: string;
  mirrorBackground?: boolean;
  children: React.ReactNode;
}

export default function AuthLayout({ backgroundImage, mirrorBackground, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-dark relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className={`object-cover${mirrorBackground ? " scale-x-[-1]" : ""}`}
          priority
        />
      </div>

      {/* Horizontal overlay: dark on right, transparent on left (desktop only) */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-[65%] pointer-events-none z-1 auth-overlay-right" />

      {/* Mobile full-screen dark overlay for readability */}
      <div className="lg:hidden absolute inset-0 pointer-events-none z-1 bg-brand-dark/60" />

      {/* Top overlay: dark at top for header readability */}
      <div className="absolute top-0 left-0 w-full h-[138px] pointer-events-none z-2 auth-overlay-top" />

      <div className="relative z-3">
        <Header />
      </div>

      {/* Form card: centered on mobile, pinned right on desktop */}
      <div className="absolute inset-0 z-4 flex items-center justify-center px-4 lg:justify-end lg:px-0 lg:pr-[106px]">
        {children}
      </div>
    </div>
  );
}
