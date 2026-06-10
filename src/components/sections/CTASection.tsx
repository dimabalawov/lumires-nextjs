import Image from "next/image";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-brand-dark flex justify-center pb-16 lg:pb-0">
      <div className="relative w-[94%] lg:w-[90%] xl:w-[83%] max-w-299.25 aspect-video rounded-md overflow-hidden mx-auto">
        {/* Background image */}
        <Image
          src="/imgs/cta/cta.png"
          alt="Film archive background"
          fill
          className="object-cover"
          priority={false}
        />

        {/* Gradient overlay — bottom-up on mobile, left-to-right on desktop */}
        <div className="absolute inset-0 border border-black [background:linear-gradient(0deg,rgba(18,16,14,0.95)_0%,rgba(14,12,11,0.6)_60%,rgba(0,0,0,0)_100%)] 
        lg:[background:linear-gradient(90deg,rgba(0,0,0,0.00)_0%,rgba(14,12,11,0.82)_56.73%,rgba(18,16,14,0.95)_100%)]" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-end px-6 lg:px-12">
          <div className="flex flex-col items-end gap-37 max-w-[70%]">
            <h2 className="font-oswald font-light leading-tight lg:leading-27.75 uppercase text-brand-gold text-right tracking-[0.06em]"
              style={{ fontSize: "clamp(24px, 5vw, 80px)" }}>
              Start building your film archive
            </h2>

            <Link
              href="/sign-up"
              className="flex items-center gap-2 font-oswald font-light leading-tight 
              lg:leading-12 uppercase text-brand-light tracking-[2.16px] 
              hover:text-brand-gold transition-colors"
              style={{ fontSize: "clamp(16px, 2vw, 36px)" }}
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
