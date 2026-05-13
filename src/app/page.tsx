import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import TrendingSection from "@/components/sections/TrendingSection";
import WeeklySection from "@/components/sections/WeeklySection";
import CommunitySection from "@/components/sections/CommunitySection";
import CollectionsSection from "@/components/sections/CollectionsSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <div className="relative">
        <Header />
        <HeroSection />
        <TrendingSection />
        <WeeklySection />
        <CollectionsSection />
        <CommunitySection />
        <CTASection />
      </div>
    </main>
  );
}
