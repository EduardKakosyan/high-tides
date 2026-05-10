import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

export function Amenities() {
  return (
    <section
      id="amenities"
      aria-labelledby="amenities-heading"
      className="bg-deep py-28 text-foam sm:py-40"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 sm:px-10">
        <SectionHeading
          id="amenities-heading"
          eyebrow="What’s here"
          title="The honest inventory"
          description="Not a checklist for a hotel. Here’s what’s actually waiting when you open the door, what works, and what you can grab on the way out."
        />

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {site.amenities.map((group, groupIdx) => (
            <RevealOnScroll
              key={group.title}
              direction="up"
              delay={groupIdx * 0.08}
              className="flex flex-col gap-5 border-t border-foam/15 pt-6"
            >
              <h3 className="font-display text-2xl text-foam">{group.title}</h3>
              <ul className="flex flex-col gap-3 text-base leading-relaxed text-foam/80">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-2 h-px w-6 flex-none bg-foam/40"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
