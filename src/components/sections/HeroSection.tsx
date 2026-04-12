import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const title = "BUILD YOUR TASTE";

  return (
    <section
      className="relative w-full overflow-hidden flex justify-center"
      style={{ height: "100vh", minHeight: "500px" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/imgs/hero_bg.png"
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-brand-dark/15" />
      </div>

      {/* Central Layout Container */}
      <div className="absolute z-10 w-[80%] max-w-[1669px] h-full left-1/2 -translate-x-1/2">
        {/* READ REVIEWS + TRACK FILMS row */}
        <div
          className="absolute w-full flex justify-between items-start opacity-80"
          style={{ top: "15%" }}
        >
          <Link
            href="#"
            className="text-brand-light font-oswald uppercase hover:opacity-60 transition-opacity"
            style={{
              fontWeight: 300,
              fontSize: "clamp(36px, 4.5vw, 70px)",
              letterSpacing: "0.05em",
            }}
          >
            READ REVIEWS
          </Link>
          <Link
            href="#"
            className="text-brand-light font-oswald uppercase hover:opacity-60 transition-opacity"
            style={{
              fontWeight: 300,
              fontSize: "clamp(20px, 2.3vw, 36px)",
              letterSpacing: "0.05em",
            }}
          >
            TRACK FILMS
          </Link>
        </div>

        {/* BUILD YOUR TASTE */}
        <div
          className="absolute w-full flex flex-col items-center"
          style={{ top: "32%" }}
        >
          <h1 className="sr-only">{title}</h1>
          <div
            className="text-brand-light font-oswald uppercase w-full select-none"
            aria-hidden="true"
            style={{
              fontWeight: 200,
              fontSize: "clamp(60px, 12.5vw, 190px)",
              letterSpacing: "0",
              lineHeight: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {title.split("").map((char, index) => (
              <span
                key={index}
                style={{
                  flex: char === " " ? "0.6" : "0 1 auto",
                  minWidth: char === " " ? "0.3em" : undefined,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>

        {/* EXPLORE FILMS → */}
        <div
          className="absolute right-0 flex flex-col items-end"
          style={{ bottom: "12%" }}
        >
          <Link
            href="#"
            className="uppercase font-oswald text-brand-light hover:opacity-60 transition-opacity flex items-center gap-3"
            style={{
              fontWeight: 300,
              fontSize: "clamp(20px, 2.3vw, 36px)",
              letterSpacing: "0.06em",
            }}
          >
            EXPLORE FILMS
            <span
              style={{
                fontSize: "0.7em",
                lineHeight: 1,
              }}
            >
              →
            </span>
          </Link>
          <div
            className="bg-brand-light/50 mt-2"
            style={{ height: "1px", width: "100%" }}
          />
        </div>
      </div>
    </section>
  );
}
