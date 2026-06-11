import Image from "next/image";

interface AuthLayoutProps {
  backgroundImage: string;
  mirrorBackground?: boolean;
  children: React.ReactNode;
}

export default function AuthLayout({ backgroundImage, mirrorBackground, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-dark relative w-full flex flex-col justify-between">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className={`object-cover ${mirrorBackground ? "scale-x-[-1]" : ""}`}
          priority
        />
        <div className="lg:hidden absolute inset-0 bg-brand-dark/60" />
        <div className="hidden lg:block absolute inset-y-0 right-0 w-[65%] auth-overlay-right" />
        <div className="absolute top-0 left-0 w-full h-34.5 auth-overlay-top" />
      </div>

      <main className="relative z-10 w-full grow flex flex-col justify-center items-center px-4 
                       pt-35 pb-15 
                       lg:items-end lg:pr-26.5 lg:pt-30">

        <div className="w-full max-w-112.5 my-auto">
          {children}
        </div>

      </main>

    </div>
  );
}