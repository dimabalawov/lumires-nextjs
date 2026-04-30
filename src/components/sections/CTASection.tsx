import Image from "next/image";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-brand-dark flex justify-center pb-16 lg:pb-0">
      <div className="relative w-[94%] lg:w-[90%] xl:w-[83%] max-w-[1197px] h-[276px] lg:h-[674px] rounded-md overflow-hidden mx-auto">
        {/* Background image */}
        <Image
          src="/imgs/cta/cta.png"
          alt="Film archive background"
          fill
          className="object-cover"
          priority={false}
        />

        {/* Gradient overlay — bottom-up on mobile, left-to-right on desktop */}
        <div className="absolute inset-0 border border-black [background:linear-gradient(0deg,rgba(18,16,14,0.95)_0%,rgba(14,12,11,0.6)_60%,rgba(0,0,0,0)_100%)] lg:[background:linear-gradient(90deg,rgba(0,0,0,0.00)_0%,rgba(14,12,11,0.82)_56.73%,rgba(18,16,14,0.95)_100%)]" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end lg:items-center justify-center lg:justify-end px-6 lg:px-12 py-8 lg:py-18">
          <div className="flex flex-col items-center lg:items-end gap-6 lg:gap-37 w-full lg:w-136.75">
            <h2 className="font-oswald font-light text-[28px] lg:text-[80px] leading-tight lg:leading-27.75 uppercase text-brand-gold text-center lg:text-right tracking-[0.06em]">
              Start building your film archive
            </h2>

            <Link
              href="/sign-up"
              className="flex items-center gap-2 font-oswald font-light text-[20px] lg:text-[36px] leading-tight lg:leading-12 uppercase text-brand-light tracking-[2.16px] hover:text-brand-gold transition-colors"
            >
              <span className="underline decoration-solid decoration-[3%] underline-offset-[20%] [text-underline-position:from-font] [text-decoration-skip-ink:auto]">
                Create account
              </span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
