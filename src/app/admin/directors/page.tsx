import Image from "next/image";
import { getDiscussedDirectors } from "@/lib/directors/discussed";
import DirectorMentionsForm from "./DirectorMentionsForm";
import SyncAllButton from "./SyncAllButton";

export const metadata = { title: "Directors · Admin · Lumires" };

export default async function AdminDirectorsPage() {
  const directors = await getDiscussedDirectors();

  return (
    <div>
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="font-manrope font-light text-brand-light text-[28px] lg:text-[40px] tracking-[0.06em]">
          Most Discussed <span className="text-brand-gold">Directors</span>
        </h1>
        <SyncAllButton />
      </div>
      <p className="font-manrope text-[14px] text-brand-muted mb-10">
        Set each director&apos;s mention count, or sync it from live TMDB popularity (↻). The
        section auto-sorts from most to least.
      </p>

      <ul className="flex flex-col divide-y divide-brand-muted/15">
        {directors.map((d) => (
          <li key={d.id} className="flex items-center gap-5 py-5">
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-[3px]">
              <Image src={d.image} alt={d.name} fill className="object-cover" sizes="48px" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-oswald text-brand-gold text-[20px] leading-tight truncate">
                {d.name}
              </h2>
              <p className="font-manrope text-[13px] text-brand-muted truncate">
                currently discussed: {d.currentFilm}
              </p>
            </div>

            <DirectorMentionsForm
              id={d.id}
              name={d.name}
              initialMentions={d.mentionsCount}
              canSync={d.tmdbId != null}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
