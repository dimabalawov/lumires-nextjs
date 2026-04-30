import Link from "next/link";

const catalogLinks = [
  { label: "Films", href: "/films" },
  { label: "Reviews", href: "/reviews" },
  { label: "Lists", href: "/lists" },
  { label: "Threads", href: "/threads" },
  { label: "Community", href: "/community" },
];

const infoLinks = [
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark pt-11 pb-16">
      <div className="section-container flex flex-col gap-8">
      {/* Gradient divider */}
      <div className="h-px w-full [background:linear-gradient(90deg,rgba(155,143,132,0)_0%,rgba(155,143,132,1)_47%,rgba(155,143,132,0)_100%)]" />

      {/* Body */}
      <div className="flex flex-col gap-20">
        {/* 4-column row */}
        <div className="grid grid-cols-2 gap-8 lg:flex lg:justify-between">
          {/* Col 1 — Brand */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-6 lg:w-[168px]">
            <span className="font-manrope text-[18px] leading-[1.366em] uppercase tracking-[0.06em] text-[#DACBBD]">
              Logo
            </span>
            <p className="font-manrope text-[14px] leading-[2.143em] uppercase tracking-[0.06em] text-white">
              Track films, read reviews and explore what others are watching.
            </p>
          </div>

          {/* Col 2 — Catalog */}
          <div className="flex flex-col gap-6 lg:w-[96px]">
            <span className="font-manrope text-[18px] leading-[1.366em] uppercase tracking-[0.06em] text-[#DACBBD]">
              Catalog
            </span>
            <nav className="flex flex-col gap-4">
              {catalogLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-manrope text-[14px] leading-[1.366em] uppercase tracking-[0.06em] text-white underline decoration-solid hover:text-brand-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Information */}
          <div className="flex flex-col gap-6 lg:w-[141px]">
            <span className="font-manrope text-[18px] leading-[1.366em] uppercase tracking-[0.06em] text-[#DACBBD]">
              Information
            </span>
            <nav className="flex flex-col gap-4">
              {infoLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-manrope text-[14px] leading-[1.366em] uppercase tracking-[0.06em] text-white underline decoration-solid hover:text-brand-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4 — Social icons */}
          <div className="col-span-2 lg:col-span-1 flex lg:items-end gap-4">
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1" fill="white" />
              </svg>
            </a>
            {/* TikTok */}
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg width="23" height="23" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
              </svg>
            </a>
          </div>
        </div>

        {/* TMDB attribution */}
        <div className="flex flex-col gap-2 w-full lg:w-[446px]">
          {/* TMDB pill logo */}
          <svg width="48" height="23" viewBox="0 0 48 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tmdb-grad" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#90CEA1" />
                <stop offset="56%" stopColor="#3CBEC9" />
                <stop offset="100%" stopColor="#00B3E5" />
              </linearGradient>
            </defs>
            {/* TM text */}
            <text x="0" y="9" fontFamily="Arial" fontWeight="bold" fontSize="7" fill="url(#tmdb-grad)">TM</text>
            {/* DB text */}
            <text x="0" y="18" fontFamily="Arial" fontWeight="bold" fontSize="7" fill="url(#tmdb-grad)">DB</text>
            {/* Top pill */}
            <rect x="14" y="3" width="34" height="7" rx="3.5" fill="url(#tmdb-grad)" />
            {/* Bottom pill */}
            <rect x="14" y="13" width="34" height="7" rx="3.5" fill="url(#tmdb-grad)" />
          </svg>
          <p className="font-manrope text-[12px] leading-[1.366em] uppercase tracking-[0.06em] text-brand-gold">
            This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
}
