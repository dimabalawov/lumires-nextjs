import Image from "next/image";

import Button from "@/components/ui/Button";
import DetailColumn from "@/components/ui/DetailColumn";
import GradientDivider from "@/components/ui/GradientDivider";
import StarRating from "@/components/ui/StarRating";

export interface FilmHeroData {
  title: string;
  posterUrl: string | null;
  year?: string;
  primaryGenre?: string;
  runtime?: string;
  rating?: number;
  tagline?: string;
  overview?: string;
  cast: string[];
  genres: string[];
  directors: string[];
  studio?: string;
}

const CARD_GRADIENT =
  "linear-gradient(90deg, rgba(18,16,14,0.90) 10%, rgba(16,14,12,0.91) 32%, rgba(14,12,11,0.78) 53%, rgba(0,0,0,0) 100%)";

export default function FilmHero({ data }: { data: FilmHeroData }) {
  const metaParts = [data.year, data.primaryGenre, data.runtime].filter(Boolean) as string[];
  const rating = data.rating ?? 0;
  const empty = <span className="text-brand-muted/70">—</span>;

  return (
    <article
      className="film-card-border relative rounded-md overflow-hidden"
      style={{ background: CARD_GRADIENT }}
    >
      {/* Top: poster + info */}
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-6 md:gap-8 lg:gap-10 p-6 md:p-8 lg:p-10">
        <div className="relative w-full aspect-[2/3] overflow-hidden shadow-2xl">
          {data.posterUrl ? (
            <Image
              src={data.posterUrl}
              alt={data.title}
              fill
              sizes="(min-width: 1024px) 280px, (min-width: 768px) 240px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-dark/60" />
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="font-oswald font-light text-brand-gold leading-[1.02] tracking-[0.01em] text-4xl md:text-5xl lg:text-[64px]">
            {data.title}
          </h1>

          <p className="mt-3 font-manrope font-normal text-auth-subtitle text-[14px] lg:text-[18px] leading-[25px]">
            {metaParts.join(" • ")}
            {rating > 0 && (
              <>
                {" • "}
                <StarRating count={rating} max={5} />
              </>
            )}
          </p>

          <GradientDivider className="mt-4" />

          {data.tagline && (
            <p className="mt-6 uppercase font-manrope font-light text-brand-light tracking-[0.08em] text-[17px] lg:text-[18px]">
              {data.tagline}
            </p>
          )}

          {data.overview && (
            <p className="mt-3 font-manrope font-normal text-brand-light text-[16px] leading-[24px] tracking-[0.06em] max-w-[560px]">
              &ldquo;{data.overview}&rdquo;
            </p>
          )}

          <GradientDivider className="mt-6" />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              variant="goldOutlined"
              leftIcon={
                <svg
                  width="8"
                  height="10"
                  viewBox="0 0 15 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M0 0L15 10L0 20V0Z" />
                </svg>
              }
              rightIcon={
                <svg
                  width="15"
                  height="20"
                  viewBox="0 0 15 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M1 7L7.5 13L14 7" />
                </svg>
              }
            >
              Where to watch
            </Button>
            <Button variant="goldFilled">Write a review</Button>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <Button variant="neutralOutlined">+ Add to list</Button>
            <Button variant="neutralOutlined" iconOnly aria-label="Add to favorites">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom: details grid */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr_1fr] gap-y-8 gap-x-8 px-6 md:px-8 lg:px-10 pt-10 lg:pt-14 pb-8 lg:pb-10">
        <h2 className="uppercase font-oswald font-light text-brand-gold tracking-[0.18em] text-[28px] lg:text-[32px] leading-none self-start">
          Details
        </h2>

        <DetailColumn label="Main Cast">
          {data.cast.length > 0 ? (
            <ul className="space-y-1.5">
              {data.cast.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          ) : (
            empty
          )}
        </DetailColumn>

        <DetailColumn label="Genres">
          {data.genres.length > 0 ? (
            <ul className="space-y-1.5">
              {data.genres.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          ) : (
            empty
          )}
        </DetailColumn>

        <div className="flex flex-col gap-6">
          <DetailColumn label={data.directors.length > 1 ? "Directors" : "Director"}>
            {data.directors.length > 0 ? (
              <ul className="space-y-1.5">
                {data.directors.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            ) : (
              empty
            )}
          </DetailColumn>
          <DetailColumn label="Studio">{data.studio ?? empty}</DetailColumn>
        </div>
      </div>
    </article>
  );
}
