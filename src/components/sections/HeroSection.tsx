import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden h-screen min-h-[500px] lg:min-h-[811px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/imgs/hero_bg.png"
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Top gradient — darkens header area */}
        <div
          className="absolute top-0 left-0 right-0 h-[107px]"
          style={{ background: "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(14,12,11,0.78) 59%, rgba(18,16,14,1) 76%)" }}
        />
        {/* Bottom gradient — darkens lower text area */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[174px]"
          style={{ background: "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(14,12,11,0.78) 58%, rgba(18,16,14,1) 100%)" }}
        />
      </div>

      {/* Content container */}
      <div className="absolute z-10 top-[16%] left-1/2 -translate-x-1/2 w-[91%] lg:w-[73.5%] max-w-[1059px] flex flex-col gap-[85px] lg:gap-[179px]">
        {/* READ REVIEWS + TRACK FILMS + BUILD YOUR TASTE */}
        <div className="flex flex-col gap-[13px]">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between items-start opacity-80">
            <Link
              href="#"
              className="font-manrope font-light text-brand-light uppercase text-[20px] lg:text-[60px] leading-[1.3] lg:leading-[1.104] hover:opacity-60 transition-opacity"
            >
              READ REVIEWS
            </Link>
            <Link
              href="#"
              className="font-manrope font-light text-white uppercase text-[16px] lg:text-[36px] leading-[1.3] lg:leading-[1.366] hover:opacity-60 transition-opacity"
            >
              TRACK FILMS
            </Link>
          </div>
          <h1
            className="font-oswald font-extralight text-brand-light uppercase text-center leading-none"
            style={{ fontSize: "clamp(36px, 10vw, 160px)" }}
          >
            BUILD YOUR TASTE
          </h1>
        </div>

        {/* EXPLORE FILMS → */}
        <Link
          href="#"
          className="font-manrope font-light text-brand-light uppercase text-right text-[16px] lg:text-[28px] leading-[1.714] tracking-[0.06em] hover:opacity-60 transition-opacity"
        >
          EXPLORE FILMS →
        </Link>
      </div>
    </section>
  );
}
