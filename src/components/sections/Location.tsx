import { CldImage } from "@/lib/cld-client";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hasCloudinary } from "@/lib/cloudinary";
import { location } from "@/lib/media";
import { site } from "@/lib/site";

export function Location() {
  return (
    <section
      id="location"
      aria-labelledby="location-heading"
      className="bg-sand-100 py-28 sm:py-40"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-16 px-6 sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="location-heading"
            eyebrow="Getting here"
            title="A short drive from the city, a world away"
            description={`High Tides is tucked along the coast in ${site.address.region}. The drive from town takes about an hour — long enough for the road to clear your head, short enough that you can swim before lunch.`}
          />
          <RevealOnScroll
            direction="up"
            delay={0.1}
            className="flex flex-col gap-2 text-base text-sea-900/85 sm:text-lg"
          >
            <p className="font-medium text-deep">{site.address.line1}</p>
            {site.address.line2 ? <p>{site.address.line2}</p> : null}
            <p>
              {site.address.city}, {site.address.region}
              {site.address.postal ? `, ${site.address.postal}` : ""}
            </p>
            <p>{site.address.country}</p>
            <p className="mt-2 text-sm text-sea-700">
              Precise directions are shared when we confirm your dates.
            </p>
          </RevealOnScroll>
        </div>

        <RevealOnScroll
          direction="right"
          className="relative aspect-[5/4] w-full overflow-hidden rounded-md bg-sand-200 shadow-[0_30px_60px_-30px_rgba(14,31,36,0.35)]"
        >
          {hasCloudinary ? (
            <CldImage
              src={location.publicId}
              alt={location.alt}
              width={location.width}
              height={location.height}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sea-300/40 via-sand-100 to-sand-200"
            >
              <span className="font-display text-2xl text-sea-700">
                Map placeholder
              </span>
            </div>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
