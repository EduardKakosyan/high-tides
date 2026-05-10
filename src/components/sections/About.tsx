import { CldImage } from "@/lib/cld-client";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hasCloudinary } from "@/lib/cloudinary";
import { about } from "@/lib/media";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-foam py-28 sm:py-40"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-16 px-6 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-24">
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="about-heading"
            eyebrow="The place"
            title="A small cottage in a smaller village"
            description="An old fishing settlement of maybe a hundred houses, a Tim Hortons twenty minutes away, and a cove that goes from glass to whitecaps by lunch. The lobster boats leave the wharf before sunrise — you can hear the diesels start from the porch."
          />
          <RevealOnScroll
            direction="up"
            delay={0.1}
            className="flex flex-col gap-4 text-base leading-relaxed text-teal-900/80 sm:text-lg"
          >
            <p>
              A four-minute walk through the spruce puts you on a private
              stretch of beach. In June it&rsquo;s lupins along the path and fog
              that burns off by ten. In late August the water finally warms up.
              September is our favourite — emptier, sharper, the surf louder
              against fewer voices.
            </p>
            <p>
              We&rsquo;ve had the cottage in the family a long time. A handful
              of guests each season keeps it lived-in without wearing it out.
              The people next door will wave when you pull in; that&rsquo;s
              about the welcoming committee.
            </p>
          </RevealOnScroll>
        </div>

        <RevealOnScroll
          direction="left"
          className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-sand-100 shadow-[0_30px_60px_-30px_rgba(14,31,36,0.35)]"
        >
          {hasCloudinary ? (
            <CldImage
              src={about.publicId}
              alt={about.alt}
              width={about.width}
              height={about.height}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sand-200 via-sand-100 to-teal-300/40"
            >
              <span className="font-display text-2xl text-teal-700">
                Photo placeholder
              </span>
            </div>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
