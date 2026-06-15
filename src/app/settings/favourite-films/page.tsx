import { redirect } from "next/navigation";
import { getSettings } from "@/lib/api/users";
import FavoriteFilms from "@/components/sections/FavouriteFilmsEdit";

export default async function SettingsFavoritesPage() {
  const me = await getSettings();
  if (!me) redirect("/login");

  return (
    <div className="flex flex-col">
      <p className="font-oswald font-light text-[11px] uppercase tracking-[3.3px] leading-2.75 text-brand-gold">Favorite films</p>
      <span className="mt-2 h-fit font-manrope text-[34px] text-brand-light">Your four favorites</span>
      <p className="mt-3 max-w-lg font-manrope text-[14px] leading-relaxed text-brand-muted">
        These appear prominently at the top of your profile. Choose the films that define your taste.
      </p>

      <FavoriteFilms initial={me} />
    </div>
  );
}