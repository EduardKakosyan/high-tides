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
            title="A quiet stretch of coast that feels yours alone"
            description="High Tides sits on a private cove where the day moves with the water. Mornings start with mist on the bay; afternoons drift into long swims and slow lunches on the deck; evenings end around the fire pit, watching the lights from across the cove flicker on."
          />
          <RevealOnScroll
            direction="up"
            delay={0.1}
            className="flex flex-col gap-4 text-base leading-relaxed text-sea-900/80 sm:text-lg"
          >
            <p>
              It&rsquo;s the kind of place that fills up with the people you
              actually want to spend time with. Bring books you mean to read,
              meals you mean to cook, conversations you mean to have. The
              cottage keeps the rest of the world a comfortable distance away.
            </p>
            <p>
              We&rsquo;ve loved this place for years. We let it out to a small
              number of guests each season so it stays cared for and well-loved.
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
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sand-200 via-sand-100 to-sea-300/40"
            >
              <span className="font-display text-2xl text-sea-700">
                Photo placeholder
              </span>
            </div>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
