"use client";

import { useState, useEffect, useRef } from "react";

interface ImageModalProps {
  images: { src: string; alt: string; caption: string }[];
  initialIndex?: number;
}

export default function ImageModal({ images, initialIndex = 0 }: ImageModalProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(initialIndex);
  const [scale, setScale] = useState(1);

  const imgRef = useRef<HTMLImageElement | null>(null);

  // reset zoom tiap kali ganti gambar
  useEffect(() => {
    setScale(1);
  }, [current]);

  // keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) setScale((s) => Math.min(s + 0.1, 3)); // zoom in
    else setScale((s) => Math.max(s - 0.1, 1)); // zoom out
  };

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="cursor-pointer border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
            onClick={() => {
              setCurrent(i);
              setOpen(true);
            }}
          >
            <img src={img.src} alt={img.alt} className="w-full h-auto object-contain" />
            <div className="p-3 text-center text-sm text-gray-500">{img.caption}</div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl md:max-w-4xl md:w-4/5"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              ref={imgRef}
              src={images[current].src}
              alt={images[current].alt}
              className="w-full h-auto object-contain rounded-lg shadow-lg transition-transform duration-200"
              style={{ transform: `scale(${scale})` }}
              onWheel={handleWheel}
            />
            <p className="text-center text-white text-sm mt-3">
              {images[current].caption}
            </p>

            {/* Close */}
            <button
              className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 shadow hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                  onClick={prev}
                >
                  ◀
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                  onClick={next}
                >
                  ▶
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
