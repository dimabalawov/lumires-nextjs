import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden h-screen">
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
          className="absolute top-0 left-0 right-0 h-26.75"
          style={{ background: "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(14,12,11,0.78) 59%, rgba(18,16,14,1) 76%)" }}
        />
        {/* Bottom gradient — darkens lower text area */}
        <div
          className="absolute bottom-0 left-0 right-0 h-43.5"
          style={{ background: "linear-gradient(to top, rgba(18,16,14,1) 0%, rgba(14,12,11,0.78) 40%, rgba(0,0,0,0) 100%)" }} />
      </div>

      {/* Content container */}
      <div className="absolute z-10 top-0 left-1/2 -translate-x-1/2 w-[91%]
        md:w-[73.5%] max-w-264.75 h-full flex flex-col justify-between pb-24 pt-32">
        {/* READ REVIEWS + TRACK FILMS + BUILD YOUR TASTE */}
        <div className="flex flex-col gap-12">
          <div className="flex gap-4 flex-row justify-between items-start opacity-80">
            <Link
              href="#"
              className="font-manrope font-light text-brand-light uppercase leading-[1.3] lg:leading-[1.104] hover:opacity-60 transition-opacity"
              style={{ fontSize: "clamp(20px, 4vw, 60px)" }}
            >
              READ REVIEWS
            </Link>
            <Link
              href="#"
              className="font-manrope font-light text-white uppercase leading-[1.3] lg:leading-[1.366] hover:opacity-60 transition-opacity"
              style={{ fontSize: "clamp(16px, 3vw, 36px)" }}
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
          className="font-manrope font-light text-brand-light uppercase
            text-right text-[16px] lg:text-[28px] leading-[1.714] tracking-[0.06em]
            hover:opacity-60 transition-opacity justify-self-end mt-auto"
          style={{ fontSize: "clamp(16px, 3vw, 28px)" }}
        >
          EXPLORE FILMS →
        </Link>
      </div>
    </section>
  );
}
