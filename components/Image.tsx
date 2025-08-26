"use client";

import NextImage, { ImageProps } from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const basePath = process.env.BASE_PATH;

const Image = ({
  src,
  className,
  onClick,
  alt,
  width,
  height,
  ...rest
}: ImageProps) => {
  const computedSrc: ImageProps["src"] =
    typeof src === "string" ? `${basePath || ""}${src}`.trimEnd() : src;

  // Valeurs par défaut pour éviter l'erreur Next.js
  const defaultWidth = width || 800;
  const defaultHeight = height || 600;

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // Empêche une éventuelle navigation si l'image est dans un lien
      event.preventDefault?.();
      event.stopPropagation?.();
      // Optionnel: déclencher le onClick fourni, sans se soucier du type exact
      // @ts-expect-error prop délégué pour compatibilité
      onClick?.(event);
      setIsOpen(true);
    },
    [onClick],
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const overlay = useMemo(() => {
    if (!isOpen) return null;
    if (typeof window === "undefined") return null;
    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center relative pointer-events-none"
      >
        <button
          type="button"
          aria-label="Fermer l'image agrandie"
          onClick={handleClose}
          className="relative w-[95vw] h-[90vh] cursor-zoom-out pointer-events-auto"
        >
          <NextImage
            src={computedSrc}
            alt={typeof alt === "string" ? alt : "image"}
            fill
            unoptimized
            className="object-contain rounded-lg"
            sizes="(max-width: 1024px) 95vw, 95vw"
            priority={false}
          />
        </button>
      </div>,
      document.body,
    );
  }, [isOpen, computedSrc, alt, handleClose]);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="p-0 m-0 bg-transparent border-0 leading-none"
        aria-label={
          typeof alt === "string"
            ? `Agrandir l'image: ${alt}`
            : "Agrandir l'image"
        }
      >
        <NextImage
          src={computedSrc}
          className={
            className ? `${className} cursor-zoom-in` : "cursor-zoom-in"
          }
          alt={alt}
          width={defaultWidth}
          height={defaultHeight}
          {...rest}
        />
      </button>
      {overlay}
    </>
  );
};

export default Image;
