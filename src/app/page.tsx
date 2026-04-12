import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import TrendingSection from "@/components/sections/TrendingSection";
import WeeklySection from "@/components/sections/WeeklySection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black overflow-hidden">
      <div className="relative">
        <Header />
        <HeroSection />
        <TrendingSection />
        <WeeklySection />
      </div>
    </main>
  );
}
