"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function GlobalImageZoom() {
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  const [openAlt, setOpenAlt] = useState<string>("");
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const path = (event.composedPath?.() || []) as Array<EventTarget>;
      const imgInPath = path.find((el) => el instanceof HTMLImageElement) as
        | HTMLImageElement
        | undefined;
      const target = event.target as HTMLElement | null;
      const imgFromTarget =
        (target?.tagName === "IMG"
          ? (target as HTMLImageElement)
          : (target?.querySelector?.("img") as HTMLImageElement | null)) ||
        null;
      const img = imgInPath || imgFromTarget;
      if (!img) return;
      const inProse = img.closest(".prose");
      if (!inProse) return;
      event.preventDefault();
      event.stopPropagation();
      setOpenSrc(img.currentSrc || img.src);
      setOpenAlt(img.alt || "image");
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (!openSrc) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenSrc(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSrc]);

  if (!openSrc) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center"
    >
      <button
        type="button"
        aria-label="Fermer l'image agrandie"
        className="absolute inset-0 cursor-zoom-out"
        onClick={() => setOpenSrc(null)}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpenSrc(null);
          }
        }}
      />
      <div className="relative w-[95vw] h-[90vh] pointer-events-none">
        <Image
          src={openSrc}
          alt={openAlt}
          fill
          unoptimized
          className="object-contain rounded-lg pointer-events-auto"
          sizes="(max-width: 1024px) 95vw, 95vw"
          priority={false}
        />
      </div>
    </div>
  );
}
