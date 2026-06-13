"use client";

import Image from "next/image";

export function EditFavouritesButton() {
  return (
    <button
      type="button"
      className="flex items-center gap-3 text-brand-gold uppercase 
        font-manrope font-semibold text-[11px] h-fit py-2 border border-brand-gold bg-brand-gold/10 px-2 rounded"
    >
      <Image src="/imgs/profile/config.svg" alt="" width={20} height={20} />
      Edit favourites
    </button>
  );
}