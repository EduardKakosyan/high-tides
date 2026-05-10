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
            description="High Tides sits a little way back from the water in Port Mouton, an old fishing village on Nova Scotia's South Shore. Four minutes on foot puts you on a private stretch of beach. The wharf is just down the road; the lobster boats head out before you&rsquo;re up."
          />
          <RevealOnScroll
            direction="up"
            delay={0.1}
            className="flex flex-col gap-4 text-base leading-relaxed text-teal-900/80 sm:text-lg"
          >
            <p>
              It&rsquo;s the kind of place that fills up with the people you
              actually want to spend time with. Bring books you mean to read,
              meals you mean to cook, conversations you mean to have. The
              village keeps the rest of the world a comfortable distance away.
            </p>
            <p>
              We&rsquo;ve been coming here for years. We let it out to a small
              number of guests each season so it stays cared for and well-loved
              — and the neighbours keep being the neighbours.
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
