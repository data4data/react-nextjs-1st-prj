import Image from "next/image";

import { SectionShell } from "@/components/sections/section-shell";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselSectionData } from "@/lib/cms/types";

/**
 * The hero slider.
 *
 * The carousel itself is a client component (it listens to drags and clicks),
 * but this wrapper stays a server component: it only arranges the slides.
 *
 * Each slide has a fixed aspect ratio, so a tall or missing image can never
 * change the height of the page.
 */
export function CarouselSection({
  section,
  index,
}: {
  section: CarouselSectionData;
  index: number;
}) {
  return (
    <SectionShell id={section.id} index={index} bleed>
      <Carousel opts={{ loop: section.slides.length > 1 }} className="w-full">
        <CarouselContent className="ml-0">
          {section.slides.map((slide, slideIndex) => (
            <CarouselItem key={`${section.id}-${slideIndex}`} className="pl-0">
              <div className="relative aspect-[4/3] w-full sm:aspect-[21/9]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="100vw"
                  priority={slideIndex === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                <div className="absolute inset-x-0 bottom-0">
                  <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:pb-16">
                    <h2 className="max-w-2xl text-3xl font-semibold text-balance text-white sm:text-5xl">
                      {slide.title}
                    </h2>
                    {slide.text ? (
                      <p className="mt-4 max-w-xl text-pretty text-white/90 sm:text-lg">
                        {slide.text}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {section.slides.length > 1 ? (
          <>
            <CarouselPrevious className="left-4 hidden sm:flex" />
            <CarouselNext className="right-4 hidden sm:flex" />
          </>
        ) : null}
      </Carousel>
    </SectionShell>
  );
}
