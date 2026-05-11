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
            title="Port Mouton, on the Lighthouse Route"
            description="Route 103 south from Halifax, then a turn-off you’d miss without the GPS. Blueberry barrens on the left, the South Shore opening up on the right."
          />
          <RevealOnScroll
            direction="up"
            delay={0.1}
            className="flex flex-col gap-3 text-base text-navy-900/85 sm:text-lg"
          >
            <p className="font-medium text-deep">{site.address.line1}</p>
            {site.address.line2 ? <p>{site.address.line2}</p> : null}
            <p>
              {site.address.city}, {site.address.region}
              {site.address.postal ? `, ${site.address.postal}` : ""}
            </p>
            <p>{site.address.country}</p>
            <ul className="mt-4 grid gap-2 text-base text-navy-900/80">
              <li className="flex justify-between gap-6 border-b border-navy-900/10 pb-2">
                <span>Private beach</span>
                <span className="text-navy-700">4-minute walk</span>
              </li>
              <li className="flex justify-between gap-6 border-b border-navy-900/10 pb-2">
                <span>Carters Beach</span>
                <span className="text-navy-700">5 minutes by car</span>
              </li>
              <li className="flex justify-between gap-6 border-b border-navy-900/10 pb-2">
                <span>Kejimkujik Seaside</span>
                <span className="text-navy-700">15 minutes</span>
              </li>
              <li className="flex justify-between gap-6 border-b border-navy-900/10 pb-2">
                <span>Liverpool</span>
                <span className="text-navy-700">20 minutes</span>
              </li>
              <li className="flex justify-between gap-6 border-b border-navy-900/10 pb-2">
                <span>Lunenburg</span>
                <span className="text-navy-700">~1 hour</span>
              </li>
              <li className="flex justify-between gap-6">
                <span>Halifax</span>
                <span className="text-navy-700">~2 hours</span>
              </li>
            </ul>
            <p className="mt-3 text-sm text-navy-700">
              We send the driveway, the door code, and a couple of local tips
              once your dates are confirmed.
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
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-300/40 via-sand-100 to-sand-200"
            >
              <span className="font-display text-2xl text-navy-700">
                Map placeholder
              </span>
            </div>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
