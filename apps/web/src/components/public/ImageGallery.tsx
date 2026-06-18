"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/catalog";

export function ImageGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-sm bg-ivoire">
        {active && (
          <Image
            src={active.url}
            alt={active.alt ?? productName}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, index) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-sm border ${
                index === activeIndex ? "border-or" : "border-noir/10"
              }`}
            >
              <Image src={img.url} alt={img.alt ?? productName} fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
