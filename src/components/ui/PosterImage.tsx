"use client";

import { useState } from "react";
import Image from "next/image";

interface PosterImageProps {
  src: string;
  alt: string;
  sizes: string;
}

/**
 * Poster <Image> for catalogue/grid cards. TMDB already serves correctly-sized
 * CDN variants (e.g. w500), so we skip Next's image optimizer (`unoptimized`)
 * to avoid the dev optimizer 500/504s under many concurrent posters, and fall
 * back to the parent's placeholder if a poster path is broken.
 */
export default function PosterImage({ src, alt, sizes }: PosterImageProps) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}
